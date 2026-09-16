import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  /** Two-digit index rendered as a mono label, e.g. '01'. */
  index?: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
};

/**
 * The repeating section heading (DESIGN.md §7.9).
 *
 * The mono "01 — PROJECTS" line is decorative orientation, not content:
 * the accessible heading is the H2 below it.
 */
export function SectionHeader({
  index,
  label,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn('mb-8', className)}>
      <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.08em] uppercase">
        {index ? `${index} — ` : null}
        {label}
      </p>
      <h2 className="text-foreground mt-3 text-2xl font-semibold tracking-[-0.01em] md:text-[32px]">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-4 max-w-[60ch] text-[15px] leading-relaxed md:text-base">
          {description}
        </p>
      ) : null}
    </header>
  );
}
