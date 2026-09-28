'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DeleteDialog } from './delete-dialog';
import type { ActionResult } from '@/lib/actions/types';

type RowActionsProps = {
  itemName: string;
  visible: boolean;
  /**
   * Server Actions, already bound to the row id by the list page.
   *
   * They must be bound rather than wrapped in an arrow function: a plain
   * closure is not serialisable and cannot cross into a Client Component,
   * whereas a Server Action crosses as a reference. `.bind(null, id)` is
   * what produces that reference.
   */
  toggleAction: (next: boolean) => Promise<ActionResult>;
  deleteAction: () => Promise<ActionResult>;
  /** Wording differs per entity: published/draft, or shown/hidden. */
  labels?: { show: string; hide: string };
  deleteNote?: string;
};

/**
 * Visibility toggle plus delete, shared by every list except Projects,
 * which additionally has a featured star.
 */
export function RowActions({
  itemName,
  visible,
  toggleAction,
  deleteAction,
  labels,
  deleteNote,
}: RowActionsProps) {
  const [pending, startTransition] = React.useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleAction(!visible);
      if (result.success) toast.success(result.message ?? 'Tersimpan.');
      else toast.error(result.message ?? 'Gagal menyimpan.');
    });
  };

  const showLabel = labels?.show ?? 'Tayangkan';
  const hideLabel = labels?.hide ?? 'Sembunyikan';

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={pending}
        onClick={handleToggle}
        aria-label={`${visible ? hideLabel : showLabel} ${itemName}`}
        title={visible ? hideLabel : showLabel}
        className="text-muted-foreground hover:text-foreground"
      >
        {visible ? (
          <Eye className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>

      <DeleteDialog itemName={itemName} note={deleteNote} onConfirm={deleteAction} />
    </>
  );
}
