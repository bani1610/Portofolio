import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormPage } from '@/components/admin/form-page';
import { SocialLinkForm } from '@/components/admin/social-link-form';
import { createSocialLink } from '@/lib/actions/entities';

export const instant = false;

export default async function NewSocialLinkPage() {
  await requireAdmin();

  return (
    <FormPage title="Tambah Tautan">
      <SocialLinkForm action={createSocialLink} />
    </FormPage>
  );
}
