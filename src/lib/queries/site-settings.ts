import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export async function getSiteSettings(): Promise<Tables<'site_settings'> | null> {
  'use cache';
  cacheLife('max');
  cacheTag('site_settings');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }

  return data;
}
