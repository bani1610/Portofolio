import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export async function getProfile(): Promise<Tables<'profiles'> | null> {
  'use cache';
  cacheLife('max');
  cacheTag('profile');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}
