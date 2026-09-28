import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export type ProjectWithDetails = Tables<'projects'> & {
  technologies: Tables<'technologies'>[];
  images: Tables<'project_images'>[];
};

export async function getPublishedProjects(): Promise<ProjectWithDetails[]> {
  'use cache';
  cacheLife('max');
  cacheTag('projects');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_technologies (
        technologies (*)
      ),
      project_images (*)
    `)
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('start_date', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching published projects:', error);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    technologies: (p.project_technologies || [])
      .map((pt: any) => pt.technologies)
      .filter(Boolean),
    images: (p.project_images || []).sort(
      (a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0)
    ),
  }));
}

export async function getFeaturedProjects(): Promise<ProjectWithDetails[]> {
  'use cache';
  cacheLife('max');
  cacheTag('projects');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_technologies (
        technologies (*)
      ),
      project_images (*)
    `)
    .eq('published', true)
    .eq('featured', true)
    .order('start_date', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }

  return (data || []).map((p: any) => ({
    ...p,
    technologies: (p.project_technologies || [])
      .map((pt: any) => pt.technologies)
      .filter(Boolean),
    images: (p.project_images || []).sort(
      (a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0)
    ),
  }));
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithDetails | null> {
  'use cache';
  cacheLife('max');
  cacheTag(`project-${slug}`, 'projects');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_technologies (
        technologies (*)
      ),
      project_images (*)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }

  const p = data as any;
  return {
    ...p,
    technologies: (p.project_technologies || [])
      .map((pt: any) => pt.technologies)
      .filter(Boolean),
    images: (p.project_images || []).sort(
      (a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0)
    ),
  };
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
