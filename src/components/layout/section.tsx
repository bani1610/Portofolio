import { cn } from '@/lib/utils';
import { Container } from './container';

type SectionProps = {
  id?: string;
  width?: 'default' | 'prose';
  /**
   * Vertical weight of the section (DESIGN.md 4.3). Not decoration: it is
   * how the page gets a rhythm instead of reading as one flat strip. A
   * supporting section sits tighter, a resting point breathes wider.
   */
  spacing?: 'tight' | 'base' | 'loose';
  className?: string;
  children: React.ReactNode;
};

const SPACING = {
  tight: 'py-12 md:py-14 lg:py-16',
  base: 'py-16 md:py-20 lg:py-24',
  loose: 'py-20 md:py-24 lg:py-32',
} as const;

export function Section({
  id,
  width,
  spacing = 'base',
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn(SPACING[spacing], className)}>
      <Container width={width}>{children}</Container>
    </section>
  );
}
