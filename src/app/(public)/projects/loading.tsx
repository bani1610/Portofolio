import { PageLoading } from '@/components/layout/page-loading';
import { ProjectGridSkeleton } from '@/components/public/project-grid-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsLoading() {
  return (
    <PageLoading>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
        <Skeleton className="h-9 w-full sm:w-64" />
      </div>
      <ProjectGridSkeleton />
    </PageLoading>
  );
}
