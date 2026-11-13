import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BlogPost } from '../../core/models';
import { SeoService } from '../../core/services';
import { renderMarkdown } from '../../core/utils';
import { FormatDatePipe } from '../../shared/pipes/format-date.pipe';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';

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
  imports: [RouterLink, FormatDatePipe, SafeHtmlPipe],
  templateUrl: './blog-post.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPostPage {
  /** Resolved route data. `null` when the slug does not match a published post. */
  readonly post = input.required<BlogPost | null>();

  private readonly seo = inject(SeoService);

  private readonly rendered = computed(() => {
    const post = this.post();
    return post ? renderMarkdown(post.markdown) : null;
  });

  protected readonly html = computed(() => this.rendered()?.html ?? '');

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
  }
}
