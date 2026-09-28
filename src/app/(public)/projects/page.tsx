import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { ProjectsFilter } from '@/components/public/projects-filter';
import { getPublishedProjects } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Projects — Sholahuddin Robbani',
  description:
    'Koleksi proyek perangkat lunak, sistem web, dan aplikasi yang pernah saya rancang dan kembangkan.',
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container>
        <SectionHeader
          index="PROJ"
          label="PORTFOLIO"
          title="Semua Project"
          description="Eksplorasi portofolio lengkap dari aplikasi produksi, eksperimen kecerdasan buatan, hingga tools pengembang."
          className="mb-10"
        />

        <ProjectsFilter initialProjects={projects} />
      </Container>
    </div>
  );
}
