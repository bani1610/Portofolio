import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormModal } from '@/components/admin/form-modal';
import { AchievementForm } from '@/components/admin/achievement-form';
import { createAchievement } from '@/lib/actions/entities';

export const instant = false;

export default async function NewAchievementModal() {
  await requireAdmin();

  return (
    <FormModal title="Tambah Pencapaian">
      {({ onDirtyChange }) => (
        <AchievementForm action={createAchievement} onDirtyChange={onDirtyChange} />
      )}
    </FormModal>
  );
}
