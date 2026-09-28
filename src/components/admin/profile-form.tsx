'use client';

import { FormShell } from './form-shell';
import { TextField, TextAreaField, FormSection } from './form-field';
import type { ActionResult } from '@/lib/actions/types';
import type { Tables } from '@/lib/supabase/types';

type ProfileFormProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  item?: Tables<'profiles'> | null;
};

export function ProfileForm({ action, item }: ProfileFormProps) {
  return (
    <FormShell action={action} cancelHref="/admin">
      <FormSection title="Identitas">
        <TextField name="name" label="Nama Lengkap" required defaultValue={item?.name} />
        <TextField name="headline" label="Headline" defaultValue={item?.headline} placeholder="Web Developer" helper="Tampil tepat di bawah nama pada hero." />
        <TextAreaField name="bio" label="Bio" rows={5} defaultValue={item?.bio} helper="Dipakai di hero dan bagian About." />
        <TextField name="profile_image" label="URL Foto Profil" defaultValue={item?.profile_image} helper="Rasio 1:1 memberi hasil terbaik." />
      </FormSection>

      <FormSection title="Kontak">
        <TextField name="email" label="Email" type="email" defaultValue={item?.email} />
        <TextField name="phone" label="Telepon" defaultValue={item?.phone} />
        <TextField name="location" label="Lokasi" defaultValue={item?.location} placeholder="Depok, Indonesia" />
      </FormSection>

      <FormSection title="Dokumen">
        <TextField
          name="resume_url"
          label="URL CV"
          defaultValue={item?.resume_url}
          helper="Mengaktifkan tombol Download CV di navbar dan hero. Kosongkan untuk menyembunyikannya."
        />
      </FormSection>
    </FormShell>
  );
}
