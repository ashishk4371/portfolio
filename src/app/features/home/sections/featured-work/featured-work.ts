import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectService } from '../../../../core/services';
import { Icon } from '../../../../shared/components/icon/icon';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { SectionHeading } from '../../../../shared/components/section-heading/section-heading';
import { ProjectCard } from '../../../projects/components/project-card/project-card';

@Component({
  selector: 'app-featured-work',
  imports: [RouterLink, Icon, SectionHeading, ProjectCard, RevealDirective],
  templateUrl: './featured-work.html',
  styleUrl: './featured-work.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedWork {
  protected readonly projects = inject(ProjectService).featured;
}
