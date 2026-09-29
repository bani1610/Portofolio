'use client';

import { FormShell } from './form-shell';
import {
  TextField,
  TextAreaField,
  SwitchField,
  FormSection,
  FieldRow,
} from './form-field';
import type { ActionResult } from '@/lib/actions/types';
import type { Tables } from '@/lib/supabase/types';

type ExperienceFormProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  item?: Tables<'experiences'>;
};

export function ExperienceForm({ action, item }: ExperienceFormProps) {
  return (
    <FormShell action={action} cancelHref="/admin/experiences">
      <FormSection title="Posisi">
        <TextField name="position" label="Posisi" required defaultValue={item?.position} placeholder="Web Developer Intern" />
        <TextField name="company" label="Perusahaan" required defaultValue={item?.company} />
        <TextField name="location" label="Lokasi" defaultValue={item?.location} placeholder="Jakarta, atau Remote" />
        <TextField name="employment_type" label="Jenis Pekerjaan" defaultValue={item?.employment_type} placeholder="Magang, Penuh Waktu, Kontrak" />
        <TextField name="company_logo" label="URL Logo Perusahaan" defaultValue={item?.company_logo} />
      </FormSection>

      <FormSection title="Periode">
        <FieldRow>
          <TextField name="start_date" label="Tanggal Mulai" type="date" required defaultValue={item?.start_date} />
          <TextField name="end_date" label="Tanggal Selesai" type="date" defaultValue={item?.end_date} helper="Kosongkan jika masih berjalan." />
        </FieldRow>
        <SwitchField name="current" label="Masih Berjalan" description={'Menampilkan "Present" sebagai pengganti tanggal selesai.'} defaultChecked={item?.current} />
      </FormSection>

      <FormSection title="Uraian">
        <TextAreaField name="description" label="Deskripsi" rows={5} defaultValue={item?.description} />
      </FormSection>

      <FormSection title="Publikasi">
        <SwitchField name="published" label="Terbitkan" description="Tampil di website publik." defaultChecked={item?.published} />
        <SwitchField name="featured" label="Unggulan" description="Diprioritaskan pada ringkasan di halaman utama." defaultChecked={item?.featured} />
      </FormSection>
    </FormShell>
  );
}
