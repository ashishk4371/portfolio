import { RenderMode, ServerRoute } from '@angular/ssr';

import { PROJECTS } from './core/data/projects.data';
import { BLOG_INDEX } from './core/data/generated/blog-index';

/**
 * Server render strategy.
 *
 * Everything on this site is static content known at build time, so every route
 * is prerendered to HTML. Parameterised routes enumerate their own params from
 * the same data the components read, which means adding a post or a project
 * automatically adds its prerendered page — there is no separate list to keep
 * in sync.
 *
 * The Express server in `server.ts` still exists to serve those files and to
 * server-render anything that is not prerendered (a 404, for example).
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      BLOG_INDEX.filter((post) => !post.draft).map((post) => ({ slug: post.slug })),
  },
  {
    path: 'work/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map((project) => ({ slug: project.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
