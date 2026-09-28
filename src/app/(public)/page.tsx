import {
  getProfile,
  getFeaturedProjects,
  getPublishedProjects,
  getPublishedExperiences,
  getVisibleTechnologies,
  getPublishedCertificates,
  getPublishedEducation,
  getPublishedAchievements,
  getVisibleSocialLinks,
} from '@/lib/queries';
import { HeroSection } from '@/components/public/hero-section';
import { AboutSection } from '@/components/public/about-section';
import { FeaturedProjectsSection } from '@/components/public/featured-projects-section';
import { ExperienceSection } from '@/components/public/experience-section';
import { SkillsSection } from '@/components/public/skills-section';
import { CertificatesSection } from '@/components/public/certificates-section';
import { EducationSection } from '@/components/public/education-section';
import { AchievementsSection } from '@/components/public/achievements-section';
import { ContactSection } from '@/components/public/contact-section';
import { Reveal } from '@/components/shared/reveal';

export default async function HomePage() {
  const [
    profile,
    featuredProjects,
    publishedProjects,
    experiences,
    technologies,
    certificates,
    education,
    achievements,
    socialLinks,
  ] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getPublishedProjects(),
    getPublishedExperiences(),
    getVisibleTechnologies(),
    getPublishedCertificates(),
    getPublishedEducation(),
    getPublishedAchievements(),
    getVisibleSocialLinks(),
  ]);

  // If featured projects are fewer than 3, fill with published projects
  const displayProjects =
    featuredProjects.length > 0
      ? featuredProjects
      : publishedProjects;

  return (
    <>
      {/* The hero is deliberately not wrapped in Reveal: it holds the LCP
          element and must be readable in the first frame (DESIGN.md 9). */}
      <HeroSection profile={profile} socialLinks={socialLinks} />

      {/* Only the sections without their own internal stagger are wrapped
          here. Projects, Experience, Skills, Certificates and Achievements
          reveal their own items, and nesting a second observer around them
          would delay the inner one behind the outer fade. */}
      <Reveal>
        <AboutSection profile={profile} education={education} />
      </Reveal>

      <FeaturedProjectsSection projects={displayProjects} limit={3} />
      <ExperienceSection experiences={experiences} limit={3} />
      <SkillsSection technologies={technologies} />
      <CertificatesSection certificates={certificates} limit={3} />

      <Reveal>
        <EducationSection education={education} />
      </Reveal>

      {/* Renders itself only from two items up (PRD 16). */}
      <AchievementsSection achievements={achievements} />

      <Reveal>
        <ContactSection profile={profile} />
      </Reveal>
    </>
  );
}
