import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormPage } from '@/components/admin/form-page';
import { ExperienceForm } from '@/components/admin/experience-form';
import { createExperience } from '@/lib/actions/entities';

export const instant = false;

export default async function NewExperiencePage() {
  await requireAdmin();

  return (
    <FormPage title="Tambah Pengalaman">
      <ExperienceForm action={createExperience} />
    </FormPage>
  );
}
