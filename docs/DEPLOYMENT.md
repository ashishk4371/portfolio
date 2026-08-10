# Deployment

`npm run build` produces two things:

```
dist/portfolio/
├── browser/   # prerendered HTML + hashed assets + sitemap.xml
└── server/    # Express SSR server (server.mjs)
```

Because every route is prerendered, you can deploy either half depending on what
you need.

## Before you deploy

Set the production origin in `src/app/core/tokens/site-config.token.ts`. It is
used for canonical URLs, Open Graph tags and JSON-LD, and a wrong value here is
the kind of bug nobody notices for months:

```ts
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  origin: 'https://your-domain.com',
  // …
};
```

Update `public/robots.txt` with the same domain, and set `SITE_ORIGIN` when
building if you want the sitemap generated for a different host:

```bash
SITE_ORIGIN=https://your-domain.com npm run build
```

## Option 1 — Static hosting (simplest)

Every route is already HTML, so no server is required. Deploy
`dist/portfolio/browser` to Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3
or any static host.

| Setting           | Value                    |
| ----------------- | ------------------------ |
| Build command     | `npm run build`          |
| Publish directory | `dist/portfolio/browser` |
| Node version      | 22                       |

Configure the host to fall back to `/index.html` for unmatched paths so the
client-side router can serve the 404 page. For nginx, `docker/nginx.conf` has a
working config with caching headers and security headers already set.

Trade-off: content updates require a rebuild. For a portfolio that is usually
the correct trade.

## Option 2 — Node SSR server

Use this when you want on-demand rendering — for example, if the contact form
grows a real backend, or you add a route that depends on request state.

```bash
npm run build
npm run serve:ssr        # or: node dist/portfolio/server/server.mjs
```

The server listens on `PORT` (default 4000). Put it behind nginx or a load
balancer for TLS termination and static asset caching.

## Option 3 — Docker

The included `Dockerfile` is a three-stage build: toolchain, production
dependencies, then a slim runtime that runs as the unprivileged `node` user.

```bash
docker build -t portfolio .
docker run -p 4000:4000 portfolio

# or
docker compose up --build
```

The image includes a `HEALTHCHECK` that renders the home route — a stronger
signal than a static endpoint returning 200, since it exercises the actual
render path.

## Continuous integration

`.github/workflows/ci.yml` runs format check, lint, tests with coverage, and a
production build on every push and pull request. It then asserts that specific
files exist in the output:

```bash
test -f dist/portfolio/browser/index.html
test -f dist/portfolio/browser/blog/index.html
test -f dist/portfolio/browser/sitemap.xml
```

This catches a regression that is otherwise invisible: if prerendering silently
stops working, the build still succeeds and every route quietly becomes
server-rendered on demand.

On push to `main` it additionally builds the Docker image with layer caching.
Wire your deploy step in after the `docker` job.

## Wiring up the contact form

`ContactService` currently opens the visitor's mail client. To POST to a real
endpoint instead, only that one file changes:

1. Add `provideHttpClient(withFetch())` to `app.config.ts`.
2. Inject `HttpClient` into `ContactService` and POST in `send()`.
3. Return `{ kind: 'failed', reason }` on error — the component already renders it.

The component, the form, the validation and the UI states need no changes. That
separation is the reason the service exists at all.

## Performance notes

The production build enforces budgets in `angular.json`: 600 kB warning / 1 MB
error on the initial bundle. Current initial transfer is around 100 kB gzipped.

If you add a heavy dependency — a chart library, an animation engine — import it
inside a lazily-loaded feature rather than in `core` or `shared`, or it will land
in the initial bundle for every visitor including those who only read one blog post.
