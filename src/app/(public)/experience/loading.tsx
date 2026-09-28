import { PageLoading } from '@/components/layout/page-loading';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExperienceLoading() {
  return (
    <PageLoading>
      <div className="border-border space-y-12 border-l pl-6 md:pl-8">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-2/5" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full max-w-[60ch]" />
            <Skeleton className="h-4 w-4/5 max-w-[60ch]" />
          </div>
        ))}
      </div>
    </PageLoading>
  );
}
