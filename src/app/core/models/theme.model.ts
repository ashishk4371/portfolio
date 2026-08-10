/** User-selectable theme preference. `system` defers to `prefers-color-scheme`. */
export type ThemePreference = 'light' | 'dark' | 'system';

/** The theme actually painted on screen once `system` has been resolved. */
export type ResolvedTheme = 'light' | 'dark';

export const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'] as const;

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value);
}
