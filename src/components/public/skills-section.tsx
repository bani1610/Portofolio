import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { TechChip } from './tech-chip';
import type { Tables } from '@/lib/supabase/types';

type SkillsSectionProps = {
  technologies: Tables<'technologies'>[];
};

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend & API',
  database: 'Database',
  tools: 'Tools & DevOps',
};

const categories = ['frontend', 'backend', 'database', 'tools'] as const;

/**
 * Definition rows, not a four-card grid (DESIGN.md 4.3 revision 1.2).
 *
 * Four equal cards made this section look identical to Projects and
 * Certificates directly above and below it. A label-and-values row reads
 * faster for the same content and gives the page a different shape at this
 * point in the scroll.
 */
export function SkillsSection({ technologies }: SkillsSectionProps) {
  const groups = categories
    .map((category) => ({
      category,
      items: technologies.filter((tech) => tech.category === category),
    }))
    .filter((group) => group.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <Section id="skills" spacing="base">
      <SectionHeader
        index="04"
        label="SKILLS"
        title="Keahlian & Perkakas Teknis"
        description="Teknologi dan perangkat yang rutin saya gunakan dalam merancang arsitektur dan membangun sistem web."
      />

      <Reveal stagger="rows" className="divide-border/60 divide-y">
        {groups.map(({ category, items }) => (
          <div
            key={category}
            className="grid grid-cols-1 gap-3 py-5 md:grid-cols-[160px_1fr] md:gap-8"
          >
            <dt className="text-primary font-mono text-xs font-semibold tracking-[0.08em] uppercase md:pt-1">
              {categoryLabels[category] ?? category}
            </dt>
            <dd className="flex flex-wrap gap-2">
              {items.map((tech) => (
                <TechChip key={tech.id} name={tech.name} />
              ))}
            </dd>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
