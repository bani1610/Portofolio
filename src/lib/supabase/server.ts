import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';
import { toSessionCookie } from './session-policy';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Same policy as proxy.ts: no maxAge, so the browser drops the
              // session when it closes. loginAction writes through here, so
              // without this the cookie set at sign-in would outlive the
              // browser even though every later refresh did not.
              cookieStore.set(name, value, toSessionCookie(options));
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware/proxy refreshing sessions.
          }
        },
      },
    }
  );
}
