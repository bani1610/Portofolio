import Image from 'next/image';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { Card } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { formatDateRange } from '@/lib/utils/date';
import type { Tables } from '@/lib/supabase/types';

type EducationSectionProps = {
  education: Tables<'education'>[];
};

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <Section id="education" className="border-t border-border/40">
      <SectionHeader
        index="06"
        label="EDUCATION"
        title="Latar Belakang Pendidikan"
        description="Pendidikan formal yang membentuk landasan berpikir analitis dan fondasi ilmu komputer saya."
      />

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
