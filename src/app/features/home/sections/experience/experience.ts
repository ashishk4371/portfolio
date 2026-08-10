import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EXPERIENCES, PROFILE } from '../../../../core/data';
import { formatDuration } from '../../../../core/utils';
import { Icon } from '../../../../shared/components/icon/icon';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { TagChip } from '../../../../shared/components/tag-chip/tag-chip';
import { FormatDatePipe } from '../../../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-experience',
  imports: [Icon, SectionHeading, TagChip, FormatDatePipe, RevealDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceSection {
  protected readonly experiences = EXPERIENCES;
  protected readonly resumeUrl = PROFILE.resumeUrl;

  protected duration(start: string, end: string | null): string {
    return formatDuration(start, end);
  }
}
