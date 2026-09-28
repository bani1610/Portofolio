import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AchievementForm } from '@/components/admin/achievement-form';
import { createAchievement } from '@/lib/actions/entities';

export const instant = false;

export default async function NewAchievementPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Tambah Pencapaian" />
      <AchievementForm action={createAchievement} />
    </div>
  );
}
