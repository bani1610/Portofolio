import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormModal } from '@/components/admin/form-modal';
import { TechnologyForm } from '@/components/admin/technology-form';
import { createTechnology } from '@/lib/actions/entities';

export const instant = false;

export default async function NewTechnologyModal() {
  await requireAdmin();

  return (
    <FormModal title="Tambah Teknologi">
      {({ onDirtyChange }) => (
        <TechnologyForm action={createTechnology} onDirtyChange={onDirtyChange} />
      )}
    </FormModal>
  );
}
