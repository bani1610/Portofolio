'use client';

import * as React from 'react';
import { AdminSidebar } from './admin-sidebar';
import { AdminTopbar } from './admin-topbar';
import { Toaster } from '@/components/ui/sonner';

type AdminShellProps = {
  userEmail?: string | null;
  children: React.ReactNode;
};

export function AdminShell({ userEmail, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  /**
   * Escape closes the drawer and hands focus back to the button that
   * opened it (DESIGN.md 13). Without this the drawer is a keyboard trap:
   * it can be opened with Enter and then only closed with a mouse.
   */
  React.useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  return (
    <div className="bg-background text-foreground flex h-dvh w-full overflow-hidden">
      {/* Desktop Sidebar (Fixed 240px, visible on >= 1024px) */}
      <div className="hidden lg:block lg:shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigasi admin"
          className="fixed inset-0 z-50 flex lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="bg-background/80 fixed inset-0 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer content */}
          <div className="animate-in slide-in-from-left relative z-10 w-[260px] max-w-[85vw] shadow-2xl duration-200">
            <AdminSidebar onItemClick={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar
          ref={triggerRef}
          onToggleSidebar={() => setDrawerOpen((open) => !open)}
          drawerOpen={drawerOpen}
          userEmail={userEmail}
        />
        {/*
          The page's own scroll container. A form's sticky action bar
          anchors to the bottom of this box, so the padding lives on an
          inner wrapper: on the scroller itself, the bottom padding would
          sit under the bar and the last field would hide behind it.
        */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1040px] px-4 py-4 md:px-6 md:py-6">
            {children}
          </div>
        </main>
      </div>

      {/*
        Top-right, not bottom-right: the forms pin their Batal and Simpan
        to the bottom of the page, and a bottom toast lands on top of them.
        On a phone it covered Simpan outright, so the message about a
        failed save hid the button you press to retry it.
      */}
      <Toaster position="top-right" />
    </div>
  );
}
