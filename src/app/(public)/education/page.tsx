import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { EducationSection } from '@/components/public/education-section';
import { getPublishedEducation } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Education · Sholahuddin Robbani',
  description:
    'Riwayat pendidikan formal yang menjadi landasan kompetensi teknis saya.',
};

export default async function EducationPage() {
  const education = await getPublishedEducation();

  return (
    <div className="py-12 md:py-16">
      <Container>
        <SectionHeader
          as="h1"
          index="EDU"
          label="EDUCATION"
          title="Riwayat Pendidikan"
          description="Pendidikan formal yang membentuk fondasi ilmu komputer dan cara berpikir analitis saya."
          className="mb-8"
        />

        <EducationSection education={education} showHeader={false} />
      </Container>
    </div>
  );
}
