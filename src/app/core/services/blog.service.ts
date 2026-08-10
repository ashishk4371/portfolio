import { Injectable, computed, signal } from '@angular/core';

import { BLOG_CONTENT, BLOG_INDEX } from '../data/generated/blog-index';
import { BlogPost, BlogPostMeta } from '../models';

export interface BlogFilters {
  readonly query: string;
  readonly tag: string | null;
}

/**
 * Read model over the compiled blog index.
 *
 * Metadata is available synchronously (it is bundled), which is what lets the
 * blog list prerender with no loading state. Post bodies are dynamic imports,
 * so opening one post never downloads the rest.
 *
 * Drafts are filtered out of every public accessor rather than at the call
 * sites, so a draft cannot leak by someone forgetting the check.
 */
@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly published: readonly BlogPostMeta[] = BLOG_INDEX.filter((post) => !post.draft);

  private readonly contentCache = new Map<string, string>();

  private readonly filterState = signal<BlogFilters>({ query: '', tag: null });

  readonly filters = this.filterState.asReadonly();

  /** Every published post, newest first. */
  readonly posts = signal<readonly BlogPostMeta[]>(this.published).asReadonly();

  readonly featured = computed(() => this.posts().filter((post) => post.featured));

  /** Tags ordered by frequency, so the busiest filters surface first. */
  readonly tags = computed<readonly { tag: string; count: number }[]>(() => {
    const counts = new Map<string, number>();

    for (const post of this.posts()) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  });

  readonly filteredPosts = computed<readonly BlogPostMeta[]>(() => {
    const { query, tag } = this.filterState();
    const needle = query.trim().toLowerCase();

    return this.posts().filter((post) => {
      if (tag && !post.tags.includes(tag)) return false;
      if (!needle) return true;

      return (
        post.title.toLowerCase().includes(needle) ||
        post.description.toLowerCase().includes(needle) ||
        post.tags.some((postTag) => postTag.toLowerCase().includes(needle))
      );
    });
  });

  readonly hasActiveFilters = computed(() => {
    const { query, tag } = this.filterState();
    return query.trim().length > 0 || tag !== null;
  });

  setQuery(query: string): void {
    this.filterState.update((current) => ({ ...current, query }));
  }

  /** Selecting the active tag clears it, so the chip acts as a toggle. */
  toggleTag(tag: string): void {
    this.filterState.update((current) => ({
      ...current,
      tag: current.tag === tag ? null : tag,
    }));
  }

  clearFilters(): void {
    this.filterState.set({ query: '', tag: null });
  }

  findMeta(slug: string): BlogPostMeta | undefined {
    return this.published.find((post) => post.slug === slug);
  }

  /** The `count` posts adjacent to `slug` by date, used for "keep reading". */
  related(slug: string, count = 2): readonly BlogPostMeta[] {
    const current = this.findMeta(slug);
    if (!current) return [];

    return this.published
      .filter((post) => post.slug !== slug)
      .map((post) => ({
        post,
        overlap: post.tags.filter((tag) => current.tags.includes(tag)).length,
      }))
      .sort((a, b) => b.overlap - a.overlap || Date.parse(b.post.date) - Date.parse(a.post.date))
      .slice(0, count)
      .map((entry) => entry.post);
  }

  /**
   * Resolves a post with its markdown body.
   * Returns `null` for unknown or draft slugs so the caller can render a 404
   * rather than having to distinguish an error from a miss.
   */
  async load(slug: string): Promise<BlogPost | null> {
    const meta = this.findMeta(slug);
    if (!meta) return null;

    const cached = this.contentCache.get(slug);
    if (cached !== undefined) {
      return { ...meta, markdown: cached };
    }

    const loader = BLOG_CONTENT[slug];
    if (!loader) return null;

    const markdown = await loader();
    this.contentCache.set(slug, markdown);

    return { ...meta, markdown };
  }
}
