import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormModal } from '@/components/admin/form-modal';
import { SocialLinkForm } from '@/components/admin/social-link-form';
import { createSocialLink } from '@/lib/actions/entities';

export const instant = false;

export default async function NewSocialLinkModal() {
  await requireAdmin();

  return (
    <FormModal title="Tambah Tautan">
      {({ onDirtyChange }) => (
        <SocialLinkForm action={createSocialLink} onDirtyChange={onDirtyChange} />
      )}
    </FormModal>
  );
}
