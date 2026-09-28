'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFieldError } from './form-shell';
import { slugify } from '@/lib/utils/slug';
import { cn } from '@/lib/utils';

type SlugFieldProps = {
  defaultTitle?: string;
  defaultSlug?: string;
};

/**
 * Title and slug together, because they are one decision (DESIGN.md 8.4).
 *
 * The slug follows the title until the admin edits it, then stops: on an
 * existing project the slug is a published URL, and silently rewriting it
 * when the title is reworded would break an address someone may have
 * shared.
 */
export function SlugField({ defaultTitle, defaultSlug }: SlugFieldProps) {
  const [title, setTitle] = React.useState(defaultTitle ?? '');
  const [slug, setSlug] = React.useState(defaultSlug ?? '');
  // An existing slug counts as manual: it is already live.
  const [slugTouched, setSlugTouched] = React.useState(Boolean(defaultSlug));

  const titleError = useFieldError('title');
  const slugError = useFieldError('slug');

  const handleTitle = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="field-title" className="text-foreground text-sm font-medium">
          Judul
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        </Label>
        <Input
          id="field-title"
          name="title"
          value={title}
          onChange={(event) => handleTitle(event.target.value)}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? 'field-title-error' : undefined}
          className={cn(titleError && 'border-destructive')}
        />
        {titleError && (
          <p id="field-title-error" className="text-destructive text-xs">
            {titleError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="field-slug" className="text-foreground text-sm font-medium">
          Slug
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        </Label>
        <Input
          id="field-slug"
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          aria-invalid={Boolean(slugError)}
          aria-describedby={`field-slug-preview${slugError ? ' field-slug-error' : ''}`}
          className={cn('font-mono text-sm', slugError && 'border-destructive')}
        />
        <p id="field-slug-preview" className="text-muted-foreground font-mono text-xs">
          /projects/{slug || '...'}
        </p>
        {slugError && (
          <p id="field-slug-error" className="text-destructive text-xs">
            {slugError}
          </p>
        )}
      </div>
    </div>
  );
}
