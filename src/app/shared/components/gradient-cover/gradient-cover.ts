import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Procedural cover art.
 *
 * Every card needs an image and a portfolio rarely has one worth shipping. Two
 * hues from the content model generate a deterministic mesh gradient plus a
 * faint dot grid — so covers are unique per item, consistent across builds,
 * theme-aware, and cost zero bytes of network transfer.
 */
@Component({
  selector: 'app-gradient-cover',
  templateUrl: './gradient-cover.html',
  styleUrl: './gradient-cover.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.--hue-a]': 'hues()[0]',
    '[style.--hue-b]': 'hues()[1]',
    'aria-hidden': 'true',
  },
})
export class GradientCover {
  readonly hues = input.required<readonly [number, number] | readonly number[]>();
  /** Monogram or short label rendered over the gradient. */
  readonly label = input<string>('');

  protected readonly initials = computed(() =>
    this.label()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? '')
      .join(''),
  );
}
