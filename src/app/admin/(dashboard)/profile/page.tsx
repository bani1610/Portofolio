import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ProfileForm } from '@/components/admin/profile-form';
import { saveProfile } from '@/lib/actions/singletons';

export const instant = false;

export default async function AdminProfilePage() {
  const { supabase } = await requireAdmin();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .maybeSingle();

  // Passing the id (or null on first save) lets one action handle both the
  // initial insert and every later update.
  const action = saveProfile.bind(null, profile?.id ?? null);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Profile"
        description="Identitas yang tampil di hero, bagian About, dan footer."
      />
      <ProfileForm action={action} item={profile} />
    </div>
  );
}
