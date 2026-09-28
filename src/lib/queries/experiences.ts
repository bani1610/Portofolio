import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export async function getPublishedExperiences(): Promise<Tables<'experiences'>[]> {
  'use cache';
  cacheLife('max');
  cacheTag('experiences');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('published', true)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }

  return data || [];
}
