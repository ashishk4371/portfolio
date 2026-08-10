import { DOCUMENT, Injectable, NgZone, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Single source of truth for scroll position.
 *
 * One passive listener feeds signals that any component can read, instead of
 * every sticky/parallax/progress element attaching its own handler. Reads are
 * batched into `requestAnimationFrame` so a fast scroll produces at most one
 * layout read per frame.
 *
 * The listener is registered outside the Angular zone — harmless under the
 * zoneless default, but it keeps the behaviour correct if zone.js is ever
 * reintroduced for a third-party dependency.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly offsetState = signal(0);
  private readonly progressState = signal(0);
  private ticking = false;

  readonly offset = this.offsetState.asReadonly();

  /** 0–1 through the document, for the reading-progress bar. */
  readonly progress = this.progressState.asReadonly();

  /** True once the page has scrolled far enough to warrant a condensed header. */
  readonly isScrolled = computed(() => this.offsetState() > 24);

  constructor() {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      this.document.defaultView?.addEventListener('scroll', this.onScroll, { passive: true });
      this.document.defaultView?.addEventListener('resize', this.onScroll, { passive: true });
    });

    this.measure();
  }

  private readonly onScroll = (): void => {
    if (this.ticking) return;

    this.ticking = true;
    this.document.defaultView?.requestAnimationFrame(() => {
      this.measure();
      this.ticking = false;
    });
  };

  private measure(): void {
    const view = this.document.defaultView;
    if (!view) return;

    const offset = view.scrollY;
    const scrollable = this.document.documentElement.scrollHeight - view.innerHeight;

    this.offsetState.set(offset);
    this.progressState.set(scrollable > 0 ? Math.min(1, Math.max(0, offset / scrollable)) : 0);
  }
}
