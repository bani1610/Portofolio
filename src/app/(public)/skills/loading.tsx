import { PageLoading } from '@/components/layout/page-loading';
import { Skeleton } from '@/components/ui/skeleton';

export default function SkillsLoading() {
  return (
    <PageLoading>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="border-border bg-card space-y-3 rounded-xl border p-6"
          >
            <Skeleton className="h-3 w-20" />
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 6 }, (_, j) => (
                <Skeleton key={j} className="h-6 w-16 rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageLoading>
  );
}
