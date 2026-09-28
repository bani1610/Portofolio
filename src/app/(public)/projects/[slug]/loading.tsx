import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailLoading() {
  return (
    <div className="py-12 md:py-16">
      <Container width="prose">
        <Skeleton className="mb-8 h-4 w-32" />
        <Skeleton className="h-10 w-4/5 md:h-12" />
        <Skeleton className="mt-4 h-5 w-full max-w-[60ch]" />

        <div className="mt-6 flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      </Container>

      <Container className="mt-10">
        <Skeleton className="aspect-video w-full rounded-lg" />
      </Container>

      <Container width="prose" className="mt-12 space-y-8">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ))}
      </Container>
    </div>
  );
}
