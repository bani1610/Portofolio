import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormPage } from '@/components/admin/form-page';
import { EducationForm } from '@/components/admin/education-form';
import { updateEducation } from '@/lib/actions/entities';

export const instant = false;

type PageProps = { params: Promise<{ id: string }> };

export default async function EditEducationPage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: item } = await supabase
    .from('education')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <FormPage title="Ubah pendidikan" description={item.institution}>
      <EducationForm action={updateEducation.bind(null, item.id)} item={item} />
    </FormPage>
  );
}
