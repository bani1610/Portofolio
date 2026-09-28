'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProjectCard } from './project-card';
import { cn } from '@/lib/utils';
import type { ProjectWithDetails } from '@/lib/queries/projects';

type ProjectsFilterProps = {
  initialProjects: ProjectWithDetails[];
};

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'web', label: 'Web Development' },
  { id: 'ai', label: 'AI & Machine Learning' },
  { id: 'data', label: 'Data & Analytics' },
  { id: 'other', label: 'Other' },
] as const;

export function ProjectsFilter({ initialProjects }: ProjectsFilterProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filteredProjects = React.useMemo(() => {
    return initialProjects.filter((project) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory;

      // Search query filter (title, description, technologies)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        (project.short_description &&
          project.short_description.toLowerCase().includes(q)) ||
        project.technologies.some((t) => t.name.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Chips with momentum horizontal scroll on mobile (DESIGN.md §12) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'shrink-0 rounded-md px-3 py-1.5 font-mono text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
                  active
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari project atau teknologi..."
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Tidak Ada Hasil
          </p>
          <h3 className="mt-2 text-lg font-semibold text-foreground">
            Tidak ada project yang sesuai
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-[42ch]">
            Coba ubah kata kunci pencarian atau pilih kategori filter yang berbeda.
          </p>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 rounded-md border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
            >
              Reset Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
