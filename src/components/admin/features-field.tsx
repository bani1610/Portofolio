'use client';

import * as React from 'react';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FeaturesFieldProps = {
  defaultValue?: string[];
};

/**
 * Editor for projects.features, a text[] column (PRD 24).
 *
 * Each entry posts as its own `features` input, so the action reads them
 * with getAll() and the array arrives intact. A single textarea split on
 * newlines would be less code here but would break the moment a feature
 * description itself wrapped.
 */
export function FeaturesField({ defaultValue }: FeaturesFieldProps) {
  const [features, setFeatures] = React.useState<string[]>(
    defaultValue?.length ? defaultValue : [''],
  );

  const update = (index: number, value: string) => {
    setFeatures((current) => current.map((item, i) => (i === index ? value : item)));
  };

  const remove = (index: number) => {
    setFeatures((current) => {
      const next = current.filter((_, i) => i !== index);
      // Never collapse to zero rows: an empty editor gives the admin
      // nothing to type into.
      return next.length > 0 ? next : [''];
    });
  };

  return (
    <div className="space-y-2">
      <Label className="text-foreground text-sm font-medium">Fitur Utama</Label>
      <p className="text-muted-foreground text-xs leading-relaxed">
        Setiap butir tampil sebagai satu item bercentang di halaman detail.
      </p>

      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Input
              name="features"
              value={feature}
              onChange={(event) => update(index, event.target.value)}
              placeholder="Misalnya: Autentikasi multi-peran"
              aria-label={`Fitur ${index + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label={`Hapus fitur ${index + 1}`}
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setFeatures((current) => [...current, ''])}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span>Tambah fitur</span>
      </Button>
    </div>
  );
}
