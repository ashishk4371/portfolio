import { InjectionToken } from '@angular/core';

/**
 * Deployment-level configuration.
 *
 * Provided through an InjectionToken rather than imported as a module-level
 * constant so that tests (and future multi-tenant builds) can override it
 * without touching the consumers.
 */
export interface SiteConfig {
  /** Absolute origin, no trailing slash. Used for canonical URLs and OG tags. */
  readonly origin: string;
  readonly siteName: string;
  readonly defaultDescription: string;
  readonly defaultOgImage: string;
  readonly locale: string;
  readonly twitterHandle: string;
  /** localStorage key namespace. */
  readonly storagePrefix: string;
}

export const SITE_CONFIG = new InjectionToken<SiteConfig>('SITE_CONFIG', {
  providedIn: 'root',
  factory: (): SiteConfig => DEFAULT_SITE_CONFIG,
});

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  origin: 'https://byashish.dev',
  siteName: 'Ashish Kumar',
  defaultDescription:
    'Software engineer building fast, accessible products with TypeScript, Angular, Node.js and Go.',
  defaultOgImage: '/og-image.png',
  locale: 'en_US',
  twitterHandle: '@ashishbuilds',
  storagePrefix: 'portfolio',
};
