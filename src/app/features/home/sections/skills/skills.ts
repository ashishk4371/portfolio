import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SKILL_GROUPS } from '../../../../core/data';
import { Icon } from '../../../../shared/components/icon/icon';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';

@Component({
  selector: 'app-skills',
  imports: [Icon, SectionHeading, RevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  protected readonly groups = SKILL_GROUPS;
  /** Fixed-length array so the template can render five meter segments. */
  protected readonly meter = [1, 2, 3, 4, 5] as const;
}
