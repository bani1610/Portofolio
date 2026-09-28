import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Edit plus the entity's own actions, for the mobile card layout.
 *
 * The table gets its edit button from DataTable; the card is assembled per
 * entity, so it needs the same control supplied here rather than repeated
 * in six files.
 */
export function CardActions({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-0.5">
      <Button asChild variant="ghost" size="icon-sm">
        <Link href={href} aria-label={`Ubah ${label}`}>
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
      {children}
    </div>
  );
}
