import { cacheLife, cacheTag } from 'next/cache';
import { createPublicClient } from '../supabase/public';
import type { Tables } from '../supabase/types';

export async function getPublishedCertificates(): Promise<Tables<'certificates'>[]> {
  'use cache';
  cacheLife('max');
  cacheTag('certificates');

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('published', true)
    .order('issue_date', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }

  return data || [];
}
