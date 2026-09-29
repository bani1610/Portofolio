import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormModal } from '@/components/admin/form-modal';
import { TechnologyForm } from '@/components/admin/technology-form';
import { updateTechnology } from '@/lib/actions/entities';

export const instant = false;

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTechnologyModal({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: item } = await supabase
    .from('technologies')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <FormModal title="Ubah teknologi" description={item.name}>
      {({ onDirtyChange }) => (
        <TechnologyForm
          action={updateTechnology.bind(null, item.id)}
          item={item}
          onDirtyChange={onDirtyChange}
        />
      )}
    </FormModal>
  );
}
