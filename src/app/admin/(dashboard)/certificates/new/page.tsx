import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormPage } from '@/components/admin/form-page';
import { CertificateForm } from '@/components/admin/certificate-form';
import { createCertificate } from '@/lib/actions/entities';

export const instant = false;

export default async function NewCertificatePage() {
  await requireAdmin();

  return (
    <FormPage title="Tambah Sertifikat">
      <CertificateForm action={createCertificate} />
    </FormPage>
  );
}
