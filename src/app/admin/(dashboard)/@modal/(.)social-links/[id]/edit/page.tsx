import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormModal } from '@/components/admin/form-modal';
import { SocialLinkForm } from '@/components/admin/social-link-form';
import { updateSocialLink } from '@/lib/actions/entities';

export const instant = false;

type PageProps = { params: Promise<{ id: string }> };

export default async function EditSocialLinkModal({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: item } = await supabase
    .from('social_links')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <FormModal title="Ubah tautan" description={item.platform}>
      {({ onDirtyChange }) => (
        <SocialLinkForm
          action={updateSocialLink.bind(null, item.id)}
          item={item}
          onDirtyChange={onDirtyChange}
        />
      )}
    </FormModal>
  );
}
