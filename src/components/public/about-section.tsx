import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { MapPin, Mail, Briefcase, GraduationCap } from 'lucide-react';
import type { Tables } from '@/lib/supabase/types';

type AboutSectionProps = {
  profile?: Tables<'profiles'> | null;
  education?: Tables<'education'>[];
};

export function AboutSection({ profile, education = [] }: AboutSectionProps) {
  const latestEdu = education[0];

  return (
    <Section id="about" className="border-t border-border/40">
      <SectionHeader
        index="01"
        label="ABOUT ME"
        title="Sekilas Tentang Saya"
        description="Fokus saya adalah menciptakan pengalaman web yang terstruktur, cepat, dan mudah diakses."
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Story & Philosophy */}
        <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground md:text-base lg:col-span-7">
          <p>
            {profile?.bio ||
              'Saya adalah seorang Web Developer dengan ketertarikan mendalam pada teknologi ekosistem modern seperti React, Next.js, TypeScript, dan arsitektur database relasional.'}
          </p>
          <p>
            Saya percaya bahwa sebuah produk digital yang hebat tidak hanya harus memiliki visual yang memikat,
            tetapi juga arsitektur kode yang tangguh, performa tinggi, dan aksesibilitas ramah pengguna.
          </p>
          <p>
            Setiap baris kode yang saya tulis mengutamakan prinsip clean code, type-safety, dan kepatuhan terhadap
            standar industri web modern.
          </p>
        </div>

        {/* Right Column: Highlights / Quick Facts */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
              Informasi Singkat
            </h3>

            <div className="space-y-3 text-sm">
              {profile?.location && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile?.email && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
              )}

              <div className="flex items-center gap-3 text-muted-foreground">
                <Briefcase className="h-4 w-4 text-primary shrink-0" />
                <span>Web Development & Software Engineering</span>
              </div>

              {latestEdu && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    {latestEdu.degree ? `${latestEdu.degree} - ` : ''}
                    {latestEdu.institution}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
