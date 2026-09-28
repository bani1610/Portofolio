import Link from 'next/link';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Primary cell: the name, as a link to the edit form. */
export function TitleCell({
  href,
  title,
  featured,
  secondary,
}: {
  href: string;
  title: string;
  featured?: boolean;
  /** Only when it genuinely helps identify the row, e.g. the slug. */
  secondary?: string | null;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <Link
          href={href}
          className="text-foreground hover:text-primary truncate font-medium transition-colors pointer-coarse:inline-flex pointer-coarse:min-h-11 pointer-coarse:items-center"
        >
          {title}
        </Link>
        {featured && (
          <span className="text-warning shrink-0" title="Unggulan">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            <span className="sr-only">Unggulan</span>
          </span>
        )}
      </div>
      {secondary && (
        <p className="text-muted-foreground mt-0.5 truncate font-mono text-xs">
          {secondary}
        </p>
      )}
    </div>
  );
}

/**
 * A dot alone would encode the state in colour only, so the label carries
 * it and the dot only reinforces (DESIGN.md 13).
 */
export function StateCell({
  on,
  labels,
}: {
  on: boolean;
  labels: { on: string; off: string };
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        aria-hidden="true"
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          on ? 'bg-success' : 'bg-muted-foreground/40',
        )}
      />
      <span className={on ? 'text-foreground' : 'text-muted-foreground'}>
        {on ? labels.on : labels.off}
      </span>
    </span>
  );
}

/** Secondary text: dates, categories, counts. */
export function TextCell({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground text-xs">{children || '-'}</span>;
}

/** Categorical value, e.g. a project category or tech group. */
export function TagCell({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-muted text-muted-foreground inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[11px]">
      {children}
    </span>
  );
}
