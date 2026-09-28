import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { TechnologyForm } from '@/components/admin/technology-form';
import { updateTechnology } from '@/lib/actions/entities';

export const instant = false;

type PageProps = { params: Promise<{ id: string }> };

export default async function EditTechnologyPage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: item } = await supabase
    .from('technologies')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Ubah teknologi" description={item.name} />
      <TechnologyForm action={updateTechnology.bind(null, item.id)} item={item} />
    </div>
  );
}
