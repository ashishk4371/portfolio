# Portfolio

A personal portfolio and engineering blog built with Angular 21 — zoneless, fully
signal-based, server-rendered and prerendered at build time.

## Highlights

- **Zoneless change detection.** `zone.js` is not installed. Rendering is driven
  entirely by signals, template events and the async pipe.
- **Every route prerendered.** All 14 routes — including each blog post and
  project case study — are static HTML at build time, with an Express SSR server
  available for anything dynamic.
- **Light and dark themes** via a two-layer CSS custom property system, with an
  inline pre-paint script so there is no flash of the wrong theme.
- **Markdown blog** compiled at build time. Drop a `.md` file in
  `src/content/blog` and it becomes a code-split, prerendered, SEO-complete page.
- **Accessible by construction.** Skip link, visible focus rings, `prefers-reduced-motion`
  honoured globally, live regions on every filter, and lint rules that fail the
  build on common template a11y mistakes.
- **~100 kB initial transfer** (gzipped), with every feature lazily loaded.

## Getting started

Requires Node.js 20.19+, 22.12+ or 24+.

```bash
npm install     # install dependencies
npm start       # dev server on http://localhost:4200
npm run build   # production build → dist/
npm test        # unit tests (Vitest)
npm run lint    # ESLint (TypeScript + templates)
npm run format  # Prettier
```

`npm start` and `npm run build` regenerate the blog index first via a `pre*`
hook, so a new post is picked up without any extra command.

## Project structure

```
src/
├── app/
│   ├── core/                 # Singletons. Imported by features, never the reverse.
│   │   ├── data/             # Site content as typed constants (edit these)
│   │   │   └── generated/    # Blog index — AUTO-GENERATED, do not edit
│   │   ├── models/           # Domain interfaces
│   │   ├── services/         # Theme, SEO, blog, projects, scroll, contact
│   │   ├── tokens/           # InjectionTokens (site config)
│   │   └── utils/            # Pure functions: markdown, dates, slugs
│   ├── shared/               # Reusable, presentational, no feature knowledge
│   │   ├── components/       # Icon, section heading, tag chip, theme toggle…
│   │   ├── directives/       # Reveal on scroll, pointer tilt, external links
│   │   └── pipes/            # Date formatting, trusted HTML
│   ├── layout/               # Header and footer — the shell around every route
│   ├── features/             # One folder per route, all lazily loaded
│   │   ├── home/sections/    # Hero, about, skills, work, experience…
│   │   ├── projects/         # List + case study detail
│   │   ├── blog/             # List + article + resolver
│   │   ├── contact/
│   │   └── not-found/
│   ├── app.config.ts         # Browser providers
│   ├── app.config.server.ts  # Server providers
│   ├── app.routes.ts         # Route table
│   └── app.routes.server.ts  # Prerender strategy
├── content/blog/             # Blog posts as markdown — write here
├── styles/                   # Design tokens, themes, mixins, prose styles
└── styles.scss               # Global stylesheet
```

The dependency rule is one-directional: `features → shared → core`. Nothing in
`core` or `shared` imports from `features`, which is what keeps features
independently removable.

## Making it yours

All personal content is centralised — you should not need to touch a component.

| What                           | Where                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| Name, bio, socials, stats      | `src/app/core/data/profile.data.ts`                                                 |
| Projects                       | `src/app/core/data/projects.data.ts`                                                |
| Work history & education       | `src/app/core/data/experience.data.ts`                                              |
| Skills                         | `src/app/core/data/skills.data.ts`                                                  |
| Testimonials                   | `src/app/core/data/testimonials.data.ts`                                            |
| Nav links                      | `src/app/core/data/navigation.data.ts`                                              |
| Domain, OG image, socials meta | `src/app/core/tokens/site-config.token.ts`                                          |
| Brand colours                  | `--hue-primary` / `--hue-secondary` / `--hue-tertiary` in `src/styles/_tokens.scss` |

Changing the three hue values in `_tokens.scss` re-themes the entire site,
including gradients, focus rings and generated cover art.

## Writing a blog post

Create `src/content/blog/my-post-slug.md`. The filename becomes the URL.

```markdown
---
title: What actually changes when you go zoneless
description: A one-line summary used in listings and meta tags.
date: 2026-06-18
tags: [angular, signals, performance]
featured: true
draft: false
---

Your content starts here. Standard GitHub-flavoured markdown, with syntax
highlighting on fenced code blocks.
```

`title`, `description`, `date` and `tags` are required — the build fails with a
named error if one is missing or malformed, rather than rendering a broken page.
Set `draft: true` to keep a post out of listings, routes and the sitemap.

Reading time, word count, the table of contents and cover art are all derived
automatically.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — the decisions behind the structure
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — static, Node and container deployment

## Licence

MIT for the code. The written content in `src/content` and `src/app/core/data`
is personal — replace it with your own.
