import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Marks a trusted HTML string as safe for `[innerHTML]`.
 *
 * SAFETY: only ever used for HTML produced by `renderMarkdown()` from markdown
 * that lives in this repository. Angular's default sanitiser strips the class
 * attributes that syntax highlighting depends on, which is why the bypass is
 * needed. Never pass user-submitted or remotely-fetched content through this.
 */
@Pipe({ name: 'appSafeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
