import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ProjectForm } from '@/components/admin/project-form';
import { updateProject } from '@/lib/actions/projects';

export const instant = false;

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: project }, { data: technologies }, { data: links }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', id).maybeSingle(),
    supabase.from('technologies').select('*').order('category').order('display_order'),
    supabase.from('project_technologies').select('technology_id').eq('project_id', id),
  ]);

  if (!project) notFound();

  // Bound here rather than in the form: the action needs the row id and the
  // slug as it stands now, so a rename can expire the old URL's cache too.
  const action = updateProject.bind(null, project.id, project.slug);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Ubah Project"
        description={project.title}
      />
      <ProjectForm
        action={action}
        technologies={technologies ?? []}
        project={project}
        selectedTechnologyIds={(links ?? []).map((link) => link.technology_id)}
      />
    </div>
  );
}
