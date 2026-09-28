'use client';

import * as React from 'react';
import { Eye, EyeOff, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DeleteDialog } from './delete-dialog';
import {
  deleteProject,
  toggleProjectPublished,
  toggleProjectFeatured,
} from '@/lib/actions/projects';
import { cn } from '@/lib/utils';

type ProjectRowActionsProps = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  featured: boolean;
};

/**
 * Publish and feature toggles inline on the row (PRD 20), so the common
 * case does not require opening the form.
 */
export function ProjectRowActions({
  id,
  slug,
  title,
  published,
  featured,
}: ProjectRowActionsProps) {
  const [pending, startTransition] = React.useTransition();

  const run = (action: () => Promise<{ success: boolean; message?: string }>) => {
    startTransition(async () => {
      const result = await action();
      if (result.success) toast.success(result.message ?? 'Tersimpan.');
      else toast.error(result.message ?? 'Gagal menyimpan.');
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={pending}
        onClick={() => run(() => toggleProjectPublished(id, slug, !published))}
        aria-label={published ? `Sembunyikan ${title}` : `Tayangkan ${title}`}
        title={published ? 'Sembunyikan dari publik' : 'Tayangkan ke publik'}
        className="text-muted-foreground hover:text-foreground"
      >
        {published ? (
          <Eye className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        disabled={pending}
        onClick={() => run(() => toggleProjectFeatured(id, slug, !featured))}
        aria-label={featured ? `Lepas tanda unggulan ${title}` : `Tandai ${title} sebagai unggulan`}
        title={featured ? 'Lepas dari unggulan' : 'Tandai sebagai unggulan'}
        className={cn(
          'text-muted-foreground hover:text-foreground',
          featured && 'text-warning hover:text-warning',
        )}
      >
        <Star className={cn('h-4 w-4', featured && 'fill-current')} aria-hidden="true" />
      </Button>

      <DeleteDialog
        itemName={title}
        note="Gambar galeri dan tag teknologi milik project ini ikut terhapus. Tindakan ini tidak dapat dibatalkan."
        onConfirm={() => deleteProject(id, slug)}
      />
    </>
  );
}
