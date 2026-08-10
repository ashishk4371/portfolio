---
title: Design the API that fits the screen, not the database
description: Eleven round trips became one when we stopped exposing our schema and started exposing our pages.
date: 2026-04-02
tags: [architecture, api, performance]
featured: true
draft: false
cover: [190, 252]
---

Our product page made eleven requests before it could render. Not eleven requests total — eleven requests _in sequence_, because each one needed an id from the last.

The waterfall looked like this: fetch the product, then its variants, then inventory per variant, then pricing per region, then reviews, then the review authors, then related products, then _their_ inventory. On a good connection that was 1.8 seconds of pure latency before a single pixel of useful content appeared. On a mid-tier phone on 4G it was over four.

Every one of those endpoints was well designed. That was the problem.

## RESTful is not the same as useful

Each endpoint mapped cleanly onto a database table. `/products/:id` returned a product. `/variants?productId=` returned variants. This is textbook resource modelling and it made the backend team's life pleasant.

It also meant the client was responsible for reassembling a page out of eight resources, and the client is the one place in the system with the least information and the worst network.

The mismatch has a name — it is the reason BFFs exist — but naming it does not tell you where to draw the line. We spent a while getting that wrong in both directions.

## The first attempt: one endpoint per page

The obvious fix is an endpoint that returns exactly what the product page needs. We built `/pages/product/:slug`, it returned everything in one shot, and LCP dropped to 1.3 seconds.

Then the mobile team asked for the same data minus reviews. Then marketing wanted a variant of the page with an extra banner. Within two months we had `/pages/product/:slug`, `/pages/product-compact/:slug` and `/pages/product-campaign/:slug`, and they shared no code.

Page-shaped endpoints solve the latency problem and reintroduce it as a maintenance problem.

## What worked: a resolver layer with declared freshness

What we landed on keeps the resource endpoints exactly as they were, and puts a resolver in front of them:

```ts
export const productPage = definePage({
  params: z.object({ slug: z.string() }),

  resolve: {
    product: ({ slug }) => api.products.bySlug(slug),

    // Depends on `product`, so the resolver runs it in the second wave.
    variants: ({ product }) => api.variants.forProduct(product.id),
    reviews: ({ product }) => api.reviews.forProduct(product.id, { limit: 10 }),

    // No dependencies, so this runs in the first wave alongside `product`.
    banner: ({ slug }) => api.cms.bannerFor(slug),
  },

  cache: {
    product: { ttl: '5m', swr: '1h' },
    variants: { ttl: '30s', swr: '5m' },
    reviews: { ttl: '10m', swr: '1d' },
    banner: { ttl: '1h', swr: '1d' },
  },
});
```

Three things fall out of this shape.

The resolver derives the dependency graph from which keys each function destructures, so independent fetches happen in parallel automatically. Our eleven sequential requests became three waves.

Caching is declared per field rather than per response. A page that mixes a price updated every thirty seconds with a marketing banner that changes weekly no longer has to cache at the speed of its most volatile field. That single change took our origin request rate down by about 80%.

And a new page variant is a new `definePage` that reuses the same resolvers. The compact mobile page is nine lines.

## The part I would tell my past self

We treated this as a performance project for the first month, and measured it entirely in LCP. That was fine, but it meant the caching design came last, almost as an afterthought.

Per-field freshness turned out to be the load-bearing idea. Once each piece of data declares how stale it is allowed to be, most of the hard questions about invalidation stop being architectural decisions and become configuration. If I were starting again I would design that first and let the request-collapsing fall out of it.

> The endpoint shape is a consequence of the caching policy, not the other way around.

We are eighteen months in and have added about thirty pages on top of this. The resolver file is still under 400 lines.
