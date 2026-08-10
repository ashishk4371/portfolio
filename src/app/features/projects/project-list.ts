import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProjectCategory } from '../../core/models';
import { ProjectService, SeoService } from '../../core/services';
import { Icon } from '../../shared/components/icon/icon';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';
import { ProjectCard } from './components/project-card/project-card';

@Component({
  selector: 'app-project-list',
  imports: [Icon, SectionHeading, ProjectCard, RevealDirective],
  templateUrl: './project-list.html',
  styleUrl: './project-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectList {
  private readonly projectService = inject(ProjectService);
  private readonly seo = inject(SeoService);

  protected readonly projects = this.projectService.filteredProjects;
  protected readonly categories = this.projectService.categories;
  protected readonly activeCategory = this.projectService.activeCategory;

  constructor() {
    this.seo.apply({
      title: 'Work',
      description:
        'Selected engineering projects: design systems, edge rendering, observability tooling and developer experience work.',
      path: '/work',
    });
  }

  protected select(category: ProjectCategory | null): void {
    this.projectService.setCategory(category);
  }
}
