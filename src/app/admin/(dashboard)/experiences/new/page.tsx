import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ExperienceForm } from '@/components/admin/experience-form';
import { createExperience } from '@/lib/actions/entities';

export const instant = false;

export default async function NewExperiencePage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Tambah Pengalaman" />
      <ExperienceForm action={createExperience} />
    </div>
  );
}
