import { requireAdmin } from '@/lib/supabase/admin-guard';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { CertificateForm } from '@/components/admin/certificate-form';
import { createCertificate } from '@/lib/actions/entities';

export const instant = false;

export default async function NewCertificatePage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Tambah Sertifikat" />
      <CertificateForm action={createCertificate} />
    </div>
  );
}
