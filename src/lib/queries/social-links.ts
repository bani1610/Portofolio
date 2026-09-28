import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export async function getVisibleSocialLinks(): Promise<Tables<'social_links'>[]> {
  'use cache';
  cacheLife('max');
  cacheTag('social_links');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('visible', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching social links:', error);
    return [];
  }

  return data || [];
}
