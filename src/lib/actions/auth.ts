'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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

  redirect(redirectTo);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
