'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { ActionResult } from '@/lib/actions/types';

type FormShellProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  cancelHref: string;
  submitLabel?: string;
  /**
   * Told whenever the form gains or loses unsaved edits.
   *
   * In a modal, `beforeunload` never fires: closing the dialog unmounts the
   * form without unloading the page, so the warning below would not run and
   * a filled-in form would vanish on Escape. The modal subscribes here to
   * guard its own close.
   */
  onDirtyChange?: (dirty: boolean) => void;
  children: React.ReactNode;
};

/**
 * Shared wrapper for every admin form: submit handling, field errors, and
 * the sticky action bar from DESIGN.md 8.4.
 *
 * A successful action redirects, so the success path never returns here.
 * That is why only the failure branch is handled below.
 */
export function FormShell({
  action,
  cancelHref,
  submitLabel = 'Simpan',
  onDirtyChange,
  children,
}: FormShellProps) {
  const [pending, startTransition] = React.useTransition();
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [dirty, setDirty] = React.useState(false);
  const [focusTarget, setFocusTarget] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const errorCount = Object.keys(errors).length;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setErrors({});

    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        // Only reached by the single-row forms, which stay on the page;
        // the others redirect and never return here.
        setDirty(false);
        toast.success(result.message ?? 'Tersimpan.');
      } else {
        const fieldErrors = result.fieldErrors ?? {};
        setErrors(fieldErrors);
        toast.error(result.message ?? 'Gagal menyimpan.');
        // Read by the effect below, once the fieldset is enabled again.
        setFocusTarget(Object.keys(fieldErrors)[0] ?? null);
      }
    });
  };

  /**
   * Moves to the first field the server rejected.
   *
   * A long form can push that field far off-screen, leaving the toast as
   * the only sign anything went wrong. This waits for `pending` to clear
   * because the fieldset is disabled while it is true, and a disabled
   * field cannot take focus.
   */
  React.useEffect(() => {
    if (!focusTarget || pending) return;
    const field = formRef.current?.querySelector<HTMLElement>(
      `[name="${CSS.escape(focusTarget)}"]`,
    );
    field?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    field?.focus({ preventScroll: true });
    setFocusTarget(null);
  }, [focusTarget, pending]);

  /**
   * Warns before leaving with unsaved edits.
   *
   * These forms are long, and losing a filled-in project to a stray back
   * button is the kind of loss that makes a CMS feel unsafe to use.
   */
  React.useEffect(() => {
    onDirtyChange?.(dirty);
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty, onDirtyChange]);

  return (
    <FormErrorContext.Provider value={errors}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        onInput={() => setDirty(true)}
        className="w-full"
        noValidate
      >
        <fieldset disabled={pending} className="space-y-5 md:space-y-6">
          {children}
        </fieldset>

        {/*
          Pinned to the bottom of the scroll container so Simpan stays one
          click away in a form this long. Opaque, not translucent: the
          previous 95% let field text underneath bleed through and read as
          part of the bar.

          It spans the form column exactly, so nothing scrolls past its
          edges, and it needs no negative margin to line up.

          bg-background is also the dialog's own surface, so the same bar
          reads as part of the form in a modal as well as on a page.
        */}
        <div className="bg-background border-border sticky bottom-0 z-20 mt-5 flex flex-col-reverse gap-3 border-t py-3 md:mt-6 md:flex-row md:items-center md:justify-between md:py-4">
          <p
            className={
              errorCount > 0
                ? 'text-destructive flex items-center gap-1.5 text-xs'
                : 'text-muted-foreground text-xs'
            }
            aria-live="polite"
          >
            {errorCount > 0 ? (
              <>
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {errorCount} isian perlu diperbaiki.
                </span>
              </>
            ) : dirty ? (
              'Ada perubahan yang belum disimpan.'
            ) : (
              ''
            )}
          </p>

          {/* Both controls stretch on a phone, where a half-width button
              is an awkward thumb target, and sit at their natural size
              once the bar has room for a row. */}
          <div className="flex items-center gap-2 md:shrink-0">
            <Button
              asChild
              variant="ghost"
              type="button"
              className="flex-1 md:flex-initial"
            >
              <Link href={cancelHref}>Batal</Link>
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="flex-1 md:flex-initial"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Menyimpan</span>
                </>
              ) : (
                <span>{submitLabel}</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </FormErrorContext.Provider>
  );
}

/**
 * Carries server-side field errors down to each field without every form
 * threading the same prop through by hand.
 */
const FormErrorContext = React.createContext<Record<string, string[]>>({});

export function useFieldError(name: string): string | undefined {
  return React.useContext(FormErrorContext)[name]?.[0];
}
