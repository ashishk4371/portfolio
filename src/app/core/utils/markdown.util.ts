import hljs from 'highlight.js/lib/common';
import { Marked, Renderer, Tokens } from 'marked';

import { TableOfContentsEntry } from '../models';
import { uniqueSlug } from './slug.util';

/**
 * Markdown rendering.
 *
 * A dedicated `Marked` instance is used instead of the global singleton so
 * configuration cannot leak between callers (which matters on the server,
 * where one process renders every route).
 *
 * Only the `common` highlight.js bundle is imported — the full distribution is
 * ~900kB and registers 190 languages we will never use.
 */
export interface RenderedMarkdown {
  readonly html: string;
  readonly toc: readonly TableOfContentsEntry[];
}

export function renderMarkdown(markdown: string): RenderedMarkdown {
  const toc: TableOfContentsEntry[] = [];
  const usedIds = new Set<string>();
  const renderer = new Renderer();

  /**
   * Headings get a stable id plus a visible anchor link, so a reader can deep
   * link to a section and the table of contents has something to target.
   */
  renderer.heading = function heading({ tokens, depth }: Tokens.Heading): string {
    const text = this.parser.parseInline(tokens);
    const plain = stripHtml(text);
    const id = uniqueSlug(plain, usedIds);

    if (depth === 2 || depth === 3) {
      toc.push({ id, text: plain, level: depth });
    }

    return (
      `<h${depth} id="${id}">${text}` +
      `<a class="heading-anchor" href="#${id}" aria-label="Link to section: ${escapeHtml(plain)}">#</a>` +
      `</h${depth}>`
    );
  };

  /** Syntax highlighting happens at render time so no highlighter runs client-side. */
  renderer.code = ({ text, lang }: Tokens.Code): string => {
    const language = (lang ?? '').split(/\s+/)[0] ?? '';
    const isSupported = language && hljs.getLanguage(language);

    const highlighted = isSupported
      ? hljs.highlight(text, { language, ignoreIllegals: true }).value
      : escapeHtml(text);

    const label = isSupported ? `<span class="code-lang">${escapeHtml(language)}</span>` : '';

    return (
      `<pre class="code-block">${label}` +
      `<code class="hljs language-${escapeHtml(language || 'plaintext')}">${highlighted}</code>` +
      `</pre>`
    );
  };

  /** External links open in a new tab and carry the usual rel hardening. */
  renderer.link = function link({ href, title, tokens }: Tokens.Link): string {
    const text = this.parser.parseInline(tokens);
    const isExternal = /^https?:\/\//i.test(href);
    const attrs = [
      `href="${escapeHtml(href)}"`,
      title ? `title="${escapeHtml(title)}"` : '',
      isExternal ? 'target="_blank" rel="noopener noreferrer"' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `<a ${attrs}>${text}</a>`;
  };

  const instance = new Marked({ gfm: true, breaks: false, renderer });
  const html = instance.parse(markdown, { async: false });

  return { html, toc };
}

/** Word count on the prose only — code fences would inflate reading time. */
export function estimateReadingTime(markdown: string, wordsPerMinute = 220): number {
  return Math.max(1, Math.round(countWords(markdown) / wordsPerMinute));
}

export function countWords(markdown: string): number {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-|]/g, ' ');

  return prose.split(/\s+/).filter(Boolean).length;
}

/** First paragraph of a post, for list previews and meta descriptions. */
export function extractExcerpt(markdown: string, maxLength = 180): string {
  const paragraph = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !block.startsWith('#') && !block.startsWith('```'));

  if (!paragraph) return '';

  const plain = paragraph.replace(/\s+/g, ' ').replace(/[*_`]/g, '');
  return plain.length <= maxLength ? plain : `${plain.slice(0, maxLength).trimEnd()}…`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}
