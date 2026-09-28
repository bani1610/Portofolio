import { z } from 'zod';
import {
  optionalText,
  optionalUrl,
  optionalDate,
  requiredDate,
  displayOrder,
  flag,
} from './shared';

/**
 * One schema per entity, shared by the client form and the Server Action
 * (IMPLEMENTATION.md Fase 2 step 4). Validating in both places from one
 * definition is what keeps the two from drifting: the form gives fast
 * feedback, the action is the one that actually guards the database.
 */

export const projectSchema = z.object({
  title: z.string().trim().min(2, { message: 'Judul minimal 2 karakter' }).max(120),
  slug: z
    .string()
    .trim()
    .min(2, { message: 'Slug minimal 2 karakter' })
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung',
    }),
  short_description: optionalText,
  description: optionalText,
  category: z.enum(['web', 'ai', 'data', 'other']),
  role: optionalText,
  team: optionalText,
  // Rendered as a checked list (PRD 24), so each entry is its own row.
  features: z.array(z.string().trim().min(1)).default([]),
  challenges: optionalText,
  solutions: optionalText,
  results: optionalText,
  start_date: optionalDate,
  end_date: optionalDate,
  github_url: optionalUrl,
  demo_url: optionalUrl,
  cover_image: optionalText,
  featured: flag,
  published: flag,
  technology_ids: z.array(z.uuid()).default([]),
});

export const experienceSchema = z.object({
  company: z.string().trim().min(2, { message: 'Nama perusahaan minimal 2 karakter' }).max(120),
  position: z.string().trim().min(2, { message: 'Posisi minimal 2 karakter' }).max(120),
  location: optionalText,
  employment_type: optionalText,
  start_date: requiredDate,
  end_date: optionalDate,
  description: optionalText,
  company_logo: optionalText,
  current: flag,
  featured: flag,
  published: flag,
});

export const certificateSchema = z.object({
  title: z.string().trim().min(2, { message: 'Judul minimal 2 karakter' }).max(160),
  issuer: z.string().trim().min(2, { message: 'Penerbit minimal 2 karakter' }).max(120),
  issue_date: optionalDate,
  credential_id: optionalText,
  credential_url: optionalUrl,
  certificate_image: optionalText,
  certificate_file: optionalText,
  description: optionalText,
  published: flag,
});

export const technologySchema = z.object({
  name: z.string().trim().min(1, { message: 'Nama wajib diisi' }).max(60),
  category: z.enum(['frontend', 'backend', 'database', 'tools']),
  icon: optionalText,
  display_order: displayOrder,
  visible: flag,
});

export const educationSchema = z.object({
  institution: z.string().trim().min(2, { message: 'Nama institusi minimal 2 karakter' }).max(160),
  degree: optionalText,
  field: optionalText,
  start_date: optionalDate,
  end_date: optionalDate,
  description: optionalText,
  logo: optionalText,
  published: flag,
});

export const achievementSchema = z.object({
  title: z.string().trim().min(2, { message: 'Judul minimal 2 karakter' }).max(160),
  organization: optionalText,
  date: optionalDate,
  description: optionalText,
  image: optionalText,
  url: optionalUrl,
  display_order: displayOrder,
  published: flag,
});

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1, { message: 'Platform wajib diisi' }).max(60),
  url: z.url({ message: 'URL tidak valid' }),
  icon: optionalText,
  display_order: displayOrder,
  visible: flag,
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, { message: 'Nama minimal 2 karakter' }).max(120),
  headline: optionalText,
  bio: optionalText,
  profile_image: optionalText,
  location: optionalText,
  email: z
    .union([z.literal(''), z.email({ message: 'Alamat email tidak valid' })])
    .transform((value) => (value === '' ? null : value))
    .nullable(),
  phone: optionalText,
  resume_url: optionalText,
});

export const siteSettingsSchema = z.object({
  site_title: optionalText,
  site_description: optionalText,
  og_image: optionalText,
  resume_url: optionalText,
});

export type ProjectInput = z.input<typeof projectSchema>;
export type ExperienceInput = z.input<typeof experienceSchema>;
export type CertificateInput = z.input<typeof certificateSchema>;
export type TechnologyInput = z.input<typeof technologySchema>;
export type EducationInput = z.input<typeof educationSchema>;
export type AchievementInput = z.input<typeof achievementSchema>;
export type SocialLinkInput = z.input<typeof socialLinkSchema>;
export type ProfileInput = z.input<typeof profileSchema>;
export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;
