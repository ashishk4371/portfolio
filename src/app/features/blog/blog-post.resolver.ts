import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { BlogPost } from '../../core/models';
import { BlogService } from '../../core/services';

/**
 * Resolves a post (metadata plus markdown body) before the route activates.
 *
 * A resolver rather than in-component loading, specifically so server-side
 * rendering works: the router awaits the returned promise, so the prerendered
 * HTML contains the fully rendered article instead of a loading state. For a
 * blog that is the difference between being indexable and not.
 *
 * Returns `null` for unknown slugs; the component renders a not-found state.
 */
export const blogPostResolver: ResolveFn<BlogPost | null> = (route) => {
  const slug = route.paramMap.get('slug');
  if (!slug) return null;

  return inject(BlogService).load(slug);
};
