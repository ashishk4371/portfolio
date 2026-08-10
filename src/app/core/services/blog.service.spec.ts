import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog.service';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogService);
  });

  it('exposes published posts newest first', () => {
    const dates = service.posts().map((post) => Date.parse(post.date));
    const sorted = [...dates].sort((a, b) => b - a);

    expect(dates).toEqual(sorted);
  });

  it('never exposes drafts', () => {
    expect(service.posts().every((post) => !post.draft)).toBe(true);
  });

  it('ranks tags by frequency', () => {
    const counts = service.tags().map((entry) => entry.count);

    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  describe('filtering', () => {
    it('matches the query against title, description and tags', () => {
      service.setQuery('zoneless');

      expect(service.filteredPosts().length).toBeGreaterThan(0);
      expect(
        service
          .filteredPosts()
          .every((post) => /zoneless/i.test(post.title + post.description + post.tags.join(' '))),
      ).toBe(true);
    });

    it('is case-insensitive and ignores surrounding whitespace', () => {
      service.setQuery('  ANGULAR  ');

      expect(service.filteredPosts().length).toBeGreaterThan(0);
    });

    it('treats tag selection as a toggle', () => {
      const tag = service.tags()[0]!.tag;

      service.toggleTag(tag);
      expect(service.filters().tag).toBe(tag);

      service.toggleTag(tag);
      expect(service.filters().tag).toBeNull();
    });

    it('combines tag and query filters', () => {
      service.toggleTag('performance');
      service.setQuery('api');

      expect(service.filteredPosts().every((post) => post.tags.includes('performance'))).toBe(true);
    });

    it('reports and clears active filters', () => {
      expect(service.hasActiveFilters()).toBe(false);

      service.setQuery('anything');
      expect(service.hasActiveFilters()).toBe(true);

      service.clearFilters();
      expect(service.hasActiveFilters()).toBe(false);
      expect(service.filteredPosts()).toEqual(service.posts());
    });

    it('returns an empty list rather than throwing on no match', () => {
      service.setQuery('zzzzz-no-such-post');

      expect(service.filteredPosts()).toEqual([]);
    });
  });

  describe('load', () => {
    it('resolves metadata plus the markdown body', async () => {
      const slug = service.posts()[0]!.slug;
      const post = await service.load(slug);

      expect(post?.slug).toBe(slug);
      expect(post?.markdown.length).toBeGreaterThan(0);
    });

    it('returns null for an unknown slug instead of throwing', async () => {
      await expect(service.load('does-not-exist')).resolves.toBeNull();
    });

    it('serves repeat loads from cache', async () => {
      const slug = service.posts()[0]!.slug;

      const first = await service.load(slug);
      const second = await service.load(slug);

      expect(second?.markdown).toBe(first?.markdown);
    });
  });

  describe('related', () => {
    it('excludes the current post', () => {
      const slug = service.posts()[0]!.slug;

      expect(service.related(slug).some((post) => post.slug === slug)).toBe(false);
    });

    it('prefers posts that share tags', () => {
      const current = service.posts().find((post) => post.tags.includes('performance'))!;
      const [first] = service.related(current.slug);

      expect(first!.tags.some((tag) => current.tags.includes(tag))).toBe(true);
    });

    it('returns nothing for an unknown slug', () => {
      expect(service.related('does-not-exist')).toEqual([]);
    });
  });
});
