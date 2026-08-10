import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EDUCATION, PROFILE } from '../../../../core/data';
import { Icon } from '../../../../shared/components/icon/icon';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';

@Component({
  selector: 'app-about',
  imports: [Icon, SectionHeading, RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly profile = PROFILE;
  protected readonly education = EDUCATION;

  protected readonly principles = [
    {
      icon: 'compass' as const,
      title: 'Ship small, ship often',
      body: 'A change that reaches users this week beats a perfect one that lands next quarter. I break work into slices that can each stand on their own.',
    },
    {
      icon: 'layout' as const,
      title: 'Accessibility is not a phase',
      body: 'Keyboard paths, focus order and contrast get decided while the component is being written, not in an audit six months later.',
    },
    {
      icon: 'server' as const,
      title: 'Own it in production',
      body: 'If I built it, I want the pager. Writing code you have to operate changes what you build in ways nothing else does.',
    },
  ];
}
