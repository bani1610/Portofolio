/**
 * Theme handling — DESIGN.md §10.
 *
 * Dark is the default (PRD §34). The choice lives in localStorage under
 * `theme` and is applied by adding/removing the `light` class on <html>,
 * matching the token layer in globals.css.
 */

export type Theme = 'dark' | 'light' | 'system';

export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light' || value === 'system';
}

/** Resolves 'system' against the OS preference; 'dark'/'light' pass through. */
export function resolveTheme(theme: Theme): 'dark' | 'light' {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle('light', resolved === 'light');

  // Keep the browser chrome in step with the page (DESIGN.md §10).
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const styles = getComputedStyle(document.documentElement);
    meta.setAttribute('content', styles.getPropertyValue('--background').trim());
  }
}
