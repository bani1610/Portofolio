'use client';

import { FormShell } from './form-shell';
import { TextField, SwitchField, FormSection } from './form-field';
import type { ActionResult } from '@/lib/actions/types';
import type { Tables } from '@/lib/supabase/types';

type SocialLinkFormProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  item?: Tables<'social_links'>;
};

export function SocialLinkForm({ action, item }: SocialLinkFormProps) {
  return (
    <FormShell action={action} cancelHref="/admin/social-links">
      <FormSection title="Tautan">
        <TextField
          name="platform"
          label="Platform"
          required
          defaultValue={item?.platform}
          placeholder="GitHub"
          helper="Nama platform dicocokkan untuk memilih ikon di hero dan footer."
        />
        <TextField name="url" label="URL" type="url" required defaultValue={item?.url} />
        <TextField name="icon" label="Ikon" defaultValue={item?.icon} helper="Opsional. Kosongkan untuk memakai ikon bawaan." />
        <TextField name="display_order" label="Urutan" type="number" defaultValue={item?.display_order ?? 0} />
      </FormSection>

      <FormSection title="Tampilan">
        <SwitchField name="visible" label="Tampilkan" description="Muncul di hero dan footer website publik." defaultChecked={item?.visible} />
      </FormSection>
    </FormShell>
  );
}
