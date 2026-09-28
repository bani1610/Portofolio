import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export async function getPublishedEducation(): Promise<Tables<'education'>[]> {
  'use cache';
  cacheLife('max');
  cacheTag('education');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('published', true)
    .order('start_date', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching education:', error);
    return [];
  }

  return data || [];
}
