import { PageLoading } from '@/components/layout/page-loading';
import { Skeleton } from '@/components/ui/skeleton';

export default function AboutLoading() {
  return (
    <PageLoading>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-3 lg:col-span-7">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-4 w-full max-w-[68ch]" />
          ))}
        </div>
        <div className="lg:col-span-5">
          <div className="border-border bg-card space-y-4 rounded-xl border p-6">
            <Skeleton className="h-3 w-32" />
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-4/5" />
            ))}
          </div>
        </div>
      </div>
    </PageLoading>
  );
}
