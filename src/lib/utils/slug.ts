/**
 * Derives a URL slug from a title (admin project form, IMPLEMENTATION Fase 7).
 *
 * The result is a suggestion the admin can edit, not a guarantee of
 * uniqueness — that is enforced by the unique constraint on
 * `projects.slug`.
 */
export function slugify(input: string): string {
  return (
    input
      .normalize('NFKD')
      // Strip combining marks so "é" becomes "e" rather than being dropped.
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}
