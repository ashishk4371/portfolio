import { countWords, estimateReadingTime, extractExcerpt, renderMarkdown } from './markdown.util';

describe('renderMarkdown', () => {
  it('gives headings stable ids and collects a table of contents', () => {
    const { html, toc } = renderMarkdown('## First section\n\n### Nested bit\n\n# Not collected');

    expect(html).toContain('id="first-section"');
    expect(toc).toEqual([
      { id: 'first-section', text: 'First section', level: 2 },
      { id: 'nested-bit', text: 'Nested bit', level: 3 },
    ]);
  });

  it('de-duplicates ids so repeated headings still deep-link correctly', () => {
    const { toc } = renderMarkdown('## Setup\n\ntext\n\n## Setup\n\nmore');

    expect(toc.map((entry) => entry.id)).toEqual(['setup', 'setup-2']);
  });

  it('highlights fenced code and labels the language', () => {
    const { html } = renderMarkdown('```ts\nconst answer = 42;\n```');

    expect(html).toContain('class="hljs language-ts"');
    expect(html).toContain('<span class="code-lang">ts</span>');
    expect(html).toContain('hljs-keyword');
  });

  it('escapes code in an unknown language rather than injecting it raw', () => {
    const { html } = renderMarkdown('```\n<script>alert(1)</script>\n```');

    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert(1)</script>');
  });

  it('opens external links in a new tab with rel hardening, but leaves internal links alone', () => {
    const { html } = renderMarkdown('[out](https://example.com) and [in](/blog)');

    expect(html).toContain('href="https://example.com" target="_blank" rel="noopener noreferrer"');
    expect(html).toContain('href="/blog"');
    expect(html.match(/target="_blank"/g)).toHaveLength(1);
  });

  it('does not leak renderer state between calls', () => {
    const first = renderMarkdown('## Shared');
    const second = renderMarkdown('## Shared');

    // A shared `marked` singleton would produce "shared-2" on the second call.
    expect(first.toc[0]?.id).toBe('shared');
    expect(second.toc[0]?.id).toBe('shared');
  });
});

describe('countWords', () => {
  it('ignores fenced code blocks so reading time reflects prose', () => {
    const withCode = countWords(
      'one two three\n\n```ts\nconst a = 1; const b = 2; const c = 3;\n```',
    );

    expect(withCode).toBe(3);
  });

  it('counts link text rather than the URL', () => {
    expect(countWords('see [the docs](https://example.com/a/very/long/path)')).toBe(3);
  });
});

describe('estimateReadingTime', () => {
  it('never reports less than a minute', () => {
    expect(estimateReadingTime('short')).toBe(1);
  });

  it('scales with word count', () => {
    expect(estimateReadingTime(Array(440).fill('word').join(' '))).toBe(2);
  });
});

describe('extractExcerpt', () => {
  it('skips headings and code, returning the first real paragraph', () => {
    const excerpt = extractExcerpt('# Title\n\nThe actual opening line.\n\nSecond paragraph.');

    expect(excerpt).toBe('The actual opening line.');
  });

  it('truncates with an ellipsis past the limit', () => {
    const excerpt = extractExcerpt('a'.repeat(300), 20);

    expect(excerpt).toHaveLength(21);
    expect(excerpt.endsWith('…')).toBe(true);
  });
});
