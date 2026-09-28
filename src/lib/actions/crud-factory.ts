import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { z } from 'zod';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { invalidate } from '@/lib/cache/revalidate';
import type { CacheTag } from '@/lib/cache/tags';
import { ok, fail, describeDbError, type ActionResult } from './types';

/**
 * The create/update/delete/toggle shape that nine of the eleven entities
 * share (IMPLEMENTATION.md Fase 7 step 4).
 *
 * Deliberately NOT a 'use server' module. That directive turns every
 * export into an endpoint the browser can call, and the first argument
 * here is a table name: exposing these would let any signed-in admin write
 * to any table with a payload that skipped the per-entity schema. The
 * action surface is entities.ts, which pins table and schema together.
 *
 * Projects keeps its own actions because it writes a join table as well.
 * Everything else differs only in table name, schema, and cache tag, so
 * writing nine near-identical files would mean nine places for an
 * invalidation to be forgotten.
 *
 * Not generic over the Database type: Supabase's generated table unions do
 * not narrow through a type parameter, and the alternative is a cast at
 * every call site instead of one here.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type Table = string;

export async function runCreate(
  table: Table,
  schema: z.ZodType<any, any>,
  values: unknown,
  tag: CacheTag,
  redirectTo: string,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return fail('Periksa kembali isian form.', parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { error } = await (supabase.from(table as any) as any).insert(parsed.data);
  if (error) return fail(describeDbError(error, `create:${table}`));

  invalidate(tag);
  redirect(redirectTo);
}

export async function runUpdate(
  table: Table,
  id: string,
  schema: z.ZodType<any, any>,
  values: unknown,
  tag: CacheTag,
  redirectTo: string,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    return fail('Periksa kembali isian form.', parsed.error.flatten().fieldErrors as Record<string, string[]>);
  }

  const { error } = await (supabase.from(table as any) as any)
    .update(parsed.data)
    .eq('id', id);
  if (error) return fail(describeDbError(error, `update:${table}`));

  invalidate(tag);
  redirect(redirectTo);
}

export async function runDelete(
  table: Table,
  id: string,
  tag: CacheTag,
  listPath: string,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await (supabase.from(table as any) as any).delete().eq('id', id);
  if (error) return fail(describeDbError(error, `delete:${table}`));

  invalidate(tag);
  // updateTag expires the public cache; this is what re-renders the admin
  // list the user is still looking at. Without it the deleted row stays on
  // screen until a manual reload, which reads as the delete having failed.
  revalidatePath(listPath);
  return ok('Data dihapus.');
}

export async function runToggle(
  table: Table,
  id: string,
  column: 'published' | 'visible' | 'featured',
  value: boolean,
  tag: CacheTag,
  listPath: string,
): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error } = await (supabase.from(table as any) as any)
    .update({ [column]: value })
    .eq('id', id);
  if (error) return fail(describeDbError(error, `toggle:${table}`));

  invalidate(tag);
  revalidatePath(listPath);
  return ok(value ? 'Ditayangkan.' : 'Disembunyikan.');
}
