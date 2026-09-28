import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GithubIcon } from '@/components/shared/icons';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TechChip } from '@/components/public/tech-chip';
import {
  getProjectBySlug,
  getPublishedProjects,
  getAllPublishedProjectSlugs,
} from '@/lib/queries';
import { formatDateRange } from '@/lib/utils/date';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllPublishedProjectSlugs();
  if (slugs.length === 0) {
    // Next.js 16 Cache Components requires at least one param for build validation
    return [{ slug: '_placeholder' }];
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === '_placeholder') {
    return { title: 'Project · Sholahuddin Robbani' };
  }
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} · Sholahuddin Robbani`,
    description:
      project.short_description ||
      `Detail pengerjaan dan teknologi yang digunakan pada proyek ${project.title}.`,
    openGraph: {
      title: `${project.title} · Sholahuddin Robbani`,
      description: project.short_description || undefined,
      images: project.cover_image ? [{ url: project.cover_image }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getPublishedProjects(),
  ]);

  if (!project) {
    notFound();
  }

  // Find previous and next projects
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const dateRange = formatDateRange(project.start_date, project.end_date, false);

  return (
    <article className="py-12 md:py-16">
      {/* Header & Meta Section — 768px Container */}
      <Container width="prose">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke semua project</span>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary" className="font-mono text-xs uppercase tracking-wider">
            {project.category}
          </Badge>
          {project.featured && (
            <Badge variant="default" className="font-mono text-xs uppercase tracking-wider">
              Featured
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          {project.title}
        </h1>

        {project.short_description && (
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {project.short_description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          {project.demo_url && (
            <Button asChild size="default" className="gap-2">
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Kunjungi Demo</span>
              </a>
            </Button>
          )}

          {project.github_url && (
            <Button asChild variant="outline" size="default" className="gap-2">
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="h-4 w-4" />
                <span>Lihat Source Code</span>
              </a>
            </Button>
          )}
        </div>
      </Container>

      {/* Cover Image — Can expand up to 1024px */}
      {project.cover_image && (
        <div className="my-10 max-w-[1024px] mx-auto px-4 md:px-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Main Content Body — 768px Container */}
      <Container width="prose" className="space-y-12">
        {/* Meta Grid: Role, Team, Periode */}
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-3">
          {project.role && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                <span>Peran</span>
              </div>
              <p className="text-sm font-medium text-foreground">{project.role}</p>
            </div>
          )}

          {project.team && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Tim</span>
              </div>
              <p className="text-sm font-medium text-foreground">{project.team}</p>
            </div>
          )}

          {dateRange && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Periode</span>
              </div>
              <p className="text-sm font-medium text-foreground">{dateRange}</p>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        {project.technologies.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              Teknologi yang Digunakan
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <TechChip key={tech.id} name={tech.name} />
              ))}
            </div>
          </div>
        )}

        {/* Overview Description */}
        {project.description && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Ikhtisar Proyek
            </h2>
            <div className="text-[15px] md:text-base leading-relaxed text-muted-foreground whitespace-pre-line space-y-4">
              {project.description}
            </div>
          </div>
        )}

        {/* Key Features */}
        {project.features && project.features.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Fitur Utama
            </h2>
            <ul className="space-y-3">
              {project.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges & Solutions */}
        {(project.challenges || project.solutions) && (
          <div className="space-y-6">
            {project.challenges && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  Tantangan Teknis
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line">
                  {project.challenges}
                </p>
              </div>
            )}

            {project.solutions && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  Solusi & Pendekatan
                </h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line">
                  {project.solutions}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {project.results && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Hasil & Dampak
            </h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line">
              {project.results}
            </p>
          </div>
        )}

        {/* Project Screenshots Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-border">
            <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Tangkapan Layar & Galeri
            </h2>
            <div className="space-y-6">
              {project.images.map((img) => (
                <figure key={img.id} className="space-y-2">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
                    <Image
                      src={img.image_url}
                      alt={img.caption || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-contain"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="text-center font-mono text-xs text-muted-foreground">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Prev / Next Project Navigation */}
        <div className="pt-10 border-t border-border flex items-center justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex flex-col items-start gap-1 text-left"
            >
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Sebelumnya</span>
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col items-end gap-1 text-right"
            >
              <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
                <span>Selanjutnya</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </Container>
    </article>
  );
}
