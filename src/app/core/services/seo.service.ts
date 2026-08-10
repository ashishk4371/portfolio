import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SeoMetadata } from '../models';
import { SITE_CONFIG } from '../tokens';

/**
 * Centralises document metadata.
 *
 * Every route calls `apply()` exactly once. Keeping this in one place means the
 * canonical URL, Open Graph tags and JSON-LD cannot drift apart, which is the
 * usual failure mode when each component sets its own tags.
 *
 * Runs identically on the server, so prerendered pages ship complete metadata
 * rather than relying on crawlers executing JavaScript.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(SITE_CONFIG);

  private static readonly STRUCTURED_DATA_ID = 'structured-data';

  apply(metadata: SeoMetadata): void {
    const fullTitle = metadata.title.includes(this.config.siteName)
      ? metadata.title
      : `${metadata.title} — ${this.config.siteName}`;

    const url = this.absoluteUrl(metadata.path ?? '/');
    const image = this.absoluteUrl(metadata.image ?? this.config.defaultOgImage);

    this.title.setTitle(fullTitle);

    this.setTags({
      description: metadata.description,
      'og:title': fullTitle,
      'og:description': metadata.description,
      'og:type': metadata.type ?? 'website',
      'og:url': url,
      'og:image': image,
      'og:site_name': this.config.siteName,
      'og:locale': this.config.locale,
      'twitter:card': 'summary_large_image',
      'twitter:title': fullTitle,
      'twitter:description': metadata.description,
      'twitter:image': image,
      'twitter:creator': this.config.twitterHandle,
    });

    if (metadata.type === 'article' && metadata.publishedAt) {
      this.setTags({ 'article:published_time': metadata.publishedAt });
      this.setArticleTags(metadata.tags ?? []);
    } else {
      this.meta.removeTag("property='article:published_time'");
      this.setArticleTags([]);
    }

    this.setCanonical(url);
  }

  /** Injects (or replaces) the JSON-LD block for the current route. */
  setStructuredData(data: Record<string, unknown>): void {
    const head = this.document.head;
    const existing = this.document.getElementById(SeoService.STRUCTURED_DATA_ID);
    existing?.remove();

    const script = this.document.createElement('script');
    script.id = SeoService.STRUCTURED_DATA_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    head.appendChild(script);
  }

  absoluteUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) return path;
    return `${this.config.origin}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private setTags(tags: Record<string, string>): void {
    for (const [name, content] of Object.entries(tags)) {
      if (!content) continue;

      // og:* and article:* are `property`; the rest are `name`.
      const isProperty = name.startsWith('og:') || name.startsWith('article:');
      const selector = isProperty ? `property='${name}'` : `name='${name}'`;

      this.meta.updateTag(isProperty ? { property: name, content } : { name, content }, selector);
    }
  }

  private setArticleTags(tags: readonly string[]): void {
    for (const element of Array.from(
      this.document.head.querySelectorAll("meta[property='article:tag']"),
    )) {
      element.remove();
    }

    for (const tag of tags) {
      this.meta.addTag({ property: 'article:tag', content: tag });
    }
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>("link[rel='canonical']");

    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }

    link.href = url;
  }
}
