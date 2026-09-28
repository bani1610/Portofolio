/**
 * What every admin Server Action returns.
 *
 * `fieldErrors` is keyed the same way zod's flatten() produces it, so a
 * form can map a failure straight onto its inputs instead of showing one
 * generic message at the top.
 */
export type ActionResult = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const ok = (message?: string): ActionResult => ({ success: true, message });

export const fail = (
  message: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult => ({ success: false, message, fieldErrors });

/**
 * Turns a Postgres error into something an admin can act on.
 *
 * The raw message leaks schema detail and reads as a crash; these two codes
 * are the ones a content form actually hits.
 */
export function describeDbError(
  error: { code?: string; message: string },
  context: string,
): string {
  if (error.code === '23505') {
    return 'Data dengan nilai unik yang sama sudah ada. Periksa kembali slug atau nama.';
  }
  if (error.code === '23503') {
    return 'Data ini masih terhubung dengan data lain, jadi tidak bisa dihapus.';
  }
  console.error(`${context}:`, error);
  return 'Terjadi kesalahan pada server. Silakan coba lagi.';
}
