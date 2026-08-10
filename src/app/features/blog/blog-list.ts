import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { BlogService, SeoService } from '../../core/services';
import { Icon } from '../../shared/components/icon/icon';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { TagChip } from '../../shared/components/tag-chip/tag-chip';
import { PostCard } from './components/post-card/post-card';

@Component({
  selector: 'app-blog-list',
  imports: [Icon, SectionHeading, TagChip, PostCard, RevealDirective],
  templateUrl: './blog-list.html',
  styleUrl: './blog-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogList {
  private readonly blog = inject(BlogService);
  private readonly seo = inject(SeoService);

  protected readonly posts = this.blog.filteredPosts;
  protected readonly tags = this.blog.tags;
  protected readonly filters = this.blog.filters;
  protected readonly hasFilters = this.blog.hasActiveFilters;
  protected readonly total = computed(() => this.blog.posts().length);

  constructor() {
    this.seo.apply({
      title: 'Blog',
      description:
        'Writing about Angular, web performance, API design and the parts of engineering practice that do not fit in a README.',
      path: '/blog',
    });

    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Ashish Kumar — Blog',
      url: this.seo.absoluteUrl('/blog'),
      blogPost: this.blog.posts().map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.date,
        url: this.seo.absoluteUrl(`/blog/${post.slug}`),
      })),
    });
  }

  protected onSearch(event: Event): void {
    this.blog.setQuery((event.target as HTMLInputElement).value);
  }

  protected onTag(tag: string): void {
    this.blog.toggleTag(tag);
  }

  protected clear(): void {
    this.blog.clearFilters();
  }
}
