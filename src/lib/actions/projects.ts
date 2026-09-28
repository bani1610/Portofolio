'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { projectSchema } from '@/lib/validations/admin';
import { invalidateProject } from '@/lib/cache/revalidate';
import { ok, fail, describeDbError, type ActionResult } from './types';

/**
 * Reads the project form out of FormData.
 *
 * `features` and `technology_ids` are repeated fields rather than single
 * values, so they need getAll(); everything else is a plain get().
 */
function parseProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get('title') ?? '',
    slug: formData.get('slug') ?? '',
    short_description: formData.get('short_description') ?? '',
    description: formData.get('description') ?? '',
    category: formData.get('category') ?? 'web',
    role: formData.get('role') ?? '',
    team: formData.get('team') ?? '',
    features: formData
      .getAll('features')
      .map((value) => String(value).trim())
      .filter(Boolean),
    challenges: formData.get('challenges') ?? '',
    solutions: formData.get('solutions') ?? '',
    results: formData.get('results') ?? '',
    start_date: formData.get('start_date') ?? '',
    end_date: formData.get('end_date') ?? '',
    github_url: formData.get('github_url') ?? '',
    demo_url: formData.get('demo_url') ?? '',
    cover_image: formData.get('cover_image') ?? '',
    featured: formData.get('featured') ?? undefined,
    published: formData.get('published') ?? undefined,
    technology_ids: formData.getAll('technology_ids').map(String),
  });
}

/**
 * Rewrites a project's technology tags.
 *
 * Delete-then-insert rather than diffing: the join table holds no data of
 * its own beyond the pair, so there is nothing to preserve, and a diff
 * would be more code for the same result.
 */
async function syncTechnologies(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  projectId: string,
  technologyIds: string[],
) {
  await supabase.from('project_technologies').delete().eq('project_id', projectId);

  if (technologyIds.length === 0) return;

  await supabase.from('project_technologies').insert(
    technologyIds.map((technology_id) => ({
      project_id: projectId,
      technology_id,
    })),
  );
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return fail(
      'Periksa kembali isian form.',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  const { technology_ids, ...project } = parsed.data;

  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select('id, slug')
    .single();

  if (error || !data) {
    return fail(describeDbError(error ?? { message: 'insert returned no row' }, 'createProject'));
  }

  await syncTechnologies(supabase, data.id, technology_ids);
  invalidateProject(data.slug);

  redirect('/admin/projects');
}

export async function updateProject(
  id: string,
  previousSlug: string,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return fail(
      'Periksa kembali isian form.',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  const { technology_ids, ...project } = parsed.data;

  const { error } = await supabase.from('projects').update(project).eq('id', id);

  if (error) return fail(describeDbError(error, 'updateProject'));

  await syncTechnologies(supabase, id, technology_ids);

  // Both slugs: after a rename the old detail URL still holds a cached
  // page, and leaving it would serve the project at two addresses.
  invalidateProject(project.slug, previousSlug);

  redirect('/admin/projects');
}

export async function deleteProject(id: string, slug: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return fail(describeDbError(error, 'deleteProject'));

  // project_technologies and project_images go with it via ON DELETE
  // CASCADE (PRD 24).
  invalidateProject(slug);
  // Re-renders the admin list; invalidateProject only expires the public
  // cache, so without this the deleted row stays on screen.
  revalidatePath('/admin/projects');
  return ok('Project dihapus.');
}

/** Publish toggle from the list, so a row can go live without opening the form. */
export async function toggleProjectPublished(
  id: string,
  slug: string,
  published: boolean,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('projects').update({ published }).eq('id', id);
  if (error) return fail(describeDbError(error, 'toggleProjectPublished'));

  invalidateProject(slug);
  revalidatePath('/admin/projects');
  return ok(published ? 'Project ditayangkan.' : 'Project disembunyikan.');
}

export async function toggleProjectFeatured(
  id: string,
  slug: string,
  featured: boolean,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('projects').update({ featured }).eq('id', id);
  if (error) return fail(describeDbError(error, 'toggleProjectFeatured'));

  invalidateProject(slug);
  revalidatePath('/admin/projects');
  return ok(featured ? 'Ditandai sebagai unggulan.' : 'Tanda unggulan dilepas.');
}
