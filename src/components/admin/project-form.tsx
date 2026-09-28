'use client';

import { FormShell } from './form-shell';
import {
  TextField,
  TextAreaField,
  SelectField,
  SwitchField,
  FormSection,
} from './form-field';
import { SlugField } from './slug-field';
import { FeaturesField } from './features-field';
import { TechnologyPicker } from './technology-picker';
import type { ActionResult } from '@/lib/actions/types';
import type { Tables } from '@/lib/supabase/types';

type ProjectFormProps = {
  action: (formData: FormData) => Promise<ActionResult>;
  technologies: Tables<'technologies'>[];
  project?: Tables<'projects'>;
  selectedTechnologyIds?: string[];
};

const CATEGORIES = [
  { value: 'web', label: 'Web Development' },
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'data', label: 'Data & Analytics' },
  { value: 'other', label: 'Lainnya' },
] as const;

export function ProjectForm({
  action,
  technologies,
  project,
  selectedTechnologyIds,
}: ProjectFormProps) {
  return (
    <FormShell action={action} cancelHref="/admin/projects">
      <FormSection title="Identitas">
        <SlugField defaultTitle={project?.title} defaultSlug={project?.slug} />

        <SelectField
          name="category"
          label="Kategori"
          required
          options={CATEGORIES}
          defaultValue={project?.category}
          helper="Dipakai untuk filter di halaman /projects."
        />

        <TextAreaField
          name="short_description"
          label="Deskripsi Singkat"
          rows={2}
          defaultValue={project?.short_description}
          helper="Tampil di kartu project. Dipotong setelah dua baris."
        />

        <TextAreaField
          name="description"
          label="Deskripsi Lengkap"
          rows={6}
          defaultValue={project?.description}
        />
      </FormSection>

      <FormSection title="Kontribusi" description="Bagian ini yang dibaca perekrut untuk menilai peran Anda.">
        <TextField name="role" label="Peran" defaultValue={project?.role} placeholder="Full Stack Developer" />
        <TextField name="team" label="Tim" defaultValue={project?.team} placeholder="Solo, atau Tim 4 orang" />
        <FeaturesField defaultValue={project?.features} />
        <TextAreaField name="challenges" label="Tantangan" defaultValue={project?.challenges} />
        <TextAreaField name="solutions" label="Solusi" defaultValue={project?.solutions} />
        <TextAreaField name="results" label="Hasil" defaultValue={project?.results} />
      </FormSection>

      <FormSection title="Teknologi">
        <TechnologyPicker technologies={technologies} defaultValue={selectedTechnologyIds} />
      </FormSection>

      <FormSection title="Tautan & Waktu">
        <TextField name="github_url" label="URL GitHub" type="url" defaultValue={project?.github_url} />
        <TextField name="demo_url" label="URL Demo" type="url" defaultValue={project?.demo_url} />
        <TextField name="cover_image" label="URL Gambar Sampul" defaultValue={project?.cover_image} helper="Rasio 16:9 memberi hasil terbaik." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField name="start_date" label="Tanggal Mulai" type="date" defaultValue={project?.start_date} />
          <TextField name="end_date" label="Tanggal Selesai" type="date" defaultValue={project?.end_date} />
        </div>
      </FormSection>

      <FormSection title="Publikasi">
        <SwitchField
          name="published"
          label="Terbitkan"
          description="Tampil di website publik. Saat nonaktif, project hanya terlihat di admin."
          defaultChecked={project?.published}
        />
        <SwitchField
          name="featured"
          label="Unggulan"
          description="Ditampilkan di halaman utama, bukan hanya di halaman /projects."
          defaultChecked={project?.featured}
        />
      </FormSection>
    </FormShell>
  );
}
