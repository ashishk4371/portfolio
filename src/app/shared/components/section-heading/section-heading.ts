import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

import { Icon, IconName } from '../icon/icon';

/**
 * Consistent section header: eyebrow, title, optional lede.
 *
 * Every section on the site uses this rather than hand-rolling an `<h2>`, which
 * is what keeps the vertical rhythm and heading hierarchy consistent as
 * sections are added.
 */
@Component({
  selector: 'app-section-heading',
  imports: [Icon],
  templateUrl: './section-heading.html',
  styleUrl: './section-heading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-centered]': 'centered()' },
})
export class SectionHeading {
  readonly eyebrow = input<string>('');
  readonly eyebrowIcon = input<IconName | null>(null);
  readonly title = input.required<string>();
  readonly lede = input<string>('');
  readonly centered = input(false, { transform: booleanAttribute });
  /** Heading level, so the component never breaks the document outline. */
  readonly level = input<2 | 3>(2);
}
