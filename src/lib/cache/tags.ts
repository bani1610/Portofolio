/**
 * Cache tags, defined once (IMPLEMENTATION.md section 6).
 *
 * The listed risk is "forgetting to invalidate", which breaks PRD 40: an
 * edit in admin has to show on the public site without a redeploy. Writing
 * tag strings ad-hoc in each action is how that happens, because a typo
 * fails silently. Queries and actions both import from here, so a tag that
 * does not exist is a type error.
 */
export const TAGS = {
  projects: 'projects',
  profile: 'profile',
  technologies: 'technologies',
  experiences: 'experiences',
  certificates: 'certificates',
  education: 'education',
  achievements: 'achievements',
  socialLinks: 'social_links',
  siteSettings: 'site_settings',
} as const;

export type CacheTag = (typeof TAGS)[keyof typeof TAGS];

/** Per-project tag, so editing one project does not expire the whole list. */
export function projectTag(slug: string): string {
  return `project-${slug}`;
}
