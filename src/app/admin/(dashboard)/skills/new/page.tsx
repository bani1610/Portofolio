import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { TechnologyForm } from '@/components/admin/technology-form';
import { createTechnology } from '@/lib/actions/entities';

export const instant = false;

export default async function NewTechnologyPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Tambah Teknologi" />
      <TechnologyForm action={createTechnology} />
    </div>
  );
}
