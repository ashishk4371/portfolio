export interface SeoMetadata {
  readonly title: string;
  readonly description: string;
  /** Absolute or root-relative path; resolved against the site origin. */
  readonly path?: string;
  readonly type?: 'website' | 'article' | 'profile';
  readonly publishedAt?: string;
  readonly tags?: readonly string[];
  readonly image?: string;
}
