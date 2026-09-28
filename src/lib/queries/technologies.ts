import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export async function getVisibleTechnologies(): Promise<Tables<'technologies'>[]> {
  'use cache';
  cacheLife('max');
  cacheTag('technologies');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching visible technologies:', error);
    return [];
  }

  return data || [];
}

export async function getAllTechnologies(): Promise<Tables<'technologies'>[]> {
  'use cache';
  cacheLife('max');
  cacheTag('technologies');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all technologies:', error);
    return [];
  }

  return data || [];
}
