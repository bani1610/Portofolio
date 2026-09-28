import { THEME_STORAGE_KEY } from '@/lib/theme';

/**
 * Applies the stored theme before first paint (DESIGN.md §10).
 *
 * This has to be a blocking inline script in <head>: a React effect runs
 * after hydration, which is far too late — the page would paint dark,
 * then flash to light. Everything it needs is inlined because it runs
 * before any bundle has loaded.
 *
 * Kept deliberately small; it is on the critical path of every render.
 */
const script = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    // No stored preference means dark (PRD 34). The OS setting is
    // followed only when the visitor has explicitly chosen 'system'.
    var isLight =
      stored === 'light' ||
      (stored === 'system' &&
        window.matchMedia('(prefers-color-scheme: light)').matches);
    if (isLight) document.documentElement.classList.add('light');
  } catch (e) {
    // localStorage can throw in private mode. Dark is the default, and
    // the markup already renders dark, so failing silently is correct.
  }
})();
`;

export function ThemeScript() {
  return (
    <script
      // The content is a build-time constant, never user input.
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
