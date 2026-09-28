import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { AchievementForm } from '@/components/admin/achievement-form';
import { updateAchievement } from '@/lib/actions/entities';

export const instant = false;

type PageProps = { params: Promise<{ id: string }> };

export default async function EditAchievementPage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: item } = await supabase
    .from('achievements')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Ubah pencapaian" description={item.title} />
      <AchievementForm action={updateAchievement.bind(null, item.id)} item={item} />
    </div>
  );
}
