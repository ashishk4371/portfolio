import {
  DestroyRef,
  Directive,
  ElementRef,
  NgZone,
  PLATFORM_ID,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Subtle pointer-tracking tilt for cards.
 *
 * Only binds for devices with a fine pointer and only when the user has not
 * asked for reduced motion — on touch there is no hover state to respond to,
 * and running the handler there is pure cost.
 *
 * The handler writes CSS custom properties rather than `transform` directly, so
 * the stylesheet keeps control of how the tilt is composed with the element's
 * other transforms. All work happens outside the Angular zone and inside a
 * single rAF, so a fast pointer sweep costs one style write per frame.
 */
@Directive({
  selector: '[appTilt]',
  host: { class: 'tilt' },
})
export class TiltDirective {
  /**
   * Maximum rotation in degrees at the corners.
   * Named `max` so the alias reads as `appTiltMax` — the directive-prefix
   * convention the Angular style guide (and the lint rule) expects.
   */
  readonly max = input(6, { transform: numberAttribute, alias: 'appTiltMax' });

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private frame = 0;

  constructor() {
    if (!this.isBrowser) return;

    const supportsHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const allowsMotion = matchMedia('(prefers-reduced-motion: no-preference)').matches;
    if (!supportsHover || !allowsMotion) return;

    const host = this.element.nativeElement;

    this.zone.runOutsideAngular(() => {
      host.addEventListener('pointermove', this.onPointerMove);
      host.addEventListener('pointerleave', this.onPointerLeave);
    });

    inject(DestroyRef).onDestroy(() => {
      cancelAnimationFrame(this.frame);
      host.removeEventListener('pointermove', this.onPointerMove);
      host.removeEventListener('pointerleave', this.onPointerLeave);
    });
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    cancelAnimationFrame(this.frame);

    this.frame = requestAnimationFrame(() => {
      const host = this.element.nativeElement;
      const rect = host.getBoundingClientRect();

      // Normalised to -0.5..0.5 from the centre of the element.
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const max = this.max();

      host.style.setProperty('--tilt-x', `${(-y * max).toFixed(2)}deg`);
      host.style.setProperty('--tilt-y', `${(x * max).toFixed(2)}deg`);
      host.style.setProperty('--pointer-x', `${((x + 0.5) * 100).toFixed(1)}%`);
      host.style.setProperty('--pointer-y', `${((y + 0.5) * 100).toFixed(1)}%`);
    });
  };

  private readonly onPointerLeave = (): void => {
    cancelAnimationFrame(this.frame);

    const host = this.element.nativeElement;
    host.style.setProperty('--tilt-x', '0deg');
    host.style.setProperty('--tilt-y', '0deg');
  };
}
