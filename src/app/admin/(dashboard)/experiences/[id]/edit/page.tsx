import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ExperienceForm } from '@/components/admin/experience-form';
import { updateExperience } from '@/lib/actions/entities';

export const instant = false;

type PageProps = { params: Promise<{ id: string }> };

export default async function EditExperiencePage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: item } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Ubah pengalaman" description={item.position} />
      <ExperienceForm action={updateExperience.bind(null, item.id)} item={item} />
    </div>
  );
}
