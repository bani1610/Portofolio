'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ACTIVITY_COOKIE, activityCookieOptions } from '@/lib/supabase/session-policy';

export type AuthActionResult = {
  success: boolean;
  message?: string;
};

export async function loginAction(
  formData: FormData
): Promise<AuthActionResult | void> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/admin';

  if (!email || !password) {
    return {
      success: false,
      message: 'Email dan password wajib diisi.',
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      message: 'Email atau kata sandi tidak sesuai.',
    };
  }

  // Verify that the user is registered in admin_users
  const { data: adminRecord, error: adminCheckError } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (adminCheckError || !adminRecord) {
    // Force sign out non-admin users
    await supabase.auth.signOut();
    return {
      success: false,
      message: 'Akun Anda tidak memiliki hak akses administrator.',
    };
  }

  /**
   * Opens the idle window.
   *
   * proxy.ts treats a session with no activity cookie as one that has been
   * idle too long, so without this the redirect below would arrive at /admin
   * and be signed straight back out: login would appear to do nothing.
   */
  const cookieStore = await cookies();
  cookieStore.set(ACTIVITY_COOKIE, '1', activityCookieOptions());

  redirect(redirectTo);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Cleared alongside the session: a stale activity cookie would otherwise
  // hand the next login a window it did not earn.
  const cookieStore = await cookies();
  cookieStore.delete(ACTIVITY_COOKIE);

  redirect('/admin/login');
}
