import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export type ProjectWithDetails = Tables<'projects'> & {
  technologies: Tables<'technologies'>[];
  images: Tables<'project_images'>[];
};

/**
 * Shape PostgREST returns for the select below: the project row plus the
 * two relations, still nested the way the query asked for them. Both
 * arrays can come back null when a project has no rows on that side.
 */
type ProjectJoinRow = Tables<'projects'> & {
  project_technologies: { technologies: Tables<'technologies'> | null }[] | null;
  project_images: Tables<'project_images'>[] | null;
};

/**
 * Written once and shared: three queries below ask for the same graph, and
 * a select that drifts between them would give the detail page a different
 * project shape than the cards.
 */
const PROJECT_SELECT = `
  *,
  project_technologies (
    technologies (*)
  ),
  project_images (*)
`;

/**
 * Flattens the nested relations into the shape components consume.
 *
 * `technologies` arrives wrapped one level deep because the join table sits
 * between, and a row whose technology was deleted yields null — hence the
 * filter rather than a bare map.
 */
function toProjectWithDetails(row: ProjectJoinRow): ProjectWithDetails {
  const { project_technologies, project_images, ...project } = row;

  return {
    ...project,
    technologies: (project_technologies ?? [])
      .map((link) => link.technologies)
      .filter((tech): tech is Tables<'technologies'> => tech !== null),
    images: [...(project_images ?? [])].sort(
      (a, b) => a.display_order - b.display_order,
    ),
  };
}

export async function getPublishedProjects(): Promise<ProjectWithDetails[]> {
  'use cache';
  cacheLife('max');
  cacheTag('projects');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('start_date', { ascending: false, nullsFirst: false })
    .overrideTypes<ProjectJoinRow[], { merge: false }>();

  if (error) {
    console.error('Error fetching published projects:', error);
    return [];
  }

  return (data ?? []).map(toProjectWithDetails);
}

export async function getFeaturedProjects(): Promise<ProjectWithDetails[]> {
  'use cache';
  cacheLife('max');
  cacheTag('projects');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('published', true)
    .eq('featured', true)
    .order('start_date', { ascending: false, nullsFirst: false })
    .overrideTypes<ProjectJoinRow[], { merge: false }>();

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }

  return (data ?? []).map(toProjectWithDetails);
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectWithDetails | null> {
  'use cache';
  cacheLife('max');
  cacheTag(`project-${slug}`, 'projects');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('slug', slug)
    // Repeated here on purpose: without it a draft project would be
    // reachable by typing its URL directly (PRD 40).
    .eq('published', true)
    .maybeSingle()
    .overrideTypes<ProjectJoinRow, { merge: false }>();

  if (error || !data) {
    if (error) console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }

  return toProjectWithDetails(data);
}

export async function getAllPublishedProjectSlugs(): Promise<string[]> {
  'use cache';
  cacheLife('max');
  cacheTag('projects');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select('slug')
    .eq('published', true);

  if (error || !data) return [];
  return data.map((item) => item.slug);
}
