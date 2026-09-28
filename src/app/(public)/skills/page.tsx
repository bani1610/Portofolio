import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { SkillsSection } from '@/components/public/skills-section';
import { getVisibleTechnologies } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Skills — Sholahuddin Robbani',
  description:
    'Daftar teknologi, bahasa pemrograman, framework, dan tools yang saya kuasai.',
};

export default async function SkillsPage() {
  const technologies = await getVisibleTechnologies();

  return (
    <div className="py-12 md:py-16">
      <Container>
        <SectionHeader
          index="SKL"
          label="EXPERTISE"
          title="Keahlian & Perkakas Teknis"
          description="Daftar keahlian teknis yang mencakup frontend, backend, sistem basis data, dan tooling pengembang modern."
          className="mb-8"
        />

        <SkillsSection technologies={technologies} />
      </Container>
    </div>
  );
}
