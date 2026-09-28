'use client';

import { FormShell } from './form-shell';
import { TextField, TextAreaField, SwitchField, FormSection } from './form-field';
import type { ActionResult } from '@/lib/actions/types';
import type { Tables } from '@/lib/supabase/types';

type CertificateFormProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  item?: Tables<'certificates'>;
};

export function CertificateForm({ action, item }: CertificateFormProps) {
  return (
    <FormShell action={action} cancelHref="/admin/certificates">
      <FormSection title="Sertifikat">
        <TextField name="title" label="Judul" required defaultValue={item?.title} />
        <TextField name="issuer" label="Penerbit" required defaultValue={item?.issuer} placeholder="Dicoding, Google, Coursera" />
        <TextField name="issue_date" label="Tanggal Terbit" type="date" defaultValue={item?.issue_date} />
        <TextAreaField name="description" label="Deskripsi" rows={3} defaultValue={item?.description} />
      </FormSection>

      <FormSection title="Kredensial" description="Tombol pada kartu memakai URL verifikasi; bila kosong, berkas PDF yang dipakai.">
        <TextField name="credential_id" label="ID Kredensial" defaultValue={item?.credential_id} />
        <TextField name="credential_url" label="URL Verifikasi" type="url" defaultValue={item?.credential_url} />
        <TextField name="certificate_image" label="URL Gambar" defaultValue={item?.certificate_image} helper="Rasio 4:3 memberi hasil terbaik." />
        <TextField name="certificate_file" label="URL Berkas PDF" defaultValue={item?.certificate_file} />
      </FormSection>

      <FormSection title="Publikasi">
        <SwitchField name="published" label="Terbitkan" description="Tampil di website publik." defaultChecked={item?.published} />
      </FormSection>
    </FormShell>
  );
}
