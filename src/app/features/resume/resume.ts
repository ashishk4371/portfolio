import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EDUCATION, EXPERIENCES, PROFILE, SKILL_GROUPS } from '../../core/data';
import { SeoService } from '../../core/services';
import { FormatDatePipe } from '../../shared/pipes/format-date.pipe';

@Component({
  selector: 'app-resume',
  imports: [FormatDatePipe],
  templateUrl: './resume.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Resume {
  protected readonly profile = PROFILE;
  protected readonly experiences = EXPERIENCES;
  protected readonly education = EDUCATION;
  protected readonly skillGroups = SKILL_GROUPS;

  constructor() {
    inject(SeoService).apply({
      title: 'Resume',
      description: `Experience, education and skills of ${PROFILE.name}.`,
      path: '/resume',
    });
  }
}
