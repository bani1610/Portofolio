import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './types';
import {
  ACTIVITY_COOKIE,
  activityCookieOptions,
  toSessionCookie,
} from './session-policy';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            // Stripped of maxAge so the browser drops the session on close.
            supabaseResponse.cookies.set(name, value, toSessionCookie(options))
          );
        },
      },
    }
  );

  // Validate the user's token directly with Supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isUnauthorizedPage = request.nextUrl.pathname === '/admin/unauthorized';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  /**
   * Idle timeout.
   *
   * The activity cookie is rewritten on every admin request and expires on its
   * own after IDLE_TIMEOUT_SECONDS. So a valid Supabase session with no
   * activity cookie means the admin has been away past the window, and the
   * session is ended here rather than merely hidden.
   *
   * Checked before the redirect below, so an expired session lands on the
   * login page with a reason instead of silently appearing logged out.
   */
  if (user && isAdminRoute && !isLoginPage && !isUnauthorizedPage) {
    const lastActive = request.cookies.get(ACTIVITY_COOKIE);

    if (!lastActive) {
      await supabase.auth.signOut();

      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('reason', 'idle');
      url.searchParams.set('redirectTo', request.nextUrl.pathname);

      const response = NextResponse.redirect(url);
      // signOut() cleared the auth cookies on supabaseResponse, which is
      // thrown away by returning a redirect instead. Expiring them by name on
      // the redirect is what actually reaches the browser; without it the
      // session cookies would survive and the next request would be signed in
      // again.
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.delete(cookie.name);
      });
      response.cookies.delete(ACTIVITY_COOKIE);
      return response;
    }
  }

  // If visiting /admin/* without session, redirect to login
  if (isAdminRoute && !isLoginPage && !isUnauthorizedPage && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If already logged in and visiting login page, redirect to dashboard
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  // Slide the idle window forward. Only for a signed-in admin: writing it for
  // anonymous visitors would hand out a head start on the next login.
  if (user && isAdminRoute) {
    supabaseResponse.cookies.set(ACTIVITY_COOKIE, '1', activityCookieOptions());
  }

  return supabaseResponse;
}
