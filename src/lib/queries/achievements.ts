import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export async function getPublishedAchievements(): Promise<Tables<'achievements'>[]> {
  'use cache';
  cacheLife('max');
  cacheTag('achievements');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('date', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }

  return data || [];
}
