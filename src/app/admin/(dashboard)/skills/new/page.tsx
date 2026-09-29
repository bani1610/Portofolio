import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormPage } from '@/components/admin/form-page';
import { TechnologyForm } from '@/components/admin/technology-form';
import { createTechnology } from '@/lib/actions/entities';

export const instant = false;

export default async function NewTechnologyPage() {
  await requireAdmin();

  return (
    <FormPage title="Tambah Teknologi">
      <TechnologyForm action={createTechnology} />
    </FormPage>
  );
}
