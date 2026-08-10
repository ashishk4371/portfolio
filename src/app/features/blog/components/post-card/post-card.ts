import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BlogPostMeta } from '../../../../core/models';
import { GradientCover } from '../../../../shared/components/gradient-cover/gradient-cover';
import { Icon } from '../../../../shared/components/icon/icon';
import { TagChip } from '../../../../shared/components/tag-chip/tag-chip';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, Icon, TagChip, GradientCover, FormatDatePipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.is-compact]': 'compact()' },
})
export class PostCard {
  readonly post = input.required<BlogPostMeta>();
  /** Drops the cover art — used in the "keep reading" strip. */
  readonly compact = input(false, { transform: booleanAttribute });
}
