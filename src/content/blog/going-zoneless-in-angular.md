---
title: What actually changes when you go zoneless
description: Removing zone.js from a 240-component Angular app was less about performance and more about finally understanding when our UI updates.
date: 2026-06-18
tags: [angular, signals, performance]
featured: true
draft: false
cover: [252, 288]
---

We shipped our first zoneless build in March. The bundle got 41kB lighter and our INP improved, but neither of those is the reason I would do it again.

The real change is that change detection stopped being a mystery.

## The problem was never the cost

The usual argument for dropping zone.js is overhead: it monkey-patches every async API in the browser, and every patched callback triggers a full application check. That is true, and on a large enough tree it does show up in a profile.

But in six years of Angular work I have never opened a performance ticket that traced back to zone.js overhead. What I have opened, repeatedly, are tickets that read like this:

> The badge count updates when you click anywhere else on the page, but not when the websocket message arrives.

That is a zone bug. Specifically, it is a "this async source was not patched, so nothing told Angular to look" bug. The fix is `ngZone.run()` or a `ChangeDetectorRef.detectChanges()` dropped in until the symptom goes away, and nobody on the team can explain why the fix works.

## Zoneless makes the contract explicit

Without zone.js, Angular only re-renders when something tells it to. In practice that means one of:

- a signal read in a template changed
- an `async` pipe emitted
- an event bound in a template fired
- someone called `markForCheck()` by hand

That list is short enough to hold in your head, which is the entire point. When the badge does not update, there is no ambiguity about the cause: nothing in that list happened.

```ts
// Before: the update works, and nobody is sure why.
@Component({/* ... */})
export class NotificationBadge implements OnInit {
  count = 0;

  ngOnInit(): void {
    this.socket.messages$.subscribe((message) => {
      this.count = message.unread; // updates... sometimes
    });
  }
}

// After: the update is the only thing that could have caused a render.
@Component({/* ... */})
export class NotificationBadge {
  private readonly socket = inject(SocketService);
  protected readonly count = toSignal(this.socket.messages$.pipe(map((m) => m.unread)), {
    initialValue: 0,
  });
}
```

The second version is shorter, but more importantly it cannot half-work. Either `count` is a signal the template reads, or it is not.

## What the migration actually cost

The mechanical part was fast. `provideZonelessChangeDetection()`, drop `zone.js` from the polyfills, run the suite. About a day.

The long tail was everything that had been quietly relying on a zone tick:

| Pattern                                      | Occurrences | Fix                                   |
| -------------------------------------------- | ----------- | ------------------------------------- |
| `setTimeout` mutating a field                | 61          | Convert the field to a signal         |
| Third-party callback mutating state          | 18          | Wrap in a signal, or `markForCheck()` |
| `ChangeDetectorRef.detectChanges()` in tests | 140+        | `await fixture.whenStable()`          |
| Manual `NgZone.run()`                        | 23          | Delete — no longer meaningful         |

The test column was the surprise. Roughly a third of our component specs were passing for the wrong reason: they called `detectChanges()` synchronously, which happened to flush a pending microtask that the component depended on. Zoneless made those tests honest, and about forty of them turned out to be asserting on a render that never actually happened in production.

That was the genuinely valuable part of the migration, and it had nothing to do with performance.

## Where it still hurts

Two things remain annoying.

Third-party libraries that mutate state from outside Angular still need a manual nudge. Charting libraries are the usual offender — they hand you a callback, you set a field, and nothing happens. The fix is a one-line signal setter, but you have to notice first.

And `OnPush` is now effectively mandatory rather than a recommendation. That is arguably correct, but it means a component written casually by someone new to the codebase will behave differently from one written carefully, with no lint rule to catch the difference.

## Would I do it again

Yes, but I would frame it differently to the team. We sold it internally as a performance project, and the performance numbers were real but unremarkable. What we actually bought was the ability to answer "why did this render" in one sentence.

If you are considering it: run your test suite against a zoneless config before you commit to anything. The failures will tell you more about your codebase than any audit.
