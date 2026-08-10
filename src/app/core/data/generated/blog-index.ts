/**
 * AUTO-GENERATED — DO NOT EDIT.
 * Source: src/content/blog/*.md
 * Regenerate with: npm run blog:index
 */

import { BlogPostMeta } from '../../models/blog-post.model';

/** Post metadata, newest first. Eagerly available for lists and SEO. */
export const BLOG_INDEX: readonly BlogPostMeta[] = [
  {"slug":"going-zoneless-in-angular","title":"What actually changes when you go zoneless","description":"Removing zone.js from a 240-component Angular app was less about performance and more about finally understanding when our UI updates.","date":"2026-06-18T00:00:00.000Z","tags":["angular","signals","performance"],"readingTime":3,"wordCount":599,"featured":true,"draft":false,"cover":[252,288]},
  {"slug":"api-that-fits-the-screen","title":"Design the API that fits the screen, not the database","description":"Eleven round trips became one when we stopped exposing our schema and started exposing our pages.","date":"2026-04-02T00:00:00.000Z","tags":["architecture","api","performance"],"readingTime":3,"wordCount":556,"featured":true,"draft":false,"cover":[190,252]},
  {"slug":"css-variables-are-a-runtime","title":"CSS custom properties are a runtime, and that changes how you theme","description":"Two themes is a config problem. Three is an architecture problem. Here is the line between them.","date":"2026-02-11T00:00:00.000Z","tags":["css","design-systems","architecture"],"readingTime":3,"wordCount":559,"featured":false,"draft":false,"cover":[288,320]},
  {"slug":"tests-that-earn-their-keep","title":"Most of our tests were not testing anything","description":"We had 94% coverage and shipped a regression a week. Here is what we found when we actually read the suite.","date":"2025-11-24T00:00:00.000Z","tags":["testing","engineering-practice"],"readingTime":3,"wordCount":623,"featured":false,"draft":false,"cover":[150,190]},
];

/**
 * Lazily-loaded post bodies. Each entry is a separate chunk, so opening one
 * post never downloads the others.
 */
export const BLOG_CONTENT: Readonly<Record<string, () => Promise<string>>> = {
  'going-zoneless-in-angular': () => import('./posts/going-zoneless-in-angular').then((m) => m.default),
  'api-that-fits-the-screen': () => import('./posts/api-that-fits-the-screen').then((m) => m.default),
  'css-variables-are-a-runtime': () => import('./posts/css-variables-are-a-runtime').then((m) => m.default),
  'tests-that-earn-their-keep': () => import('./posts/tests-that-earn-their-keep').then((m) => m.default),
};
