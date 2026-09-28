'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Award,
  Cpu,
  GraduationCap,
  Trophy,
  Share2,
  Mail,
  User,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/experiences', label: 'Experiences', icon: Briefcase },
  { href: '/admin/skills', label: 'Skills & Tech', icon: Cpu },
  { href: '/admin/certificates', label: 'Certificates', icon: Award },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { href: '/admin/social-links', label: 'Social Links', icon: Share2 },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

/**
 * Grouped rather than one flat list of eleven: content the admin edits
 * often, the site's own identity, and the inbox are different kinds of
 * work, and a flat list makes you re-read all eleven to find any one.
 */
const NAV_GROUPS = [
  { label: null, items: ['/admin'] },
  {
    label: 'Konten',
    items: [
      '/admin/projects',
      '/admin/experiences',
      '/admin/skills',
      '/admin/certificates',
      '/admin/education',
      '/admin/achievements',
    ],
  },
  { label: 'Situs', items: ['/admin/profile', '/admin/social-links', '/admin/settings'] },
  { label: 'Masuk', items: ['/admin/messages'] },
] as const;

type AdminSidebarProps = {
  onItemClick?: () => void;
};

export function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[240px] flex-col border-r border-border bg-card">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-5">
        <Link
          href="/admin"
          className="text-foreground flex items-center gap-2 font-mono text-sm font-semibold tracking-tight pointer-coarse:min-h-11"
        >
          <span className="text-primary font-bold">#</span>
          <span>CMS Admin</span>
        </Link>
        <Link
          href="/"
          target="_blank"
          aria-label="Preview public website"
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center justify-center rounded p-1 transition-colors pointer-coarse:size-11"
          title="Buka Website Publik"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label ?? groupIndex} className="space-y-0.5">
            {group.label && (
              <p className="text-muted-foreground/70 px-3 pt-2 pb-1 text-[11px] font-medium tracking-wide uppercase">
                {group.label}
              </p>
            )}

            {group.items.map((href) => {
              const item = adminNavItems.find((navItem) => navItem.href === href);
              if (!item) return null;

              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                    'pointer-coarse:min-h-11',
                    isActive
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  <Icon
                    className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-border p-3 text-[11px] font-mono text-muted-foreground">
        <span>Portfolio CMS v1.0</span>
      </div>
    </aside>
  );
}
