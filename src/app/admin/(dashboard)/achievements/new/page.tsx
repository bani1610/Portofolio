import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormPage } from '@/components/admin/form-page';
import { AchievementForm } from '@/components/admin/achievement-form';
import { createAchievement } from '@/lib/actions/entities';

export const instant = false;

export default async function NewAchievementPage() {
  await requireAdmin();

  return (
    <FormPage title="Tambah Pencapaian">
      <AchievementForm action={createAchievement} />
    </FormPage>
  );
}
