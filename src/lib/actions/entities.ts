'use server';

import { runCreate, runUpdate, runDelete, runToggle } from './crud-factory';
import { TAGS } from '@/lib/cache/tags';
import {
  experienceSchema,
  certificateSchema,
  technologySchema,
  educationSchema,
  achievementSchema,
  socialLinkSchema,
} from '@/lib/validations/admin';
import type { ActionResult } from './types';

/**
 * Thin per-entity wrappers over the shared CRUD factory.
 *
 * Each exists so a form gets a single-argument action and the cache tag is
 * fixed at definition rather than chosen at the call site, where it could
 * be got wrong.
 */

const text = (formData: FormData, key: string) => formData.get(key) ?? '';
const check = (formData: FormData, key: string) => formData.get(key) ?? undefined;

/* ---------- experiences ---------- */

function experienceValues(formData: FormData) {
  return {
    company: text(formData, 'company'),
    position: text(formData, 'position'),
    location: text(formData, 'location'),
    employment_type: text(formData, 'employment_type'),
    start_date: text(formData, 'start_date'),
    end_date: text(formData, 'end_date'),
    description: text(formData, 'description'),
    company_logo: text(formData, 'company_logo'),
    current: check(formData, 'current'),
    featured: check(formData, 'featured'),
    published: check(formData, 'published'),
  };
}

export async function createExperience(formData: FormData): Promise<ActionResult> {
  return runCreate('experiences', experienceSchema, experienceValues(formData), TAGS.experiences, '/admin/experiences');
}

export async function updateExperience(id: string, formData: FormData): Promise<ActionResult> {
  return runUpdate('experiences', id, experienceSchema, experienceValues(formData), TAGS.experiences, '/admin/experiences');
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  return runDelete('experiences', id, TAGS.experiences, '/admin/experiences');
}

export async function toggleExperiencePublished(id: string, value: boolean): Promise<ActionResult> {
  return runToggle('experiences', id, 'published', value, TAGS.experiences, '/admin/experiences');
}

/* ---------- certificates ---------- */

function certificateValues(formData: FormData) {
  return {
    title: text(formData, 'title'),
    issuer: text(formData, 'issuer'),
    issue_date: text(formData, 'issue_date'),
    credential_id: text(formData, 'credential_id'),
    credential_url: text(formData, 'credential_url'),
    certificate_image: text(formData, 'certificate_image'),
    certificate_file: text(formData, 'certificate_file'),
    description: text(formData, 'description'),
    published: check(formData, 'published'),
  };
}

export async function createCertificate(formData: FormData): Promise<ActionResult> {
  return runCreate('certificates', certificateSchema, certificateValues(formData), TAGS.certificates, '/admin/certificates');
}

export async function updateCertificate(id: string, formData: FormData): Promise<ActionResult> {
  return runUpdate('certificates', id, certificateSchema, certificateValues(formData), TAGS.certificates, '/admin/certificates');
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  return runDelete('certificates', id, TAGS.certificates, '/admin/certificates');
}

export async function toggleCertificatePublished(id: string, value: boolean): Promise<ActionResult> {
  return runToggle('certificates', id, 'published', value, TAGS.certificates, '/admin/certificates');
}

/* ---------- technologies (Skills) ---------- */

function technologyValues(formData: FormData) {
  return {
    name: text(formData, 'name'),
    category: text(formData, 'category') || 'frontend',
    icon: text(formData, 'icon'),
    display_order: formData.get('display_order') ?? 0,
    visible: check(formData, 'visible'),
  };
}

export async function createTechnology(formData: FormData): Promise<ActionResult> {
  return runCreate('technologies', technologySchema, technologyValues(formData), TAGS.technologies, '/admin/skills');
}

export async function updateTechnology(id: string, formData: FormData): Promise<ActionResult> {
  return runUpdate('technologies', id, technologySchema, technologyValues(formData), TAGS.technologies, '/admin/skills');
}

export async function deleteTechnology(id: string): Promise<ActionResult> {
  return runDelete('technologies', id, TAGS.technologies, '/admin/skills');
}

export async function toggleTechnologyVisible(id: string, value: boolean): Promise<ActionResult> {
  return runToggle('technologies', id, 'visible', value, TAGS.technologies, '/admin/skills');
}

/* ---------- education ---------- */

function educationValues(formData: FormData) {
  return {
    institution: text(formData, 'institution'),
    degree: text(formData, 'degree'),
    field: text(formData, 'field'),
    start_date: text(formData, 'start_date'),
    end_date: text(formData, 'end_date'),
    description: text(formData, 'description'),
    logo: text(formData, 'logo'),
    published: check(formData, 'published'),
  };
}

export async function createEducation(formData: FormData): Promise<ActionResult> {
  return runCreate('education', educationSchema, educationValues(formData), TAGS.education, '/admin/education');
}

export async function updateEducation(id: string, formData: FormData): Promise<ActionResult> {
  return runUpdate('education', id, educationSchema, educationValues(formData), TAGS.education, '/admin/education');
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  return runDelete('education', id, TAGS.education, '/admin/education');
}

export async function toggleEducationPublished(id: string, value: boolean): Promise<ActionResult> {
  return runToggle('education', id, 'published', value, TAGS.education, '/admin/education');
}

/* ---------- achievements ---------- */

function achievementValues(formData: FormData) {
  return {
    title: text(formData, 'title'),
    organization: text(formData, 'organization'),
    date: text(formData, 'date'),
    description: text(formData, 'description'),
    image: text(formData, 'image'),
    url: text(formData, 'url'),
    display_order: formData.get('display_order') ?? 0,
    published: check(formData, 'published'),
  };
}

export async function createAchievement(formData: FormData): Promise<ActionResult> {
  return runCreate('achievements', achievementSchema, achievementValues(formData), TAGS.achievements, '/admin/achievements');
}

export async function updateAchievement(id: string, formData: FormData): Promise<ActionResult> {
  return runUpdate('achievements', id, achievementSchema, achievementValues(formData), TAGS.achievements, '/admin/achievements');
}

export async function deleteAchievement(id: string): Promise<ActionResult> {
  return runDelete('achievements', id, TAGS.achievements, '/admin/achievements');
}

export async function toggleAchievementPublished(id: string, value: boolean): Promise<ActionResult> {
  return runToggle('achievements', id, 'published', value, TAGS.achievements, '/admin/achievements');
}

/* ---------- social links ---------- */

function socialLinkValues(formData: FormData) {
  return {
    platform: text(formData, 'platform'),
    url: text(formData, 'url'),
    icon: text(formData, 'icon'),
    display_order: formData.get('display_order') ?? 0,
    visible: check(formData, 'visible'),
  };
}

export async function createSocialLink(formData: FormData): Promise<ActionResult> {
  return runCreate('social_links', socialLinkSchema, socialLinkValues(formData), TAGS.socialLinks, '/admin/social-links');
}

export async function updateSocialLink(id: string, formData: FormData): Promise<ActionResult> {
  return runUpdate('social_links', id, socialLinkSchema, socialLinkValues(formData), TAGS.socialLinks, '/admin/social-links');
}

export async function deleteSocialLink(id: string): Promise<ActionResult> {
  return runDelete('social_links', id, TAGS.socialLinks, '/admin/social-links');
}

export async function toggleSocialLinkVisible(id: string, value: boolean): Promise<ActionResult> {
  return runToggle('social_links', id, 'visible', value, TAGS.socialLinks, '/admin/social-links');
}
