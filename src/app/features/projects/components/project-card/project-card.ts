import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Project } from '../../../../core/models';
import { CATEGORY_LABELS } from '../../../../core/services';
import { GradientCover } from '../../../../shared/components/gradient-cover/gradient-cover';
import { Icon } from '../../../../shared/components/icon/icon';
import { TagChip } from '../../../../shared/components/tag-chip/tag-chip';
import { TiltDirective } from '../../../../shared/directives/tilt.directive';

/**
 * Project summary card.
 *
 * The whole card is a link, implemented with a stretched pseudo-element on the
 * title anchor rather than by wrapping everything in an `<a>`. That keeps a
 * single, meaningful link in the accessibility tree instead of one giant one
 * that announces the entire card contents.
 */
@Component({
  selector: 'app-project-card',
  imports: [RouterLink, Icon, TagChip, GradientCover, TiltDirective],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-featured]': 'featured()' },
})
export class ProjectCard {
  readonly project = input.required<Project>();
  /** Larger layout with metrics, used for the top of the work grid. */
  readonly featured = input(false, { transform: booleanAttribute });

  protected readonly categoryLabel = computed(() => CATEGORY_LABELS[this.project().category]);

  protected readonly statusLabel = computed(() => {
    switch (this.project().status) {
      case 'in-progress':
        return 'In progress';
      case 'archived':
        return 'Archived';
      default:
        return 'Shipped';
    }
  });

  /** Stack list is capped so a long stack cannot break the card's rhythm. */
  protected readonly visibleStack = computed(() => this.project().stack.slice(0, 4));
  protected readonly overflowStack = computed(() => Math.max(0, this.project().stack.length - 4));
}
