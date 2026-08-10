import {
  DOCUMENT,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BlogPost } from '../../core/models';
import { BlogService, SeoService } from '../../core/services';
import { renderMarkdown } from '../../core/utils';
import { Icon } from '../../shared/components/icon/icon';
import { ScrollProgress } from '../../shared/components/scroll-progress/scroll-progress';
import { TagChip } from '../../shared/components/tag-chip/tag-chip';
import { FormatDatePipe } from '../../shared/pipes/format-date.pipe';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { PostCard } from './components/post-card/post-card';

/**
 * Blog article.
 *
 * `post` is supplied by `blogPostResolver` through `withComponentInputBinding()`,
 * so the markdown is already present when this component first renders — both
 * in the browser and during prerendering.
 *
 * Markdown is parsed in a `computed`, which means it happens once per post
 * rather than on every change detection pass.
 */
@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, Icon, TagChip, PostCard, FormatDatePipe, SafeHtmlPipe, ScrollProgress],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostPage {
  /** Resolved route data. `null` when the slug does not match a published post. */
  readonly post = input.required<BlogPost | null>();

  private readonly blog = inject(BlogService);
  private readonly seo = inject(SeoService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly rendered = computed(() => {
    const post = this.post();
    return post ? renderMarkdown(post.markdown) : null;
  });

  protected readonly html = computed(() => this.rendered()?.html ?? '');
  protected readonly toc = computed(() => this.rendered()?.toc ?? []);

  protected readonly related = computed(() => {
    const post = this.post();
    return post ? this.blog.related(post.slug) : [];
  });

  /** Heading currently in view, used to highlight the table of contents. */
  protected readonly activeHeading = signal<string | null>(null);

  constructor() {
    effect(() => {
      const post = this.post();
      if (!post) return;

      this.seo.apply({
        title: post.title,
        description: post.description,
        path: `/blog/${post.slug}`,
        type: 'article',
        publishedAt: post.date,
        tags: post.tags,
      });

      this.seo.setStructuredData({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        wordCount: post.wordCount,
        keywords: post.tags.join(', '),
        author: { '@type': 'Person', name: 'Ashish Kumar' },
        mainEntityOfPage: this.seo.absoluteUrl(`/blog/${post.slug}`),
      });
    });

    // Runs after the article HTML is in the DOM, which is the earliest point
    // the heading elements exist to observe.
    afterNextRender(() => this.observeHeadings());
  }

  private observeHeadings(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;

    const headings = this.document.querySelectorAll<HTMLElement>(
      '.article__body h2, .article__body h3',
    );
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The topmost intersecting heading wins, so the highlight follows
        // reading order rather than whichever entry fired last.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          this.activeHeading.set(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    headings.forEach((heading) => observer.observe(heading));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
