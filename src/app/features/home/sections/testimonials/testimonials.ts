import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TESTIMONIALS } from '../../../../core/data';
import { Icon } from '../../../../shared/components/icon/icon';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';

@Component({
  selector: 'app-testimonials',
  imports: [Icon, SectionHeading, RevealDirective],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Testimonials {
  protected readonly testimonials = TESTIMONIALS;
}
