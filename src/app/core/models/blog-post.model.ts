/**
 * Front-matter contract for every file in `src/content/blog`.
 * Validated at build time by `scripts/generate-blog-index.mjs`, so a malformed
 * post fails the build rather than rendering broken at runtime.
 */
export interface BlogPostMeta {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  /** ISO-8601 date string. */
  readonly date: string;
  readonly tags: readonly string[];
  readonly readingTime: number;
  readonly wordCount: number;
  readonly featured: boolean;
  readonly draft: boolean;
  readonly cover: readonly [number, number];
}

/** A post with its markdown body resolved. */
export interface BlogPost extends BlogPostMeta {
  readonly markdown: string;
}

export interface TableOfContentsEntry {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
}
