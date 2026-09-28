'use client';

import { FormShell } from './form-shell';
import { TextField, TextAreaField, FormSection } from './form-field';
import type { ActionResult } from '@/lib/actions/types';
import type { Tables } from '@/lib/supabase/types';

type SettingsFormProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  item?: Tables<'site_settings'> | null;
};

export function SettingsForm({ action, item }: SettingsFormProps) {
  return (
    <FormShell action={action} cancelHref="/admin">
      <FormSection title="Metadata Situs" description="Dipakai sebagai judul dan deskripsi bawaan untuk mesin pencari.">
        <TextField name="site_title" label="Judul Situs" defaultValue={item?.site_title} />
        <TextAreaField name="site_description" label="Deskripsi Situs" rows={3} defaultValue={item?.site_description} helper="Sekitar 150 sampai 160 karakter agar tidak terpotong di hasil pencarian." />
        <TextField name="og_image" label="URL Gambar Open Graph" defaultValue={item?.og_image} helper="Tampil saat tautan dibagikan. Rasio 1200x630 memberi hasil terbaik." />
      </FormSection>

      <FormSection title="Dokumen">
        <TextField name="resume_url" label="URL CV Bawaan" defaultValue={item?.resume_url} helper="Dipakai bila URL CV pada Profil dikosongkan." />
      </FormSection>
    </FormShell>
  );
}
