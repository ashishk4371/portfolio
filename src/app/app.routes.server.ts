import { RenderMode, ServerRoute } from '@angular/ssr';

import { BLOG_INDEX } from './core/data/generated/blog-index';

/**
 * Everything is static content known at build time, so every route is
 * prerendered. Blog slugs come from the same index the blog list reads.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      BLOG_INDEX.filter((post) => !post.draft).map((post) => ({ slug: post.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
