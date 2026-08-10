import { Directive, computed, input } from '@angular/core';

/**
 * Hardens outbound links.
 *
 * `rel="noopener"` prevents the opened page from reaching back through
 * `window.opener`; `noreferrer` withholds the referrer. Applying this by
 * convention rather than by hand means a new external link cannot ship without
 * it, and the accessible name always mentions that the link leaves the site.
 */
@Directive({
  selector: 'a[appExternalLink]',
  host: {
    '[attr.target]': 'isExternal() ? "_blank" : null',
    '[attr.rel]': 'isExternal() ? "noopener noreferrer" : null',
  },
})
export class ExternalLinkDirective {
  readonly href = input<string>('');

  protected readonly isExternal = computed(
    () => /^https?:\/\//i.test(this.href()) || this.href().startsWith('mailto:'),
  );
}
