import { Injectable, computed, signal } from '@angular/core';

import { PROJECTS } from '../data';
import { Project, ProjectCategory } from '../models';

export const CATEGORY_LABELS: Readonly<Record<ProjectCategory, string>> = {
  web: 'Web apps',
  backend: 'Backend',
  tooling: 'Tooling',
  mobile: 'Mobile',
  'open-source': 'Open source',
};

/**
 * Read model over the project catalogue.
 *
 * Filtering lives here rather than in the component so the projects page and
 * the home page's featured strip share one definition of ordering and of what
 * "featured" means.
 */
@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly all: readonly Project[] = [...PROJECTS].sort((a, b) => b.year - a.year);

  private readonly categoryState = signal<ProjectCategory | null>(null);

  readonly projects = signal<readonly Project[]>(this.all).asReadonly();
  readonly activeCategory = this.categoryState.asReadonly();

  readonly featured = computed(() => this.projects().filter((project) => project.featured));

  /** Only categories that actually have projects — no empty filter chips. */
  readonly categories = computed<readonly { id: ProjectCategory; label: string; count: number }[]>(
    () => {
      const counts = new Map<ProjectCategory, number>();

      for (const project of this.projects()) {
        counts.set(project.category, (counts.get(project.category) ?? 0) + 1);
      }

      return [...counts.entries()]
        .map(([id, count]) => ({ id, label: CATEGORY_LABELS[id], count }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
    },
  );

  readonly filteredProjects = computed<readonly Project[]>(() => {
    const category = this.categoryState();
    return category
      ? this.projects().filter((project) => project.category === category)
      : this.projects();
  });

  setCategory(category: ProjectCategory | null): void {
    this.categoryState.set(this.categoryState() === category ? null : category);
  }

  find(slug: string): Project | undefined {
    return this.all.find((project) => project.slug === slug);
  }

  /** Wraps around, so every project has a "next" even at the ends of the list. */
  adjacent(slug: string): { previous: Project | null; next: Project | null } {
    const index = this.all.findIndex((project) => project.slug === slug);
    if (index === -1) return { previous: null, next: null };

    return {
      previous: this.all[(index - 1 + this.all.length) % this.all.length] ?? null,
      next: this.all[(index + 1) % this.all.length] ?? null,
    };
  }
}
