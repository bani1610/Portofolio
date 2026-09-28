import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  /** Two-digit index rendered as a mono label, e.g. '01'. */
  index?: string;
  label: string;
  title: string;
  description?: string;
  /**
   * 'h1' when this header is the page's own title, which every standalone
   * page needs exactly one of (DESIGN.md 13). Sections stacked on the
   * homepage stay at the default 'h2' so the outline keeps descending.
   */
  as?: 'h1' | 'h2';
  className?: string;
};

/**
 * The repeating section heading (DESIGN.md 7.9).
 *
 * The numbered line is the page's identity motif (DESIGN.md 7.11), not
 * decoration: the number carries the accent, the label recedes, and a short
 * rule drops from the number to tie the heading to the content below it.
 * It is marked aria-hidden because the accessible heading is the H2/H1.
 */
export function SectionHeader({
  index,
  label,
  title,
  description,
  as: Heading = 'h2',
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn('relative mb-8', className)}>
      <p
        aria-hidden="true"
        className="flex items-center gap-2 font-mono text-xs font-medium tracking-[0.08em] uppercase"
      >
        {index ? (
          <>
            <span className="text-primary">{index}</span>
            <span className="text-muted-foreground/40">/</span>
          </>
        ) : null}
        <span className="text-muted-foreground">{label}</span>
      </p>

      {/* The motif's vertical rule. Hidden below 768px, where the gutter is
          too narrow for it to read as structure rather than noise. */}
      {index ? (
        <span
          aria-hidden="true"
          className="bg-border absolute top-6 left-[3px] hidden h-6 w-px md:block"
        />
      ) : null}

      <Heading className="text-foreground mt-3 text-2xl font-semibold tracking-[-0.01em] md:text-[32px]">
        {title}
      </Heading>

      {description ? (
        <p className="text-muted-foreground mt-4 max-w-[60ch] text-[15px] leading-relaxed md:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
