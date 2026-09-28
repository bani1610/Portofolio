import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: { href: string; label: string };
};

/**
 * An empty list says why it is empty and gives the action that fills it
 * (DESIGN.md 8.3). A bare table with no explanation reads as a failure.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
      <h2 className="text-foreground text-base font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-1 max-w-[46ch] text-sm">{description}</p>
      {action && (
        <Button asChild size="sm" className="mt-5">
          <Link href={action.href}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>{action.label}</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
