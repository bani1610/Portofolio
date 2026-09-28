import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  action?: { href: string; label: string };
};

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>

      {action && (
        <Button asChild size="sm">
          <Link href={action.href}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>{action.label}</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
