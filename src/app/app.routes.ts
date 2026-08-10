import { Routes } from '@angular/router';

import { blogPostResolver } from './features/blog/blog-post.resolver';

/**
 * Every route is lazily loaded, including the home page.
 *
 * That keeps the initial JavaScript payload to the shell (header, footer,
 * router, theme) and lets each feature grow without taxing the routes that do
 * not use it. Titles are set per route so the browser tab is correct even
 * before a component has rendered; SeoService then fills in the richer metadata.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'Ashish Kumar — Software Engineer',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'work',
    title: 'Work — Ashish Kumar',
    loadComponent: () => import('./features/projects/project-list').then((m) => m.ProjectList),
  },
  {
    path: 'work/:slug',
    loadComponent: () => import('./features/projects/project-detail').then((m) => m.ProjectDetail),
  },
  {
    path: 'blog',
    title: 'Blog — Ashish Kumar',
    loadComponent: () => import('./features/blog/blog-list').then((m) => m.BlogList),
  },
  {
    path: 'blog/:slug',
    /** Resolved before activation so the prerendered HTML contains the article. */
    resolve: { post: blogPostResolver },
    loadComponent: () => import('./features/blog/blog-post').then((m) => m.BlogPostPage),
  },
  {
    path: 'contact',
    title: 'Contact — Ashish Kumar',
    loadComponent: () => import('./features/contact/contact').then((m) => m.Contact),
  },
  {
    path: '**',
    title: 'Page not found — Ashish Kumar',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
