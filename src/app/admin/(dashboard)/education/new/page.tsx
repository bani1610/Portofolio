import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { EducationForm } from '@/components/admin/education-form';
import { createEducation } from '@/lib/actions/entities';

export const instant = false;

export default async function NewEducationPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Tambah Pendidikan" />
      <EducationForm action={createEducation} />
    </div>
  );
}
