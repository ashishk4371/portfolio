import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PROFILE } from '../../../../core/data';
import { Icon } from '../../../../shared/components/icon/icon';

const ROTATE_INTERVAL_MS = 2800;

/** Syntax tone for a run of characters in the decorative terminal. */
type Tone = 'muted' | 'fn' | 'key' | 'str' | 'ok' | 'plain';

interface TerminalSegment {
  readonly text: string;
  readonly tone: Tone;
}

/**
 * The terminal panel is modelled as data rather than written as markup.
 * Its content contains `{` and `}`, which Angular templates reserve for
 * interpolation — expressing it as segments avoids escaping every brace and
 * keeps the markup readable.
 */
const TERMINAL: readonly (readonly TerminalSegment[])[] = [
  [
    { text: '$ ', tone: 'muted' },
    { text: 'whoami', tone: 'fn' },
  ],
  [{ text: 'Ashish Kumar — Software Engineer', tone: 'plain' }],
  [{ text: '', tone: 'plain' }],
  [
    { text: '$ ', tone: 'muted' },
    { text: 'cat ', tone: 'fn' },
    { text: 'stack.json', tone: 'plain' },
  ],
  [{ text: '{', tone: 'plain' }],
  [
    { text: '  "frontend": ', tone: 'key' },
    { text: '["Angular", "TypeScript"]', tone: 'str' },
  ],
  [
    { text: '  "backend":  ', tone: 'key' },
    { text: '["Java", "Go", "Postgres"]', tone: 'str' },
  ],
  [
    { text: '  "platform": ', tone: 'key' },
    { text: '["Docker", "Azure", "AWS"]', tone: 'str' },
  ],
  [{ text: '}', tone: 'plain' }],
  [{ text: '', tone: 'plain' }],
  [
    { text: '$ ', tone: 'muted' },
    { text: 'npm ', tone: 'fn' },
    { text: 'run build', tone: 'plain' },
  ],
  [
    { text: '✓ ', tone: 'ok' },
    { text: 'built in 4.2s · 0 errors', tone: 'plain' },
  ],
];

/**
 * Above-the-fold hero.
 *
 * The rotating phrase is a signal advanced on an interval. Under zoneless
 * change detection the view updates purely because the template reads that
 * signal — there is no manual change detection call and no zone tick involved.
 */
@Component({
  selector: 'app-hero',
  imports: [RouterLink, Icon],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly profile = PROFILE;

  protected readonly roles = [
    'production systems',
    'design systems',
    'developer tools',
    'things that last',
  ] as const;

  protected readonly roleIndex = signal(0);
  protected readonly terminal = TERMINAL;

  constructor() {
    // Never started on the server: a pending interval keeps the render alive
    // and delays prerendered output.
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    const timer = setInterval(
      () => this.roleIndex.update((index) => (index + 1) % this.roles.length),
      ROTATE_INTERVAL_MS,
    );

    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}
