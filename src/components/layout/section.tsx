import { cn } from '@/lib/utils';
import { Container } from './container';

type SectionProps = {
  id?: string;
  width?: 'default' | 'prose';
  className?: string;
  children: React.ReactNode;
};

/**
 * One vertical rhythm for every section (DESIGN.md §4.3): 64/80/96px.
 * Setting this once here is what keeps the spacing consistent across
 * pages rather than relying on each page to remember it.
 */
export function Section({ id, width, className, children }: SectionProps) {
  return (
    <section id={id} className={cn('py-16 md:py-20 lg:py-24', className)}>
      <Container width={width}>{children}</Container>
    </section>
  );
}
