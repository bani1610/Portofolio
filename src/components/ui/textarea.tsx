import * as React from 'react';
import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // No resize handle: dragging one lets a field grow past the form
        // column and leaves the layout in a state nobody designed.
        // field-sizing-content grows the box with the text instead, so the
        // `rows` each field passes only takes effect in browsers that lack
        // field-sizing (Firefox, Safari), where it is the fallback height.
        //
        // min-h is what field-sizing-content does not give: an empty
        // textarea would collapse to one line and read as a text input.
        // max-h stops a long description from filling the whole screen.
        'field-sizing-content min-h-24 max-h-[50vh] resize-none',
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:bg-muted/70 hover:bg-muted/70 aria-invalid:border-destructive aria-invalid:ring-destructive/20 bg-muted/50 flex w-full rounded-md border px-3 py-2.5 text-base leading-relaxed transition-[color,box-shadow,background-color] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
