import Link from 'next/link';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { ProjectCard } from './project-card';
import { Button } from '@/components/ui/button';
import type { ProjectWithDetails } from '@/lib/queries/projects';

type FeaturedProjectsSectionProps = {
  projects: ProjectWithDetails[];
  /** Homepage shows a teaser; a dedicated page passes no limit. */
  limit?: number;
};

export function FeaturedProjectsSection({
  projects,
  limit,
}: FeaturedProjectsSectionProps) {
  const visible = limit ? projects.slice(0, limit) : projects;

  return (
    <Section id="projects" spacing="loose">
      <div className="flex flex-col justify-between sm:flex-row sm:items-end">
        <SectionHeader
          index="02"
          label="PROJECTS"
          title="Featured Work"
          description="Koleksi proyek pilihan yang menunjukkan penerapan solusi teknis dan pengembangan web."
          className="mb-6 sm:mb-8"
        />

        <div className="hidden sm:block mb-8">
          <Button asChild variant="ghost" className="gap-1.5 font-medium">
            <Link href="/projects">
              <span>Semua project</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {visible.length > 0 ? (
        <Reveal
          stagger="cards"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Reveal>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <FolderKanban
            className="text-muted-foreground/60 mb-3 h-10 w-10"
            aria-hidden="true"
          />
          <h3 className="text-foreground text-base font-semibold">
            Belum ada project yang ditampilkan
          </h3>
          <p className="text-muted-foreground mt-1 max-w-[42ch] text-sm">
            Sementara ini, keahlian teknis dan pengalaman saya bisa dilihat di
            bagian lain halaman ini.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/#skills">Lihat keahlian teknis</Link>
          </Button>
        </div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Button asChild variant="outline" className="w-full gap-2">
          <Link href="/projects">
            <span>Lihat Semua Project</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
