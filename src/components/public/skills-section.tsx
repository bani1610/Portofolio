import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { Card } from '@/components/ui/card';
import { TechChip } from './tech-chip';
import type { Tables } from '@/lib/supabase/types';

type SkillsSectionProps = {
  technologies: Tables<'technologies'>[];
};

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend Development',
  backend: 'Backend & API',
  database: 'Database & Storage',
  tools: 'Tools & DevOps',
};

export function SkillsSection({ technologies }: SkillsSectionProps) {
  const categories: Array<'frontend' | 'backend' | 'database' | 'tools'> = [
    'frontend',
    'backend',
    'database',
    'tools',
  ];

  return (
    <Section id="skills" className="border-t border-border/40">
      <SectionHeader
        index="04"
        label="SKILLS"
        title="Keahlian & Perkakas Teknis"
        description="Teknologi dan perangkat yang rutin saya gunakan dalam merancang arsitektur dan membangun sistem web."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const items = technologies.filter((tech) => tech.category === cat);
          if (items.length === 0) return null;

          return (
            <Card
              key={cat}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <h3 className="font-mono text-xs font-semibold tracking-[0.08em] uppercase text-primary mb-4">
                {categoryLabels[cat] || cat}
              </h3>

              <div className="flex flex-wrap gap-2">
                {items.map((tech) => (
                  <TechChip key={tech.id} name={tech.name} />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
