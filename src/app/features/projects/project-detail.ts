import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProjectService, SeoService } from '../../core/services';
import { CATEGORY_LABELS } from '../../core/services';
import { GradientCover } from '../../shared/components/gradient-cover/gradient-cover';
import { Icon } from '../../shared/components/icon/icon';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { TagChip } from '../../shared/components/tag-chip/tag-chip';

/**
 * Project case study.
 *
 * `slug` arrives as a route parameter bound directly to the input by
 * `withComponentInputBinding()`, so the component never touches ActivatedRoute
 * and stays trivially testable with `setInput`.
 */
@Component({
  selector: 'app-project-detail',
  imports: [RouterLink, Icon, TagChip, GradientCover, RevealDirective],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetail {
  readonly slug = input.required<string>();

  private readonly projectService = inject(ProjectService);
  private readonly seo = inject(SeoService);

  protected readonly project = computed(() => this.projectService.find(this.slug()) ?? null);
  protected readonly adjacent = computed(() => this.projectService.adjacent(this.slug()));

  protected readonly categoryLabel = computed(() => {
    const project = this.project();
    return project ? CATEGORY_LABELS[project.category] : '';
  });

  constructor() {
    effect(() => {
      const project = this.project();
      if (!project) return;

      this.seo.apply({
        title: project.title,
        description: project.tagline,
        path: `/work/${project.slug}`,
        type: 'article',
        tags: project.stack,
      });

      this.seo.setStructuredData({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        abstract: project.tagline,
        dateCreated: String(project.year),
        keywords: project.stack.join(', '),
        url: this.seo.absoluteUrl(`/work/${project.slug}`),
      });
    });
  }
}
