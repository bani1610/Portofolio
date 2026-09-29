'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type FormModalProps = {
  title: string;
  description?: string;
  /** Receives a setter the form calls when it gains or loses unsaved edits. */
  children: (props: { onDirtyChange: (dirty: boolean) => void }) => React.ReactNode;
};

/**
 * Wraps a short form as a modal over the list it was opened from.
 *
 * Closing goes through router.back() rather than a state flag: the modal is
 * a real intercepted route, so the URL has to move with it. Back is also what
 * the browser's own back button does, which keeps the two in step instead of
 * leaving a closed modal behind in the history.
 *
 * Only the short forms open this way. Project and Experience stay full pages,
 * because at 18 and 11 fields a dialog becomes a scrolling box inside a
 * scrolling page, and on a phone there is no room for the layer at all.
 */
export function FormModal({ title, description, children }: FormModalProps) {
  const router = useRouter();
  const [dirty, setDirty] = React.useState(false);

  /**
   * Guards the close when the form has unsaved edits.
   *
   * `beforeunload` cannot do this job here: closing a dialog unmounts the
   * form without unloading the page, so Escape or a click on the backdrop
   * would discard a filled-in form with no warning at all.
   */
  const requestClose = React.useCallback(() => {
    if (dirty && !window.confirm('Perubahan belum disimpan. Tutup formulir ini?')) {
      return;
    }
    router.back();
  }, [dirty, router]);

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) requestClose();
      }}
    >
      {/*
        The body scrolls, not the dialog: the form's action bar sticks to the
        bottom of this box, and a dialog that grew with its content would
        push that bar off a short screen.

        max-h leaves a margin on a small laptop. On a phone the dialog fills
        the screen, where a centred card with a strip of page showing around
        it reads as a mistake rather than as a layer.
      */}
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(88dvh,780px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[640px]"
      >
        <DialogHeader className="border-border bg-muted/30 shrink-0 border-b px-5 py-4 text-left">
          <DialogTitle className="text-base font-semibold tracking-tight">
            {title}
          </DialogTitle>
          {description && (
            <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
          )}
        </DialogHeader>

        {/*
          The padding sits on the inner wrapper, not on the scroller. On the
          scroller it would land below the form's sticky action bar, and the
          last field would scroll into that gap and show underneath the bar.
          AdminShell keeps the page-level scroller apart for the same reason.
        */}
        {/*
          No bottom padding on either box: the action bar is the last thing
          in the form and sticks to the bottom of this scroller, so padding
          under it would leave a gap the last field scrolls into, hidden
          behind the bar. The bar carries its own padding instead.
        */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-5 pt-5">{children({ onDirtyChange: setDirty })}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
