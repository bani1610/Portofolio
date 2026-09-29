'use client';

import { FormShell } from './form-shell';
import { TextField, TextAreaField, SwitchField, FormSection } from './form-field';
import type { ActionResult } from '@/lib/actions/types';
import type { Tables } from '@/lib/supabase/types';

type AchievementFormProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  /** Set when the form is shown in a modal, so it can guard its close. */
  onDirtyChange?: (dirty: boolean) => void;
  item?: Tables<'achievements'>;
};

export function AchievementForm({ action, item, onDirtyChange }: AchievementFormProps) {
  return (
    <FormShell action={action} cancelHref="/admin/achievements" onDirtyChange={onDirtyChange}>
      <FormSection title="Pencapaian">
        <TextField name="title" label="Judul" required defaultValue={item?.title} />
        <TextField name="organization" label="Penyelenggara" defaultValue={item?.organization} />
        <TextField name="date" label="Tanggal" type="date" defaultValue={item?.date} />
        <TextAreaField name="description" label="Deskripsi" rows={4} defaultValue={item?.description} />
      </FormSection>

      <FormSection title="Tautan & Urutan">
        <TextField name="image" label="URL Gambar" defaultValue={item?.image} />
        <TextField name="url" label="URL Detail" type="url" defaultValue={item?.url} />
        <TextField name="display_order" label="Urutan" type="number" defaultValue={item?.display_order ?? 0} helper="Angka lebih kecil tampil lebih dulu." />
      </FormSection>

      <FormSection
        title="Publikasi"
        description="Bagian Achievements baru muncul di halaman utama setelah ada minimal 2 item terbit."
      >
        <SwitchField name="published" label="Terbitkan" description="Tampil di website publik." defaultChecked={item?.published} />
      </FormSection>
    </FormShell>
  );
}
