import { Skeleton } from '@/components/ui/skeleton';

type ProjectGridSkeletonProps = {
  count?: number;
};

/**
 * Mirrors the real card's proportions — 16:9 cover, title, two description
 * lines, a chip row — so the layout does not jump when data lands
 * (DESIGN.md 11, CLS).
 */
export function ProjectGridSkeleton({ count = 6 }: ProjectGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="border-border bg-card overflow-hidden rounded-lg border"
        >
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-3/5" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="flex gap-1.5 pt-1">
              <Skeleton className="h-6 w-16 rounded-sm" />
              <Skeleton className="h-6 w-20 rounded-sm" />
              <Skeleton className="h-6 w-14 rounded-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
