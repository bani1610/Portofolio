'use client';

import { FormShell } from './form-shell';
import { TextField, SelectField, SwitchField, FormSection } from './form-field';
import type { ActionResult } from '@/lib/actions/types';
import type { Tables } from '@/lib/supabase/types';

type TechnologyFormProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  /** Set when the form is shown in a modal, so it can guard its close. */
  onDirtyChange?: (dirty: boolean) => void;
  item?: Tables<'technologies'>;
};

const CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend & API' },
  { value: 'database', label: 'Database' },
  { value: 'tools', label: 'Tools & DevOps' },
] as const;

export function TechnologyForm({ action, item, onDirtyChange }: TechnologyFormProps) {
  return (
    <FormShell action={action} cancelHref="/admin/skills" onDirtyChange={onDirtyChange}>
      <FormSection title="Teknologi">
        <TextField name="name" label="Nama" required defaultValue={item?.name} placeholder="React" />
        <SelectField name="category" label="Kategori" required options={CATEGORIES} defaultValue={item?.category} />
        <TextField name="icon" label="Ikon" defaultValue={item?.icon} helper="Nama ikon atau URL. Kosongkan untuk menampilkan teks saja." />
        <TextField name="display_order" label="Urutan" type="number" defaultValue={item?.display_order ?? 0} helper="Angka lebih kecil tampil lebih dulu." />
      </FormSection>

      <FormSection title="Tampilan">
        <SwitchField
          name="visible"
          label="Tampilkan di Skills"
          description="Saat nonaktif, teknologi tetap bisa dipakai sebagai tag project tetapi tidak muncul di bagian Skills."
          defaultChecked={item?.visible}
        />
      </FormSection>
    </FormShell>
  );
}
