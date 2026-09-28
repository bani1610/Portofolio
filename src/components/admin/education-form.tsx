'use client';

import { FormShell } from './form-shell';
import { TextField, TextAreaField, SwitchField, FormSection } from './form-field';
import type { ActionResult } from '@/lib/actions/types';
import type { Tables } from '@/lib/supabase/types';

type EducationFormProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  item?: Tables<'education'>;
};

export function EducationForm({ action, item }: EducationFormProps) {
  return (
    <FormShell action={action} cancelHref="/admin/education">
      <FormSection title="Pendidikan">
        <TextField name="institution" label="Institusi" required defaultValue={item?.institution} />
        <TextField name="degree" label="Jenjang" defaultValue={item?.degree} placeholder="S1" />
        <TextField name="field" label="Bidang Studi" defaultValue={item?.field} placeholder="Teknik Informatika" />
        <TextField name="logo" label="URL Logo" defaultValue={item?.logo} />
      </FormSection>

      <FormSection title="Periode">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField name="start_date" label="Tanggal Mulai" type="date" defaultValue={item?.start_date} />
          <TextField name="end_date" label="Tanggal Selesai" type="date" defaultValue={item?.end_date} helper="Kosongkan jika masih berjalan." />
        </div>
        <TextAreaField name="description" label="Deskripsi" rows={4} defaultValue={item?.description} />
      </FormSection>

      <FormSection title="Publikasi">
        <SwitchField name="published" label="Terbitkan" description="Tampil di website publik." defaultChecked={item?.published} />
      </FormSection>
    </FormShell>
  );
}
