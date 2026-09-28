'use client';

import * as React from 'react';
import { AlertCircle } from 'lucide-react';
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
};

/**
 * Wraps a control with its label, helper text and error.
 *
 * aria-describedby and aria-invalid are wired here rather than at each call
 * site, so no form can accidentally ship a field whose error is visible but
 * not announced (DESIGN.md 13).
 */
function Field({
  name,
  label,
  required,
  helper,
  children,
}: BaseProps & { children: (ids: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode }) {
  const error = useFieldError(name);
  const id = `field-${name}`;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-foreground text-sm font-medium">
        {label}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {/* Helper text sits above the control, not below it: it explains what
          to type, and after the field it arrives too late to be read. */}
      {helper && (
        <p id={helperId} className="text-muted-foreground text-xs leading-relaxed">
          {helper}
        </p>
      )}

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-destructive flex items-start gap-1.5 text-xs"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
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
        <select
          id={id}
          name={base.name}
          defaultValue={defaultValue ?? options[0]?.value}
          aria-describedby={describedBy}
          aria-invalid={invalid}
          className={cn(
            'border-input bg-muted/50 text-foreground h-11 w-full appearance-none rounded-md border px-3 text-sm',
            // The chevron is drawn as a background image: a real element
            // would need a wrapper, and a bare appearance-none select
            // looks like a text input that refuses typing.
            "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23888%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10",
            'hover:bg-muted/70 focus-visible:ring-ring/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:outline-none',
            invalid && 'border-destructive',
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
    <div className="border-border bg-muted/40 flex items-start justify-between gap-4 rounded-lg border p-4">
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
    <section className="border-border bg-card rounded-xl border">
      {/*
        The heading is divided from the fields by a real border rather than
        by spacing alone. Without it a section whose fields scroll out of
        view reads as an empty titled card, which is what the Kontribusi
        heading looked like on screen.
      */}
      <div className="border-border border-b px-4 py-3.5 md:px-5 md:py-4">
        <h2 className="text-foreground text-sm font-semibold">{title}</h2>
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
