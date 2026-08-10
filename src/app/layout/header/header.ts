import {
  DOCUMENT,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { PRIMARY_NAV, PROFILE } from '../../core/data';
import { ScrollService } from '../../core/services';
import { Icon } from '../../shared/components/icon/icon';
import { ScrollProgress } from '../../shared/components/scroll-progress/scroll-progress';
import { ThemeToggle } from '../../shared/components/theme-toggle/theme-toggle';

/**
 * Site header.
 *
 * Condenses on scroll, and swaps to a full-screen panel on small viewports.
 * The mobile panel locks body scroll while open and closes on route change,
 * on Escape and on backdrop click — all three matter, because a nav that traps
 * the user is worse than no nav at all.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Icon, ThemeToggle, ScrollProgress],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-scrolled]': 'isScrolled()',
    '[class.is-open]': 'menuOpen()',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class Header {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  protected readonly profile = PROFILE;
  protected readonly navItems = PRIMARY_NAV;
  protected readonly isScrolled = inject(ScrollService).isScrolled;

  private readonly menuOpenState = signal(false);
  protected readonly menuOpen = this.menuOpenState.asReadonly();

  /** The blog and project detail routes render their own progress bar. */
  protected readonly showProgress = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/blog/')),
    ),
    { initialValue: false },
  );

  constructor() {
    // Any navigation dismisses the mobile panel.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeMenu());

    effect(() => {
      this.document.body.classList.toggle('is-scroll-locked', this.menuOpenState());
    });
  }

  protected toggleMenu(): void {
    this.menuOpenState.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpenState.set(false);
  }
}
