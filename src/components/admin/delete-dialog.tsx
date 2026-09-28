'use client';

import * as React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ActionResult } from '@/lib/actions/types';

type DeleteDialogProps = {
  /** Shown in the confirmation, so the admin sees what they are deleting. */
  itemName: string;
  /** Extra consequence worth stating, e.g. attached images. */
  note?: string;
  onConfirm: () => Promise<ActionResult>;
};

/**
 * Delete confirmation naming the actual item (DESIGN.md 8.4).
 *
 * "Delete this item?" is what makes people delete the wrong row: the
 * dialog looks identical whichever one they clicked.
 */
export function DeleteDialog({ itemName, note, onConfirm }: DeleteDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await onConfirm();
      if (result.success) {
        toast.success(result.message ?? 'Data dihapus.');
        setOpen(false);
      } else {
        toast.error(result.message ?? 'Gagal menghapus data.');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Hapus ${itemName}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus {itemName}?</DialogTitle>
          <DialogDescription>
            {note ?? 'Tindakan ini tidak dapat dibatalkan.'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            Batal
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Menghapus</span>
              </>
            ) : (
              <span>Hapus</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
