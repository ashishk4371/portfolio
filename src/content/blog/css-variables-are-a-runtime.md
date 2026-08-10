---
title: CSS custom properties are a runtime, and that changes how you theme
description: Two themes is a config problem. Three is an architecture problem. Here is the line between them.
date: 2026-02-11
tags: [css, design-systems, architecture]
featured: false
draft: false
cover: [288, 320]
---

Most theming advice stops at "use CSS variables". That is correct and roughly as useful as "use functions".

The interesting question is what the variables are _named_, because that decision determines whether adding a third theme takes an afternoon or a quarter.

## Two layers, not one

The mistake I made for years was declaring one flat set of variables:

```css
:root {
  --blue-500: #6366f1;
  --gray-900: #0a0b10;
  --gray-100: #f4f4f6;
}
```

Then components reference `--blue-500` directly. This works perfectly until you add a light theme, at which point you discover that `--gray-900` is the background in one theme and the text colour in the other, and the name has become a lie.

The fix is two layers with different jobs:

```css
/* Layer 1 — primitives. Never referenced by a component. */
:root {
  --hue-primary: 252;
  --accent-primary: hsl(var(--hue-primary) 92% 68%);
}

/* Layer 2 — semantics. The only thing components are allowed to use. */
:root[data-theme='dark'] {
  --surface: hsl(230 19% 9%);
  --text-primary: hsl(230 30% 94%);
  --accent: var(--accent-primary);
}

:root[data-theme='light'] {
  --surface: hsl(0 0% 100%);
  --text-primary: hsl(235 30% 11%);
  --accent: hsl(var(--hue-primary) 78% 55%);
}
```

A component says `background: var(--surface)`. It has no idea what colour that is, which is exactly the property you want. Adding a high-contrast theme means writing one more semantic block — no component changes at all.

The rule that makes this hold: **if a component references a primitive, that is a bug.** It is worth a lint rule. We use a stylelint config that fails on any `var(--hue-` or `var(--accent-primary` outside the theme files.

## Naming semantics is the actual work

Picking good semantic names is harder than it looks, because the honest answer to "what is this colour for" is often "several things".

The heuristic that has held up for me: name by _role in the visual hierarchy_, not by appearance and not by component.

- `--surface`, `--surface-raised`, `--surface-inset` — good. Describes depth, which is a property both themes share.
- `--card-bg`, `--modal-bg`, `--tooltip-bg` — bad. You will have forty of these and they will all be the same value.
- `--light-gray` — bad in the obvious way.

If two components need visually different backgrounds, that is usually a depth difference, and depth is a concept with maybe four levels in it. Resist the urge to add a fifth.

## The flash-of-wrong-theme problem

Any theme stored in `localStorage` has a race: the stylesheet applies before your JavaScript framework boots and reads the preference, so the user sees dark, then light, then dark again.

There is exactly one reliable fix and it is unglamorous — a synchronous inline script in the `<head>`, before any stylesheet:

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      document.documentElement.dataset.theme = stored || 'system';
    } catch (e) {
      document.documentElement.dataset.theme = 'system';
    }
  })();
</script>
```

It has to be inline, it has to be synchronous, and it has to run before the stylesheet. Every async alternative reintroduces the flash. The `try/catch` matters more than it looks: `localStorage` throws outright in Safari's private mode and in sandboxed iframes, and an uncaught error here means no theme at all.

## Suppress the transition, not the change

Once toggling works, you hit a subtler problem. If elements have `transition: background-color 200ms`, switching themes animates every element independently and the whole page appears to smear.

The fix is to disable transitions for exactly one frame:

```ts
function setTheme(next: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.add('theme-transition');
  root.dataset.theme = next;

  // Two frames: one to apply the class, one to let the paint settle.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.remove('theme-transition'));
  });
}
```

```css
.theme-transition,
.theme-transition *,
.theme-transition *::before,
.theme-transition *::after {
  transition: none !important;
}
```

The double `requestAnimationFrame` is not superstition. A single frame sometimes removes the class before the browser has committed the paint with the new values, and the smear comes back intermittently — which is the worst kind of bug to be handed.

## Where the runtime framing pays off

Treating custom properties as a runtime rather than a preprocessor feature opens up things that are awkward otherwise. Scoped overrides are the big one: any subtree can rebind a semantic variable and everything inside it adapts, with no prop drilling and no context provider.

```css
/* An inverted callout, without a single new component variant. */
.callout--inverted {
  --surface: var(--text-primary);
  --text-primary: var(--surface-inset);
}
```

That is a genuinely different capability from Sass variables, and it is the reason the two-layer split is worth the initial ceremony.
