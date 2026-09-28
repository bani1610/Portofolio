import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { Button } from '@/components/ui/button';
import { formatDateRange } from '@/lib/utils/date';
import { cn } from '@/lib/utils';
import type { Tables } from '@/lib/supabase/types';

type ExperienceSectionProps = {
  experiences: Tables<'experiences'>[];
  showAllLink?: boolean;
  /** Homepage shows a teaser; a dedicated page passes no limit. */
  limit?: number;
};

export function ExperienceSection({
  experiences,
  showAllLink = true,
  limit,
}: ExperienceSectionProps) {
  const visible = limit ? experiences.slice(0, limit) : experiences;

  return (
    <Section id="experience" className="border-t border-border/40">
      <div className="flex flex-col justify-between sm:flex-row sm:items-end">
        <SectionHeader
          index="03"
          label="EXPERIENCE"
          title="Pengalaman Profesional"
          description="Perjalanan karier, magang, dan keterlibatan profesional saya dalam rekayasa perangkat lunak."
          className="mb-6 sm:mb-8"
        />

        {showAllLink && experiences.length > 3 && (
          <div className="hidden sm:block mb-8">
            <Button asChild variant="ghost" className="gap-1.5 font-medium">
              <Link href="/experience">
                <span>Selengkapnya</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {visible.length > 0 ? (
        <div className="relative pl-6 md:pl-8 border-l border-border space-y-12">
          {visible.map((item) => {
            const dateText = formatDateRange(
              item.start_date,
              item.end_date,
              item.current
            );

            return (
              <div key={item.id} className="relative group">
                {/* Node indicator on timeline */}
                <div
                  className={cn(
                    'absolute -left-[31px] md:-left-[39px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background transition-transform group-hover:scale-125',
                    item.current
                      ? 'bg-primary ring-4 ring-primary/20'
                      : 'bg-muted-foreground/60'
                  )}
                />

                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground md:text-xl">
                    {item.position}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {dateText}
                  </span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-primary font-medium">
                  {item.company_logo && (
                    <div className="relative h-5 w-5 rounded overflow-hidden">
                      <Image
                        src={item.company_logo}
                        alt={item.company}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  <span>{item.company}</span>
                  {item.location && (
                    <>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="text-muted-foreground font-normal">
                        {item.location}
                      </span>
                    </>
                  )}
                  {item.employment_type && (
                    <>
                      <span className="text-muted-foreground/50">·</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
                        {item.employment_type}
                      </span>
                    </>
                  )}
                </div>

                {item.description && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-[65ch]">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <Briefcase className="h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-semibold text-foreground">Pengalaman sedang disiapkan</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-[42ch]">
            Entri pengalaman saat ini tersimpan sebagai draft di database dan siap di-publish melalui admin panel.
          </p>
        </div>
      )}

      {showAllLink && experiences.length > 3 && (
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href="/experience">
              <span>Lihat Seluruh Pengalaman</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </Section>
  );
}
