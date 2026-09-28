import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeader } from '@/components/layout/section-header';
import { CertificatesSection } from '@/components/public/certificates-section';
import { getPublishedCertificates } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Certificates — Sholahuddin Robbani',
  description:
    'Sertifikasi profesional dan lisensi kompetensi rekayasa perangkat lunak.',
};

export default async function CertificatesPage() {
  const certificates = await getPublishedCertificates();

  return (
    <div className="py-12 md:py-16">
      <Container>
        <SectionHeader
          as="h1"
          index="CERT"
          label="CREDENTIALS"
          title="Sertifikasi & Lisensi"
          description="Daftar lengkap sertifikasi resmi yang telah saya selesaikan untuk memvalidasi kompetensi teknis."
          className="mb-8"
        />

        <CertificatesSection certificates={certificates} showAllLink={false} />
      </Container>
    </div>
  );
}
