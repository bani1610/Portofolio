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
    // Hover moves the cover, never the card (DESIGN.md §7.3): a card that
    // shifts under the pointer is what makes a grid feel restless.
    <Card className="group border-border bg-card hover:border-primary/40 hover:bg-muted relative flex flex-col overflow-hidden rounded-lg border transition-colors">
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          // Initials rather than a broken-image icon (DESIGN.md §7.3):
          // a missing cover is ordinary, not a failure.
          <div className="bg-muted/60 text-muted-foreground flex h-full w-full items-center justify-center font-mono text-2xl font-semibold">
            {project.title.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant="secondary"
            className="bg-background/80 font-mono text-[11px] tracking-wider uppercase backdrop-blur-md"
          >
            {project.category}
          </Badge>
          {project.featured && (
            <Badge
              variant="default"
              className="font-mono text-[11px] tracking-wider uppercase"
            >
              Featured
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-foreground group-hover:text-primary text-lg font-semibold tracking-[-0.01em] transition-colors md:text-xl">
          {/* The whole card is the link (DESIGN.md §7.3). Stretching this
              one anchor keeps a single tab stop and one accessible name,
              which wrapping the card in <a> would not. */}
          <Link
            href={`/projects/${project.slug}`}
            className="line-clamp-1 before:absolute before:inset-0 before:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        {project.short_description && (
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {project.short_description}
          </p>
        )}

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <TechChip key={tech.id} name={tech.name} />
            ))}
            {project.technologies.length > 4 && (
              <span className="text-muted-foreground self-center font-mono text-[11px]">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="border-border/60 mt-auto flex items-center justify-between border-t pt-5">
          <span className="text-foreground inline-flex items-center gap-1.5 text-xs font-medium">
            <span>Detail</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>

          {/* Raised above the stretched link so these stay clickable and
              keep their own tab stops. */}
          <div className="relative z-10 flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub source for ${project.title}`}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <GithubIcon className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Live demo for ${project.title}`}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
