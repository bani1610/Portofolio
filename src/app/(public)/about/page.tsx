import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { AboutSection } from '@/components/public/about-section';
import { getProfile, getPublishedEducation } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'About · Sholahuddin Robbani',
  description:
    'Latar belakang, fokus keahlian, dan cara saya bekerja sebagai Web Developer.',
};

export default async function AboutPage() {
  const [profile, education] = await Promise.all([
    getProfile(),
    getPublishedEducation(),
  ]);

  return (
    <div className="py-12 md:py-16">
      <Container>
        <SectionHeader
          as="h1"
          index="ABT"
          label="ABOUT"
          title="Tentang Saya"
          description="Ringkas tentang latar belakang, cara saya bekerja, dan hal yang saya utamakan dalam membangun aplikasi web."
          className="mb-8"
        />

        <AboutSection profile={profile} education={education} showHeader={false} />
      </Container>
    </div>
  );
}
