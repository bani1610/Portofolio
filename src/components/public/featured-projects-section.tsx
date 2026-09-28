import Link from 'next/link';
import { ArrowRight, FolderKanban } from 'lucide-react';
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
    <Section id="projects" className="border-t border-border/40">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <FolderKanban className="h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-semibold text-foreground">Project sedang disiapkan</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-[42ch]">
            Konten project baru saja di-seed sebagai draft di database dan siap untuk di-publish melalui dashboard admin.
          </p>
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
