import { cn } from '@/lib/utils';

/**
 * Loading placeholder: a muted block, never a spinner (DESIGN.md 11).
 * A block of roughly the right shape shows what is arriving; a spinner
 * only shows that something is.
 *
 * The pulse is opacity-only, so it stays on the compositor and respects
 * the reduced-motion rule in globals.css.
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('bg-muted animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
