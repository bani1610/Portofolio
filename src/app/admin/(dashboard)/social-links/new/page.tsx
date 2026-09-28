import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { SocialLinkForm } from '@/components/admin/social-link-form';
import { createSocialLink } from '@/lib/actions/entities';

export const instant = false;

export default async function NewSocialLinkPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Tambah Tautan" />
      <SocialLinkForm action={createSocialLink} />
    </div>
  );
}
