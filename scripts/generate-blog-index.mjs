#!/usr/bin/env node
/**
 * Build-time blog index generator.
 *
 * Reads every markdown file in `src/content/blog`, validates its front matter,
 * and emits typed TypeScript into `src/app/core/data/generated`.
 *
 * Why compile posts in rather than fetching them at runtime:
 *   - Prerendering and SSR need the content synchronously, without a network hop.
 *   - Front matter is validated here, so a malformed post fails `npm run build`
 *     instead of rendering broken in production.
 *   - Each post body becomes its own module, so esbuild code-splits it into a
 *     chunk that is only downloaded when that post is opened.
 *
 * Run automatically via the `prebuild` / `prestart` npm hooks.
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = join(ROOT, 'src/content/blog');
const OUTPUT_DIR = join(ROOT, 'src/app/core/data/generated');
const POSTS_DIR = join(OUTPUT_DIR, 'posts');

const REQUIRED_FIELDS = ['title', 'description', 'date', 'tags'];
const WORDS_PER_MINUTE = 220;

/** Minimal YAML front-matter reader: the flat key/value subset we actually use. */
function parseFrontMatter(raw, file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);

  if (!match) {
    throw new Error(`${file}: missing front matter block (expected a leading '---' fence).`);
  }

  const data = {};

  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf(':');
    if (separator === -1) {
      throw new Error(`${file}: cannot parse front-matter line "${trimmed}".`);
    }

    data[trimmed.slice(0, separator).trim()] = coerce(trimmed.slice(separator + 1).trim());
  }

  return { data, body: raw.slice(match[0].length).trim() };
}

function coerce(value) {
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);

  // YAML flow sequences, quoted or bare: [a, b] and ["a", "b"] both parse.
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (inner === '') return [];

    return inner.split(',').map((entry) => coerce(entry.trim()));
  }

  return value.replace(/^['"]|['"]$/g, '');
}

function countWords(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-|]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Deterministic hue pair so a post's cover art is stable across builds. */
function coverFromSlug(slug) {
  const hash = createHash('sha256').update(slug).digest();
  return [((hash[0] * 360) / 256) | 0, ((hash[1] * 360) / 256) | 0];
}

function validate(data, slug, file) {
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === '') {
      throw new Error(`${file}: front matter is missing required field "${field}".`);
    }
  }

  if (Number.isNaN(Date.parse(data.date))) {
    throw new Error(`${file}: "date" must be an ISO-8601 date, received "${data.date}".`);
  }

  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    throw new Error(`${file}: "tags" must be a non-empty array, e.g. tags: [angular, testing].`);
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${file}: filename must be a lowercase kebab-case slug.`);
  }
}

async function main() {
  let files;

  try {
    files = (await readdir(CONTENT_DIR)).filter((name) => name.endsWith('.md')).sort();
  } catch {
    throw new Error(`Content directory not found: ${CONTENT_DIR}`);
  }

  const posts = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(join(CONTENT_DIR, file), 'utf8');
    const { data, body } = parseFrontMatter(raw, file);

    validate(data, slug, file);

    const wordCount = countWords(body);

    posts.push({
      meta: {
        slug,
        title: String(data.title),
        description: String(data.description),
        date: new Date(data.date).toISOString(),
        tags: data.tags.map(String),
        readingTime: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
        wordCount,
        featured: data.featured === true,
        draft: data.draft === true,
        cover: Array.isArray(data.cover) ? data.cover.map(Number) : coverFromSlug(slug),
      },
      body,
    });
  }

  // Newest first — the order the UI wants, computed once here.
  posts.sort((a, b) => Date.parse(b.meta.date) - Date.parse(a.meta.date));

  const duplicates = posts.map((p) => p.meta.slug).filter((s, i, all) => all.indexOf(s) !== i);
  if (duplicates.length) {
    throw new Error(`Duplicate post slugs: ${duplicates.join(', ')}`);
  }

  await rm(POSTS_DIR, { recursive: true, force: true });
  await mkdir(POSTS_DIR, { recursive: true });

  const banner = [
    '/**',
    ' * AUTO-GENERATED — DO NOT EDIT.',
    ' * Source: src/content/blog/*.md',
    ' * Regenerate with: npm run blog:index',
    ' */',
    '',
  ].join('\n');

  for (const { meta, body } of posts) {
    await writeFile(
      join(POSTS_DIR, `${meta.slug}.ts`),
      `${banner}export default ${JSON.stringify(body)};\n`,
      'utf8',
    );
  }

  const indexSource = [
    banner,
    `import { BlogPostMeta } from '../../models/blog-post.model';`,
    '',
    '/** Post metadata, newest first. Eagerly available for lists and SEO. */',
    'export const BLOG_INDEX: readonly BlogPostMeta[] = [',
    ...posts.map(({ meta }) => `  ${JSON.stringify(meta)},`),
    '];',
    '',
    '/**',
    ' * Lazily-loaded post bodies. Each entry is a separate chunk, so opening one',
    ' * post never downloads the others.',
    ' */',
    'export const BLOG_CONTENT: Readonly<Record<string, () => Promise<string>>> = {',
    ...posts.map(
      ({ meta }) =>
        `  '${meta.slug}': () => import('./posts/${meta.slug}').then((m) => m.default),`,
    ),
    '};',
    '',
  ].join('\n');

  await writeFile(join(OUTPUT_DIR, 'blog-index.ts'), indexSource, 'utf8');

  const published = posts.filter((p) => !p.meta.draft).length;
  console.log(
    `[blog:index] ${posts.length} post(s) indexed (${published} published, ${posts.length - published} draft).`,
  );
}

main().catch((error) => {
  console.error(`[blog:index] ${error.message}`);
  process.exitCode = 1;
});
