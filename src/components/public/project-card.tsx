import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/shared/icons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TechChip } from './tech-chip';
import type { ProjectWithDetails } from '@/lib/queries/projects';

type ProjectCardProps = {
  project: ProjectWithDetails;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-foreground/20">
      {/* Cover Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/60 text-muted-foreground font-mono text-xs">
            No cover preview
          </div>
        )}

        {/* Category & Featured Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="font-mono text-[11px] uppercase tracking-wider backdrop-blur-md bg-background/80">
            {project.category}
          </Badge>
          {project.featured && (
            <Badge variant="default" className="font-mono text-[11px] uppercase tracking-wider">
              Featured
            </Badge>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/projects/${project.slug}`} className="focus:outline-none">
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground transition-colors group-hover:text-primary md:text-xl line-clamp-1">
            {project.title}
          </h3>
        </Link>

        {project.short_description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.short_description}
          </p>
        )}

        {/* Tech Chips */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <TechChip key={tech.id} name={tech.name} />
            ))}
            {project.technologies.length > 4 && (
              <span className="font-mono text-[11px] text-muted-foreground self-center">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Footer links */}
        <div className="mt-auto pt-5 flex items-center justify-between border-t border-border/60">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground transition-colors hover:text-primary focus:outline-none"
          >
            <span>Detail</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub source for ${project.title}`}
                className="text-muted-foreground transition-colors hover:text-foreground p-1"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo for ${project.title}`}
                className="text-muted-foreground transition-colors hover:text-foreground p-1"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
