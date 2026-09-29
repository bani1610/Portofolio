import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormPage } from '@/components/admin/form-page';
import { EducationForm } from '@/components/admin/education-form';
import { createEducation } from '@/lib/actions/entities';

export const instant = false;

export default async function NewEducationPage() {
  await requireAdmin();

  return (
    <FormPage title="Tambah Pendidikan">
      <EducationForm action={createEducation} />
    </FormPage>
  );
}
