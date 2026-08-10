import {
  DestroyRef,
  Directive,
  ElementRef,
  PLATFORM_ID,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Reveals an element the first time it enters the viewport.
 *
 * Design notes:
 *  - The pre-reveal state lives in CSS (`.reveal` in `_utilities.scss`) and is
 *    wrapped in `prefers-reduced-motion: no-preference`. If the observer never
 *    runs — reduced motion, no JS, an old browser — content is visible by
 *    default rather than stuck at `opacity: 0`. Fail open, always.
 *  - One observer per element sounds wasteful, but it lets each element
 *    disconnect the moment it has revealed, so nothing keeps observing a page
 *    the user has already scrolled past.
 *  - Server-side this is inert, so prerendered HTML ships fully visible.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    class: 'reveal',
    '[style.--reveal-delay.ms]': 'delay()',
    '[style.--reveal-offset]': 'offset()',
  },
})
export class RevealDirective {
  /** Stagger in milliseconds, for revealing a list one item at a time. */
  readonly delay = input(0, { transform: numberAttribute, alias: 'appRevealDelay' });

  /** Distance the element travels as it reveals. */
  readonly offset = input<string>('1.75rem', { alias: 'appRevealOffset' });

  /** How much of the element must be visible before it triggers. */
  readonly threshold = input(0.15, { transform: numberAttribute, alias: 'appRevealThreshold' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      this.element.nativeElement.classList.add('reveal--visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          entry.target.classList.add('reveal--visible');
          observer.disconnect();
        }
      },
      // The bottom margin fires the reveal slightly before the element is fully
      // on screen, so the animation is already settling as it arrives.
      { threshold: this.threshold(), rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(this.element.nativeElement);
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
