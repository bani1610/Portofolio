import { PageLoading } from '@/components/layout/page-loading';
import { Skeleton } from '@/components/ui/skeleton';

export default function ContactLoading() {
  return (
    <PageLoading>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
        <div className="lg:col-span-7">
          <div className="border-border bg-card space-y-5 rounded-xl border p-6 md:p-8">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
            <Skeleton className="h-[140px] w-full" />
            <Skeleton className="h-10 w-full sm:w-40" />
          </div>
        </div>
      </div>
    </PageLoading>
  );
}
