'use client';

import { usePathname } from 'next/navigation';
import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { logoutAction } from '@/lib/actions/auth';
import { adminNavItems } from './admin-sidebar';

type AdminTopbarProps = {
  onToggleSidebar: () => void;
  drawerOpen: boolean;
  userEmail?: string | null;
  ref?: React.Ref<HTMLButtonElement>;
};

export function AdminTopbar({
  onToggleSidebar,
  drawerOpen,
  userEmail,
  ref,
}: AdminTopbarProps) {
  const pathname = usePathname();

  // Longest match wins, so /admin/projects/new resolves to Projects rather
  // than to the Dashboard entry that every path starts with.
  const current = [...adminNavItems]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href)));

  return (
    <header className="border-border bg-card z-30 flex h-14 w-full shrink-0 items-center justify-between border-b px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          ref={ref}
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Buka menu navigasi"
          aria-expanded={drawerOpen}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-foreground hidden text-sm font-medium sm:inline-block">
          {current?.label ?? 'Dashboard'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {userEmail && (
          <span className="font-mono text-xs text-muted-foreground hidden md:inline-block">
            {userEmail}
          </span>
        )}

        <ThemeToggle />

        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive gap-1.5 text-xs pointer-coarse:min-w-11"
            title="Keluar dari akun admin"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
