import { DOCUMENT, Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ResolvedTheme, ThemePreference, isThemePreference } from '../models';
import { SITE_CONFIG } from '../tokens';

/**
 * Owns the light/dark/system preference.
 *
 * The initial value is read from the DOM rather than from storage: `index.html`
 * runs a synchronous script that applies the stored preference before first
 * paint, so by the time Angular boots the answer is already on
 * `<html data-theme>`. Reading it back keeps the two in sync and means this
 * service never causes a flash.
 *
 * Server-side there is no stored preference and no `matchMedia`, so it resolves
 * to `system`, matching the static default in `index.html`. Prerendered markup
 * and the first client paint therefore agree.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(SITE_CONFIG);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly storageKey = `${this.config.storagePrefix}.theme`;

  private readonly preferenceState = signal<ThemePreference>(this.readInitialPreference());
  private readonly systemPrefersDark = signal(true);

  /** What the user chose — may be `system`. */
  readonly preference = this.preferenceState.asReadonly();

  /** What is actually on screen, with `system` resolved. */
  readonly resolved = computed<ResolvedTheme>(() => {
    const preference = this.preferenceState();
    if (preference !== 'system') return preference;
    return this.systemPrefersDark() ? 'dark' : 'light';
  });

  readonly isDark = computed(() => this.resolved() === 'dark');

  constructor() {
    if (this.isBrowser) {
      this.trackSystemPreference();
    }

    effect(() => {
      const preference = this.preferenceState();
      if (!this.isBrowser) return;

      this.applyToDocument(preference);
      this.persist(preference);
    });
  }

  set(preference: ThemePreference): void {
    this.preferenceState.set(preference);
  }

  /** Toggles between explicit light and dark, collapsing `system` to its opposite. */
  toggle(): void {
    this.preferenceState.set(this.resolved() === 'dark' ? 'light' : 'dark');
  }

  private readInitialPreference(): ThemePreference {
    // Angular's server DOM does not implement `HTMLElement.dataset`, and there
    // is no stored preference to read during prerendering anyway. `system`
    // matches the static default in index.html, so server and client agree.
    if (!this.isBrowser) return 'system';

    const fromDom = this.document.documentElement.getAttribute('data-theme');
    return isThemePreference(fromDom) ? fromDom : 'system';
  }

  private trackSystemPreference(): void {
    const view = this.document.defaultView;

    // `matchMedia` is absent in some embedded webviews and in jsdom. Without
    // it the app simply keeps the current resolved theme rather than crashing.
    if (typeof view?.matchMedia !== 'function') return;

    const query = view.matchMedia('(prefers-color-scheme: dark)');
    if (!query) return;

    this.systemPrefersDark.set(query.matches);
    query.addEventListener('change', (event) => this.systemPrefersDark.set(event.matches));
  }

  private applyToDocument(preference: ThemePreference): void {
    const root = this.document.documentElement;
    const view = this.document.defaultView;

    if (root.getAttribute('data-theme') === preference) return;

    /**
     * Suppress transitions for the swap, otherwise every element animates its
     * colour independently and the change reads as a smear. Two frames are
     * needed: the first applies the class, the second lets the new paint commit
     * before transitions are re-enabled.
     */
    root.classList.add('theme-transition');
    root.setAttribute('data-theme', preference);

    view?.requestAnimationFrame(() =>
      view.requestAnimationFrame(() => root.classList.remove('theme-transition')),
    );
  }

  private persist(preference: ThemePreference): void {
    try {
      this.document.defaultView?.localStorage.setItem(this.storageKey, preference);
    } catch {
      // Storage is unavailable in private mode and sandboxed iframes.
      // The theme still works for the session; it just will not be remembered.
    }
  }
}
