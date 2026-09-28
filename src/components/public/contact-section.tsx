import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { ContactForm } from './contact-form';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import type { Tables } from '@/lib/supabase/types';

type ContactSectionProps = {
  profile?: Tables<'profiles'> | null;
};

export function ContactSection({ profile }: ContactSectionProps) {
  return (
    <Section id="contact" className="border-t border-border/40">
      <SectionHeader
        index="07"
        label="CONTACT"
        title="Mari Terhubung"
        description="Punya pertanyaan, tawaran proyek, atau ingin berdiskusi? Jangan ragu untuk mengirim pesan."
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Direct Info */}
        <div className="space-y-6 lg:col-span-5">
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
              Kontak Langsung
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Saya terbuka untuk peluang kolaborasi, peran penuh waktu, maupun proyek lepas.
              Respon tercepat biasanya via email atau LinkedIn.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/30 group"
              >
                <div className="rounded-md bg-muted p-2 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {profile.email}
                  </div>
                </div>
              </a>
            )}

            {profile?.location && (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                <div className="rounded-md bg-muted p-2 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-mono text-xs text-muted-foreground">Lokasi</div>
                  <div className="text-sm font-medium text-foreground">
                    {profile.location}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <div className="rounded-md bg-muted p-2 text-primary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="font-mono text-xs text-muted-foreground">Status Ketersediaan</div>
                <div className="text-primary text-sm font-medium">
                  Open for new opportunities
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  );
}
