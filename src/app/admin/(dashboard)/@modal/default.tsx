/**
 * Renders nothing when no modal route is active.
 *
 * Without this file the slot 404s on a hard load of any dashboard page,
 * because Next cannot recover the slot's state after a full page load.
 */

// Every admin segment opts out: these pages read the session through
// Supabase on each request, which is uncached by definition. A Default
// segment is validated implicitly, so without this the auth call shows up
// in the dev overlay as an uncached-data error on every admin navigation.
export const instant = false;

export default function Default() {
  return null;
}
