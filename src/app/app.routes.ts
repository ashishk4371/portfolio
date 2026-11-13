import { Routes } from '@angular/router';

import { blogPostResolver } from './features/blog/blog-post.resolver';

export const routes: Routes = [
  {
    path: '',
    title: 'Ashish Kumar — Software Engineer',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
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
    path: 'projects',
    title: 'Projects — Ashish Kumar',
    loadComponent: () => import('./features/projects/project-list').then((m) => m.ProjectList),
  },
  {
    path: 'resume',
    title: 'Resume — Ashish Kumar',
    loadComponent: () => import('./features/resume/resume').then((m) => m.Resume),
  },
  { path: 'work', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: '**',
    title: 'Page not found — Ashish Kumar',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
