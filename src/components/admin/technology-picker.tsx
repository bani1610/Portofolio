'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Tables } from '@/lib/supabase/types';

type TechnologyPickerProps = {
  technologies: Tables<'technologies'>[];
  defaultValue?: string[];
};

const CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend & API',
  database: 'Database',
  tools: 'Tools & DevOps',
};

/**
 * Technology tags as toggle chips grouped by category.
 *
 * Checkboxes styled as chips rather than a multi-select listbox: the whole
 * set is visible at once, which matters because picking tags is a
 * recognition task, not a search.
 */
export function TechnologyPicker({ technologies, defaultValue }: TechnologyPickerProps) {
  const [selected, setSelected] = React.useState<Set<string>>(
    () => new Set(defaultValue ?? []),
  );

  const toggle = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const grouped = React.useMemo(() => {
    const map = new Map<string, Tables<'technologies'>[]>();
    for (const tech of technologies) {
      const list = map.get(tech.category) ?? [];
      list.push(tech);
      map.set(tech.category, list);
    }
    return [...map.entries()];
  }, [technologies]);

  if (technologies.length === 0) {
    return (
      <div className="space-y-2">
        <Label className="text-foreground text-sm font-medium">Teknologi</Label>
        <p className="text-muted-foreground border-border rounded-lg border border-dashed p-4 text-xs">
          Belum ada teknologi terdaftar. Tambahkan lebih dulu di menu Skills &amp; Tech.
        </p>
      </div>
    );
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-foreground mb-2 text-sm font-medium">Teknologi</legend>

      {/* One hidden input per selection, so an empty set still posts the
          field and the action can clear every tag. */}
      {[...selected].map((id) => (
        <input key={id} type="hidden" name="technology_ids" value={id} />
      ))}

      {grouped.map(([category, items]) => (
        <div key={category} className="space-y-2">
          <p className="text-muted-foreground font-mono text-[11px] tracking-wide uppercase">
            {CATEGORY_LABELS[category] ?? category}
          </p>
          <div className="flex flex-wrap gap-2">
            {items.map((tech) => {
              const active = selected.has(tech.id);
              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => toggle(tech.id)}
                  aria-pressed={active}
                  className={cn(
                    'inline-flex items-center rounded-sm border px-2.5 py-1 font-mono text-xs transition-colors pointer-coarse:min-h-11 pointer-coarse:px-3',
                    active
                      ? 'border-primary/30 bg-primary/15 text-primary font-medium'
                      : 'border-border bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tech.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </fieldset>
  );
}
