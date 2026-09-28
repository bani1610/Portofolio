'use client';

import * as React from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminTopbar } from './admin-topbar';

type AdminShellProps = {
  userEmail?: string | null;
  children: React.ReactNode;
};

export function AdminShell({ userEmail, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar (Fixed 240px, visible on >= 1024px) */}
      <div className="hidden lg:block lg:shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer content */}
          <div className="relative z-10 w-[260px] shadow-2xl animate-in slide-in-from-left duration-200">
            <AdminSidebar onItemClick={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar
          onToggleSidebar={() => setDrawerOpen(!drawerOpen)}
          userEmail={userEmail}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-[1100px] space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
