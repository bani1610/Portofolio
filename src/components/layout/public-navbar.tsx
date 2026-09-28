'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Container } from './container';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/#about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
  { href: '/certificates', label: 'Certificates' },
  { href: '/contact', label: 'Contact' },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Close the drawer on route change, including browser back/forward.
  // Adjusting state during render rather than in an effect: an effect
  // would paint the new route with the drawer still open, then close it
  // on a second pass. React re-runs this component immediately instead,
  // before anything reaches the screen.
  const [drawerPathname, setDrawerPathname] = React.useState(pathname);
  if (pathname !== drawerPathname) {
    setDrawerPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-base font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          <span className="text-primary font-bold">{'>'}</span>
          <span>bani.dev</span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main Navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href) && item.href !== '/#about';

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground',
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="ml-3 pl-3 border-l border-border flex items-center">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Nav Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-50 bg-background/95 backdrop-blur-md md:hidden animate-in fade-in-20 duration-200">
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col gap-2 p-6"
          >
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href) && item.href !== '/#about';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'rounded-lg px-4 py-3 text-lg font-medium transition-colors',
                    isActive
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
