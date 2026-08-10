# Architecture

Notes on why the code is shaped the way it is. The README covers _what_ is
where; this covers _why_.

## Layering

Three layers with a strict one-way dependency rule:

```
features  →  shared  →  core
```

- **`core/`** — application-wide singletons: services, domain models, injection
  tokens, pure utilities and site content. Everything here is stateless or holds
  state that genuinely belongs to the whole app (the theme, for example).
- **`shared/`** — presentational components, directives and pipes. These know
  nothing about any feature. A shared component never imports a service that
  only one feature uses.
- **`features/`** — one folder per route. Features may import from `shared` and
  `core`, but never from each other.

The rule is worth enforcing because it makes deletion cheap. Removing the blog
means deleting `features/blog`, three lines of routing, and one service — no
archaeology required.

Two places bend the rule deliberately: `home/sections/featured-work` imports
`ProjectCard` from the projects feature, and `home/sections/latest-posts`
imports `PostCard` from the blog feature. The alternative is duplicating both
cards in `shared/`, which would guarantee they drift apart. Cross-feature
imports of _presentational_ components are the pragmatic exception; cross-feature
imports of _state_ are not.

## Zoneless change detection

`zone.js` is not a dependency. `provideZonelessChangeDetection()` is explicit in
`app.config.ts` even though it is now the default, because it is a constraint
that the rest of the codebase depends on and it should be visible.

Consequences that are enforced rather than hoped for:

- Every component uses `ChangeDetectionStrategy.OnPush`. This is an ESLint error
  (`@angular-eslint/prefer-on-push-component-change-detection`), not a convention.
- All component state is signals. No mutable fields read from templates.
- Anything asynchronous either writes to a signal or goes through the router.

`ScrollService` and `TiltDirective` register their listeners with
`NgZone.runOutsideAngular`. Under zoneless that is a no-op — it is there so the
behaviour stays correct if a dependency ever forces zone.js back in.

## Content as compiled data, not runtime fetches

Blog posts are markdown files in `src/content/blog`.
`scripts/generate-blog-index.mjs` reads them at build time and emits:

- `core/data/generated/blog-index.ts` — typed metadata for every post, plus a
  map of dynamic imports for the bodies.
- `core/data/generated/posts/<slug>.ts` — one module per post body.

This was chosen over fetching markdown at runtime for three reasons:

1. **Prerendering needs the content synchronously.** A runtime fetch means the
   prerendered HTML contains a loading state, which for a blog is the difference
   between being indexed and not.
2. **Front matter is validated at build time.** A post missing `description`
   fails `npm run build` with a message naming the file. The alternative is
   discovering it in production.
3. **Bodies stay code-split.** Because each post is its own module reached
   through a dynamic `import()`, esbuild emits one chunk per post. Opening one
   article downloads roughly 4 kB, not the whole archive.

The cost is a generation step, which is wired into `prebuild` and `prestart` so
nobody has to remember it.

## Data flow for a blog post

```
src/content/blog/post.md
  → generate-blog-index.mjs (build time: parse, validate, split)
    → BLOG_INDEX + BLOG_CONTENT
      → BlogService.load(slug)          (metadata + dynamic import, cached)
        → blogPostResolver              (awaited by the router)
          → BlogPostPage `post` input   (via withComponentInputBinding)
            → renderMarkdown() in a computed
              → sanitised HTML + table of contents
```

The resolver is the load-bearing part. Loading inside the component would work
in the browser and silently produce empty prerendered HTML on the server,
because the router would have finished navigating before the content arrived.

## Theming

Two layers of CSS custom properties, described at length in the blog post
`css-variables-are-a-runtime`:

- **Primitives** (`--hue-primary`, `--accent-primary`) in `_tokens.scss`. No
  component may reference these.
- **Semantics** (`--surface`, `--text-primary`, `--accent`) in `_themes.scss`,
  rebound per theme. These are the only colours components use.

Adding a third theme — high contrast, say — means writing one more semantic
block. No component changes.

`ThemeService` holds the preference as a signal. The initial value is read from
`<html data-theme>` rather than from storage, because `index.html` contains a
synchronous inline script that applies the stored preference before first paint.
Any asynchronous alternative reintroduces the flash it exists to prevent.

## Rendering strategy

`app.routes.server.ts` marks every route `RenderMode.Prerender`. The
parameterised routes derive their params from the same constants the components
read, so adding a project or a post automatically adds its prerendered page —
there is no second list to keep in sync.

`src/server.ts` still exists and is worth keeping: it serves the static output,
handles anything not prerendered, and is where an API route would go if the
contact form ever gets a real backend.

## Accessibility

Handled structurally rather than as a review checklist:

- `prefers-reduced-motion: reduce` neutralises all animation globally in
  `_animations.scss`, so a new animation cannot regress it by omission.
- The reveal-on-scroll pre-state is _inside_ a `no-preference` query, so if the
  IntersectionObserver never runs the content is visible rather than invisible.
  Fail open.
- Card links use a stretched pseudo-element rather than wrapping the card in an
  `<a>`, so the accessibility tree gets one meaningful link instead of one that
  announces the entire card.
- Filter controls have `role="status"` result counts, so a screen-reader user
  hears that the button did something.
- `angular-eslint`'s template accessibility rules run in CI.

## Testing

Vitest via `@angular/build:unit-test`. The suite covers the logic that would
actually break: markdown rendering, filtering, sorting, date maths and the
theme service's platform edge cases.

There are deliberately no `should create` smoke tests. The reasoning is in the
blog post `tests-that-earn-their-keep`, and it applies to this repository too.
