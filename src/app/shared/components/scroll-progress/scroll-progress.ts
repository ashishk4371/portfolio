import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ScrollService } from '../../../core/services';

/**
 * Reading-progress bar pinned below the header.
 *
 * Reads the shared ScrollService rather than attaching its own listener, and
 * scales a full-width element on the compositor instead of animating `width`,
 * which would force layout on every frame.
 */
@Component({
  selector: 'app-scroll-progress',
  template: `
    <div
      class="progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin="0"
      aria-valuemax="100"
      [attr.aria-valuenow]="Math.round(progress() * 100)"
    >
      <span class="progress__bar" [style.transform]="'scaleX(' + progress() + ')'"></span>
    </div>
  `,
  styleUrl: './scroll-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollProgress {
  protected readonly progress = inject(ScrollService).progress;
  protected readonly Math = Math;
}
