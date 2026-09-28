import Image from 'next/image';
import { ExternalLink, Trophy } from 'lucide-react';
import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { Card } from '@/components/ui/card';
import { formatMonthYear } from '@/lib/utils/date';
import type { Tables } from '@/lib/supabase/types';

type AchievementsSectionProps = {
  achievements: Tables<'achievements'>[];
};

/**
 * Rendered only from two published items up (PRD 16, 36).
 *
 * The threshold is the point of the component: a section holding a single
 * award reads as thin, and this way it appears by itself once there is
 * enough to show rather than needing to be switched on by hand.
 */
export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (achievements.length < 2) return null;

  return (
    <Section id="achievements" spacing="tight">
      <SectionHeader
        index="07"
        label="ACHIEVEMENTS"
        title="Pencapaian & Penghargaan"
        description="Kompetisi, penghargaan, dan pencapaian lain di luar pekerjaan formal."
      />

      <Reveal
        stagger="cards"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {achievements.map((item) => {
          const dateText = formatMonthYear(item.date);

          return (
            <Card
              key={item.id}
              className="border-border bg-card hover:border-primary/40 flex flex-col rounded-lg border p-6 transition-colors"
            >
              <div className="flex items-start gap-4">
                {item.image ? (
                  <div className="border-border bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border p-1">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="border-border bg-muted text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border">
                    <Trophy className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="text-foreground line-clamp-2 text-base font-semibold">
                    {item.title}
                  </h3>
                  {item.organization && (
                    <p className="text-primary mt-0.5 text-sm font-medium">
                      {item.organization}
                    </p>
                  )}
                  {dateText && (
                    <p className="text-muted-foreground mt-1 font-mono text-xs">
                      {dateText}
                    </p>
                  )}
                </div>
              </div>

              {item.description && (
                <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                  {item.description}
                </p>
              )}

              {item.url && (
                <div className="border-border/60 mt-auto border-t pt-4">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1.5 text-xs font-medium hover:underline"
                  >
                    <span>Lihat Detail</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              )}
            </Card>
          );
        })}
      </Reveal>
    </Section>
  );
}
