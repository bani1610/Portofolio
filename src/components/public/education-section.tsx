import Image from 'next/image';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { Card } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { formatDateRange } from '@/lib/utils/date';
import type { Tables } from '@/lib/supabase/types';

type EducationSectionProps = {
  education: Tables<'education'>[];
  /** False on /education, where the page supplies its own heading. */
  showHeader?: boolean;
};

export function EducationSection({
  education,
  showHeader = true,
}: EducationSectionProps) {
  // On the homepage an empty section is simply dropped; the dedicated page
  // must still render something, so it says so rather than going blank.
  if (education.length === 0 && showHeader) return null;

  return (
    <Section id="education" className="border-t border-border/40">
      {showHeader && (
        <SectionHeader
          index="06"
          label="EDUCATION"
          title="Latar Belakang Pendidikan"
          description="Pendidikan formal yang membentuk landasan berpikir analitis dan fondasi ilmu komputer saya."
        />
      )}

      {education.length === 0 && (
        <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <GraduationCap className="text-muted-foreground/60 mb-3 h-10 w-10" />
          <h3 className="text-foreground text-base font-semibold">
            Riwayat pendidikan sedang disiapkan
          </h3>
          <p className="text-muted-foreground mt-1 max-w-[42ch] text-sm">
            Entri pendidikan tersimpan sebagai draft dan akan tampil setelah
            di-publish melalui admin panel.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {education.map((edu) => {
          const dateRange = formatDateRange(edu.start_date, edu.end_date, false);

          return (
            <Card
              key={edu.id}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start gap-4">
                {edu.logo ? (
                  <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-border bg-muted p-1">
                    <Image
                      src={edu.logo}
                      alt={edu.institution}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-primary">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground md:text-lg">
                    {edu.institution}
                  </h3>
                  <p className="text-sm font-medium text-primary">
                    {edu.degree}
                    {edu.field ? ` · ${edu.field}` : ''}
                  </p>
                  {dateRange && (
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {dateRange}
                    </p>
                  )}
                </div>
              </div>

              {edu.description && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {edu.description}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
