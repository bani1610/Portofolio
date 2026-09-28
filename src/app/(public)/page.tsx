import {
  getProfile,
  getFeaturedProjects,
  getPublishedProjects,
  getPublishedExperiences,
  getVisibleTechnologies,
  getPublishedCertificates,
  getPublishedEducation,
  getVisibleSocialLinks,
} from '@/lib/queries';
import { HeroSection } from '@/components/public/hero-section';
import { AboutSection } from '@/components/public/about-section';
import { FeaturedProjectsSection } from '@/components/public/featured-projects-section';
import { ExperienceSection } from '@/components/public/experience-section';
import { SkillsSection } from '@/components/public/skills-section';
import { CertificatesSection } from '@/components/public/certificates-section';
import { EducationSection } from '@/components/public/education-section';
import { ContactSection } from '@/components/public/contact-section';

export default async function HomePage() {
  const [
    profile,
    featuredProjects,
    publishedProjects,
    experiences,
    technologies,
    certificates,
    education,
    socialLinks,
  ] = await Promise.all([
    getProfile(),
    getFeaturedProjects(),
    getPublishedProjects(),
    getPublishedExperiences(),
    getVisibleTechnologies(),
    getPublishedCertificates(),
    getPublishedEducation(),
    getVisibleSocialLinks(),
  ]);

  // If featured projects are fewer than 3, fill with published projects
  const displayProjects =
    featuredProjects.length > 0
      ? featuredProjects
      : publishedProjects;

  return (
    <>
      <HeroSection profile={profile} socialLinks={socialLinks} />
      <AboutSection profile={profile} education={education} />
      <FeaturedProjectsSection projects={displayProjects} />
      <ExperienceSection experiences={experiences} />
      <SkillsSection technologies={technologies} />
      <CertificatesSection certificates={certificates} />
      <EducationSection education={education} />
      <ContactSection profile={profile} />
    </>
  );
}
