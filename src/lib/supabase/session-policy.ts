import type { CookieOptions } from '@supabase/ssr';

/**
 * How long the admin session survives with no requests.
 *
 * Every admin request refreshes the activity cookie below, so the window only
 * runs down while nothing is happening. 30 minutes is long enough to fill in
 * the Project form without being thrown out mid-edit.
 */
export const IDLE_TIMEOUT_SECONDS = 30 * 60;

/** Presence of this cookie means "the session was active recently". */
export const ACTIVITY_COOKIE = 'admin-last-active';

/**
 * Turns Supabase's auth cookies into session cookies.
 *
 * @supabase/ssr writes them with `maxAge: 400 * 24 * 60 * 60` and, in
 * `cookies.js`, applies that value AFTER spreading any `cookieOptions` we
 * pass, so configuring the client cannot change it. Dropping `maxAge` and
 * `expires` here is what actually makes the browser discard the session when
 * it closes, which is the behaviour asked for.
 *
 * Note for whoever reads this next: a browser set to restore tabs (Chrome and
 * Brave both offer it) can keep session cookies across a restart. The idle
 * timeout is what covers that case, which is why both exist.
 */
export function toSessionCookie(options: CookieOptions): CookieOptions {
  const sessionCookie: CookieOptions = { ...options };
  delete sessionCookie.maxAge;
  delete sessionCookie.expires;
  return sessionCookie;
}

/**
 * Options for the activity cookie.
 *
 * This one keeps its `maxAge`: the browser expiring it is exactly the signal
 * we read. It is httpOnly so page scripts cannot extend the window, and
 * `secure` outside development so it is not sent over plain HTTP.
 */
export function activityCookieOptions(): CookieOptions {
  return {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: IDLE_TIMEOUT_SECONDS,
  };
}
