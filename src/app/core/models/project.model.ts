export type ProjectCategory = 'web' | 'backend' | 'tooling' | 'mobile' | 'open-source';

export type ProjectStatus = 'shipped' | 'in-progress' | 'archived';

export interface ProjectLink {
  readonly label: string;
  readonly url: string;
  readonly icon: string;
}

export interface ProjectMetric {
  readonly value: string;
  readonly label: string;
}

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly description: readonly string[];
  readonly year: number;
  readonly category: ProjectCategory;
  readonly status: ProjectStatus;
  readonly featured: boolean;
  readonly stack: readonly string[];
  readonly highlights: readonly string[];
  readonly metrics: readonly ProjectMetric[];
  readonly links: readonly ProjectLink[];
  /** Unused; kept for data compatibility. */
  readonly cover: readonly [number, number];
}
