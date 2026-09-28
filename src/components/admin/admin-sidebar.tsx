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
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground"
        >
          <span className="text-primary font-bold">#</span>
          <span>CMS Admin</span>
        </Link>
        <Link
          href="/"
          target="_blank"
          aria-label="Preview public website"
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Buka Website Publik"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {adminNavItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'relative flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-muted text-foreground font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r before:bg-primary'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-border p-3 text-[11px] font-mono text-muted-foreground">
        <span>Portfolio CMS v1.0</span>
      </div>
    </aside>
  );
}
