import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/admin-guard';
import { FormPage } from '@/components/admin/form-page';
import { CertificateForm } from '@/components/admin/certificate-form';
import { updateCertificate } from '@/lib/actions/entities';

export const instant = false;

type PageProps = { params: Promise<{ id: string }> };

export default async function EditCertificatePage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data: item } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!item) notFound();

  return (
    <FormPage title="Ubah sertifikat" description={item.title}>
      <CertificateForm action={updateCertificate.bind(null, item.id)} item={item} />
    </FormPage>
  );
}
