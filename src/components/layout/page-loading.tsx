import { Container } from '@/components/layout/container';
import { Skeleton } from '@/components/ui/skeleton';

type PageLoadingProps = {
  children?: React.ReactNode;
};

/**
 * Shared loading shell for the public pages: the SectionHeader block every
 * one of them opens with, plus whatever body skeleton the page passes.
 */
export function PageLoading({ children }: PageLoadingProps) {
  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="mb-8 space-y-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-72 max-w-full" />
          <Skeleton className="h-4 w-full max-w-[48ch]" />
        </div>
        {children}
      </Container>
    </div>
  );
}
