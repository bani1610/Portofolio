'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { invalidate } from '@/lib/cache/revalidate';
import { TAGS } from '@/lib/cache/tags';
import { profileSchema, siteSettingsSchema } from '@/lib/validations/admin';
import { ok, fail, describeDbError, type ActionResult } from './types';

/**
 * Profile and site_settings are single-row tables (PRD 24), so the form
 * cannot know whether a row exists yet. Both actions upsert on the id the
 * page hands them, which covers first save and every later edit with one
 * path.
 */

export async function saveProfile(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const parsed = profileSchema.safeParse({
    name: formData.get('name') ?? '',
    headline: formData.get('headline') ?? '',
    bio: formData.get('bio') ?? '',
    profile_image: formData.get('profile_image') ?? '',
    location: formData.get('location') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? '',
    resume_url: formData.get('resume_url') ?? '',
  });

  if (!parsed.success) {
    return fail(
      'Periksa kembali isian form.',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  const { error } = id
    ? await supabase.from('profiles').update(parsed.data).eq('id', id)
    : await supabase.from('profiles').insert(parsed.data);

  if (error) return fail(describeDbError(error, 'saveProfile'));

  // The hero, about and footer all read the profile, and the navbar's CV
  // button comes from resume_url.
  invalidate(TAGS.profile);
  return ok('Profil tersimpan.');
}

export async function saveSiteSettings(
  id: string | null,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const parsed = siteSettingsSchema.safeParse({
    site_title: formData.get('site_title') ?? '',
    site_description: formData.get('site_description') ?? '',
    og_image: formData.get('og_image') ?? '',
    resume_url: formData.get('resume_url') ?? '',
  });

  if (!parsed.success) {
    return fail(
      'Periksa kembali isian form.',
      parsed.error.flatten().fieldErrors as Record<string, string[]>,
    );
  }

  const { error } = id
    ? await supabase.from('site_settings').update(parsed.data).eq('id', id)
    : await supabase.from('site_settings').insert(parsed.data);

  if (error) return fail(describeDbError(error, 'saveSiteSettings'));

  invalidate(TAGS.siteSettings);
  return ok('Pengaturan tersimpan.');
}

/* ---------- contact messages ---------- */

/**
 * Messages are received, never authored here, so there is no create or
 * update form: only mark-as-read and delete (PRD 24).
 *
 * No cache tag: nothing public reads this table, and RLS forbids the
 * public from selecting it at all.
 */
export async function markMessageRead(
  id: string,
  read: boolean,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('contact_messages').update({ read }).eq('id', id);
  if (error) return fail(describeDbError(error, 'markMessageRead'));

  // No cache tag here (nothing public reads messages), but the admin list
  // still has to re-render to show the new state.
  revalidatePath('/admin/messages');
  return ok(read ? 'Ditandai sudah dibaca.' : 'Ditandai belum dibaca.');
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) return fail(describeDbError(error, 'deleteMessage'));

  revalidatePath('/admin/messages');
  return ok('Pesan dihapus.');
}
