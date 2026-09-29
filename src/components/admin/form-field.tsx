'use client';

import * as React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useFieldError } from './form-shell';
import { cn } from '@/lib/utils';

type BaseProps = {
  name: string;
  label: string;
  required?: boolean;
  helper?: string;
  className?: string;
};

/**
 * Wraps a control with its label, helper text and error.
 *
 * aria-describedby and aria-invalid are wired here rather than at each call
 * site, so no form can accidentally ship a field whose error is visible but
 * not announced (DESIGN.md 13).
 *
 * The four parts sit in a four-row grid, with spacing carried by margins
 * rather than a row gap. That keeps the unused rows at zero height, which is
 * what lets FieldRow line two fields up with subgrid: the rows only match
 * across columns if every field has the same four of them.
 */
function Field({
  name,
  label,
  required,
  helper,
  className,
  children,
}: BaseProps & {
  children: (ids: {
    id: string;
    describedBy?: string;
    invalid: boolean;
  }) => React.ReactNode;
}) {
  const error = useFieldError(name);
  const id = `field-${name}`;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('grid grid-rows-[auto_auto_auto_auto] content-start', className)}>
      <Label htmlFor={id} className="text-foreground mb-2 text-sm font-medium">
        {label}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {/* Helper text sits above the control, not below it: it explains what
          to type, and after the field it arrives too late to be read. */}
      {helper ? (
        <p id={helperId} className="text-muted-foreground mb-2 text-xs leading-relaxed">
          {helper}
        </p>
      ) : (
        <div />
      )}

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-destructive mt-2 flex items-start gap-1.5 text-xs"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : (
        <div />
      )}
    </div>
  );
}

/**
 * Puts two fields side by side from 640px up.
 *
 * The pair shares one grid through subgrid, so the inputs line up even when
 * only one of them carries helper text. Without it, the helper under
 * "Tanggal Selesai" pushed that input a line below "Tanggal Mulai", and the
 * row read as two unrelated fields instead of one date range.
 *
 * The row gap is zeroed at that breakpoint for the same reason: once the
 * children are subgrids, a row gap would space their four inner rows apart
 * rather than the two columns.
 */
export function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:grid-rows-[auto_auto_auto_auto] sm:gap-y-0">
      {React.Children.map(children, (child) =>
        React.isValidElement<{ className?: string }>(child)
          ? React.cloneElement(child, {
              className: cn(child.props.className, 'sm:row-span-4 sm:grid-rows-subgrid'),
            })
          : child,
      )}
    </div>
  );
}

export function TextField({
  type = 'text',
  defaultValue,
  placeholder,
  ...base
}: BaseProps & {
  type?: 'text' | 'email' | 'url' | 'date' | 'number';
  defaultValue?: string | number | null;
  placeholder?: string;
}) {
  return (
    <Field {...base}>
      {({ id, describedBy, invalid }) => (
        <Input
          id={id}
          name={base.name}
          type={type}
          defaultValue={defaultValue ?? ''}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={cn(invalid && 'border-destructive')}
        />
      )}
    </Field>
  );
}

export function TextAreaField({
  defaultValue,
  placeholder,
  rows = 4,
  ...base
}: BaseProps & { defaultValue?: string | null; placeholder?: string; rows?: number }) {
  return (
    <Field {...base}>
      {({ id, describedBy, invalid }) => (
        <Textarea
          id={id}
          name={base.name}
          rows={rows}
          defaultValue={defaultValue ?? ''}
          placeholder={placeholder}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={cn(invalid && 'border-destructive')}
        />
      )}
    </Field>
  );
}

export function SelectField({
  options,
  defaultValue,
  ...base
}: BaseProps & {
  options: ReadonlyArray<{ value: string; label: string }>;
  defaultValue?: string | null;
}) {
  return (
    <Field {...base}>
      {({ id, describedBy, invalid }) => (
        // A native select, not the Radix one: this lives inside a plain
        // <form>, and the native element posts its value with no hidden
        // input or controlled state to keep in sync.
        //
        // The chevron is a real element rather than a background image. As
        // an image its colour was baked into the URL, so it stayed the same
        // grey in the light theme; as an element it follows the token like
        // every other icon.
        <div className="relative">
          <select
            id={id}
            name={base.name}
            defaultValue={defaultValue ?? options[0]?.value}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={cn(
              'border-input bg-muted/50 text-foreground h-11 w-full appearance-none rounded-md border px-3 pr-10 text-sm',
              'transition-[color,box-shadow,background-color] hover:bg-muted/70 focus-visible:bg-muted/70 focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] focus-visible:outline-none',
              invalid && 'border-destructive',
            )}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
      )}
    </Field>
  );
}

export function SwitchField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  /** States the consequence, e.g. "Tampil di website publik" (DESIGN.md 8.4). */
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = React.useState(defaultChecked ?? false);
  const id = `field-${name}`;

  return (
    // has-[:focus-visible] moves the border with keyboard focus: the switch
    // itself is 18px of track, too small to show a focus ring that reads
    // across a wide row.
    <div className="border-border bg-muted/40 has-[:focus-visible]:border-ring flex items-start justify-between gap-4 rounded-lg border p-4 transition-colors">
      <div className="min-w-0 space-y-1">
        <Label htmlFor={id} className="text-foreground text-sm font-medium">
          {label}
        </Label>
        <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
      </div>

      {/* Radix Switch renders a button, which posts nothing. The hidden
          input is what actually reaches the action. */}
      <input type="hidden" name={name} value={checked ? 'on' : ''} />
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={setChecked}
        className="mt-0.5 shrink-0"
      />
    </div>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border bg-card overflow-hidden rounded-xl border">
      {/*
        The heading is divided from the fields by a real border rather than
        by spacing alone. Without it a section whose fields scroll out of
        view reads as an empty titled card, which is what the Kontribusi
        heading looked like on screen.

        The tinted strip is the other half of that: it marks the heading as
        a different kind of row from the fields beneath, so the division
        survives at a glance instead of resting on a one-pixel line.
      */}
      <div className="border-border bg-muted/30 border-b px-4 py-3 md:px-5 md:py-3.5">
        <h2 className="text-foreground text-sm font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-5 px-4 py-4 md:px-5 md:py-5">{children}</div>
    </section>
  );
}
