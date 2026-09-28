import { Container } from '@/components/layout/container';
import { ProjectGridSkeleton } from '@/components/public/project-grid-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
  return (
    <>
      {/* Hero */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32">
        <Container>
          <div className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row lg:gap-16">
            <div className="flex-1 space-y-5">
              <Skeleton className="h-7 w-56 rounded-full" />
              <Skeleton className="h-12 w-full max-w-xl md:h-16" />
              <Skeleton className="h-6 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-full max-w-[60ch]" />
                <Skeleton className="h-5 w-4/5 max-w-[60ch]" />
              </div>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                <Skeleton className="h-12 w-full sm:w-48" />
                <Skeleton className="h-12 w-full sm:w-44" />
              </div>
            </div>
            <Skeleton className="h-56 w-56 rounded-full md:h-72 md:w-72" />
          </div>
        </Container>
      </section>

      {/* Featured projects */}
      <section className="border-border/40 border-t py-16 md:py-20 lg:py-24">
        <Container>
          <div className="mb-8 space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-64" />
          </div>
          <ProjectGridSkeleton count={3} />
        </Container>
      </section>
    </>
  );
}
