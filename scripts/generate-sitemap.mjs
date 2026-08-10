#!/usr/bin/env node
/**
 * Post-build sitemap generator.
 *
 * Walks the prerendered browser output and emits one `<url>` entry per
 * `index.html` found. Deriving the sitemap from the actual build output rather
 * than from a hand-maintained route list means it can never drift: if a page
 * was prerendered it is in the sitemap, and if it was not, it is not.
 *
 * Runs automatically via the `postbuild` npm hook.
 */
import { readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BROWSER_DIR = join(ROOT, 'dist/portfolio/browser');
const ORIGIN = (process.env.SITE_ORIGIN ?? 'https://ashishkumar.dev').replace(/\/$/, '');

/** Routes that should never be advertised to crawlers. */
const EXCLUDED = new Set(['/404']);

/** Shallower pages are more important; the blog index outranks its posts. */
function priorityFor(route) {
  if (route === '/') return '1.0';

  const depth = route.split('/').filter(Boolean).length;
  return depth === 1 ? '0.8' : '0.6';
}

function changeFrequencyFor(route) {
  if (route === '/' || route === '/blog') return 'weekly';
  return 'monthly';
}

async function collectRoutes(directory, base = '') {
  const routes = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);

    if (entry.isDirectory()) {
      routes.push(...(await collectRoutes(absolute, `${base}/${entry.name}`)));
      continue;
    }

    if (entry.name === 'index.html') {
      routes.push(base === '' ? '/' : base);
    }
  }

  return routes;
}

async function main() {
  try {
    await stat(BROWSER_DIR);
  } catch {
    console.warn(`[sitemap] No build output at ${relative(ROOT, BROWSER_DIR)}; skipping.`);
    return;
  }

  const routes = (await collectRoutes(BROWSER_DIR))
    .map((route) => route.split(sep).join('/'))
    .filter((route) => !EXCLUDED.has(route))
    .sort((a, b) => a.localeCompare(b));

  const today = new Date().toISOString().slice(0, 10);

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes.flatMap((route) => [
      '  <url>',
      `    <loc>${ORIGIN}${route === '/' ? '/' : route}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${changeFrequencyFor(route)}</changefreq>`,
      `    <priority>${priorityFor(route)}</priority>`,
      '  </url>',
    ]),
    '</urlset>',
    '',
  ].join('\n');

  await writeFile(join(BROWSER_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log(`[sitemap] ${routes.length} route(s) written to dist/portfolio/browser/sitemap.xml`);
}

main().catch((error) => {
  console.error(`[sitemap] ${error.message}`);
  process.exitCode = 1;
});
