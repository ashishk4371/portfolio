import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ProjectService, SeoService } from '../../core/services';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectList {
  protected readonly projects = inject(ProjectService).projects;

  constructor() {
    inject(SeoService).apply({
      title: 'Projects',
      description: 'Selected engineering projects.',
      path: '/projects',
    });
  }
}
