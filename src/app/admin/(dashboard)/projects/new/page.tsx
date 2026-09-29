import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormPage } from '@/components/admin/form-page';
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
    <FormPage
      title="Tambah Project"
      description="Project baru tersimpan sebagai draft sampai Anda menerbitkannya."
    >
      <ProjectForm action={createProject} technologies={technologies ?? []} />
    </FormPage>
  );
}
