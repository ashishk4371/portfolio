import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'calendar'
  | 'check'
  | 'chevron-down'
  | 'clock'
  | 'cloud'
  | 'code'
  | 'compass'
  | 'copy'
  | 'download'
  | 'external'
  | 'github'
  | 'layout'
  | 'linkedin'
  | 'mail'
  | 'map-pin'
  | 'menu'
  | 'monitor'
  | 'moon'
  | 'quote'
  | 'search'
  | 'server'
  | 'sparkles'
  | 'sun'
  | 'x'
  | 'x-close';

/**
 * Inline SVG icon.
 *
 * The markup is written out in the template rather than injected as a string,
 * because `innerHTML` on an `<svg>` element is not reliable during server-side
 * rendering. A `@switch` keeps everything type-checked and SSR-safe at the cost
 * of a slightly longer template.
 *
 * Decorative by default: `aria-hidden` unless a `label` is supplied, so icons
 * beside visible text do not double-announce.
 */
@Component({
  selector: 'app-icon',
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-hidden]': 'label() ? null : "true"',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
  },
})
export class Icon {
  readonly name = input.required<IconName>();
  /** Sets an accessible name and promotes the icon to `role="img"`. */
  readonly label = input<string>('');
  /** Any CSS length. Defaults to `1em` so icons scale with surrounding text. */
  readonly size = input<string>('1em');
  readonly strokeWidth = input<number>(1.75);

  protected readonly dimension = computed(() => this.size());
}
