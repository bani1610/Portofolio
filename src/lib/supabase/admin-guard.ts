import { redirect } from 'next/navigation';
import { createClient } from './server';

/**
 * Confirms the caller is an admin, in the data layer.
 *
 * proxy.ts also checks, but Next 16's docs are explicit that proxy is an
 * optimistic check and must not be the only defence (IMPLEMENTATION.md
 * Fase 6). This runs on every admin read and write, and RLS is the third
 * layer underneath it.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRecord) redirect('/admin/unauthorized');

  return { supabase, user };
}
