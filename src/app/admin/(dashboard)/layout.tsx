import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/admin-shell';

export const instant = false;

/**
 * `modal` is the @modal slot: the short forms, intercepted so they open over
 * the list they were started from. It renders null on every other route
 * (see @modal/default.tsx). LayoutProps carries its type from the route map,
 * so the slot cannot drift from the folder that defines it.
 */
export default async function AdminDashboardLayout({
  children,
  modal,
}: LayoutProps<'/admin'>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Security check: verify admin_users table membership
  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!adminRecord) {
    redirect('/admin/unauthorized');
  }

  return (
    <AdminShell userEmail={user.email}>
      {children}
      {modal}
    </AdminShell>
  );
}
