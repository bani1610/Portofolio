import { updateTag } from 'next/cache';
import { TAGS, projectTag, type CacheTag } from './tags';

/**
 * Expires the cache after an admin write.
 *
 * `updateTag`, not `revalidateTag`: the admin must see their own edit
 * immediately. Stale-while-revalidate would serve the old content on the
 * next request, which reads as the save having failed
 * (IMPLEMENTATION.md section 2).
 *
 * Callable only from a Server Action, which is where every mutation here
 * lives.
 */
export function invalidate(...tags: CacheTag[]): void {
  for (const tag of tags) updateTag(tag);
}

/**
 * A project write touches two tags: its own detail page and every list it
 * appears in. Both slugs are passed when a slug changes, so the old URL's
 * cache does not outlive the rename.
 */
export function invalidateProject(...slugs: string[]): void {
  updateTag(TAGS.projects);
  for (const slug of slugs) {
    if (slug) updateTag(projectTag(slug));
  }
}
