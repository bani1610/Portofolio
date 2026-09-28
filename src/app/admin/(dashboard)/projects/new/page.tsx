import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ProjectForm } from '@/components/admin/project-form';
import { createProject } from '@/lib/actions/projects';

export const instant = false;

export default async function NewProjectPage() {
  const { supabase } = await requireAdmin();

  const { data: technologies } = await supabase
    .from('technologies')
    .select('*')
    .order('category')
    .order('display_order');

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tambah Project"
        description="Project baru tersimpan sebagai draft sampai Anda menerbitkannya."
      />
      <ProjectForm action={createProject} technologies={technologies ?? []} />
    </div>
  );
}
