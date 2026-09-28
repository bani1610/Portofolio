import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { ExperienceSection } from '@/components/public/experience-section';
import { getPublishedExperiences } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Experience — Sholahuddin Robbani',
  description:
    'Riwayat perjalanan karier, pengalaman kerja, magang, dan proyek rekayasa perangkat lunak.',
};

export default async function ExperiencePage() {
  const experiences = await getPublishedExperiences();

  return (
    <div className="py-12 md:py-16">
      <Container>
        <SectionHeader
          index="EXP"
          label="CAREER"
          title="Pengalaman Kerja"
          description="Rekam jejak pengalaman profesional, kontribusi teknis, dan tanggung jawab rekayasa perangkat lunak yang pernah saya emban."
          className="mb-8"
        />

        <ExperienceSection experiences={experiences} showAllLink={false} />
      </Container>
    </div>
  );
}
