import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { ContactSection } from '@/components/public/contact-section';
import { getProfile } from '@/lib/queries';

export const metadata: Metadata = {
  title: 'Contact — Sholahuddin Robbani',
  description:
    'Hubungi Sholahuddin Robbani untuk kolaborasi, proyek rekayasa web, atau peluang kerja.',
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="py-12 md:py-16">
      <Container>
        <ContactSection profile={profile} as="h1" />
      </Container>
    </div>
  );
}
