'use client';

import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { logoutAction } from '@/lib/actions/auth';

type AdminTopbarProps = {
  onToggleSidebar: () => void;
  userEmail?: string | null;
};

export function AdminTopbar({ onToggleSidebar, userEmail }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground hidden sm:inline-block">
          Dashboard
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
            className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
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
