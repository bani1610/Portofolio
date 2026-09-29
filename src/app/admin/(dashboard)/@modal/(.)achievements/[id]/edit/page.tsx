import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormModal } from '@/components/admin/form-modal';
import { AchievementForm } from '@/components/admin/achievement-form';
import { updateAchievement } from '@/lib/actions/entities';

export const instant = false;

type PageProps = { params: Promise<{ id: string }> };

export default async function EditAchievementModal({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: item } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <FormModal title="Ubah pencapaian" description={item.title}>
      {({ onDirtyChange }) => (
        <AchievementForm
          action={updateAchievement.bind(null, item.id)}
          item={item}
          onDirtyChange={onDirtyChange}
        />
      )}
    </FormModal>
  );
}
