'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, Menu, X } from 'lucide-react';
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

type PublicNavbarProps = {
  /** From profiles.resume_url; the CV button is omitted when absent. */
  resumeUrl?: string | null;
};

export function PublicNavbar({ resumeUrl }: PublicNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

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

  // Transparent until scrolled, glass after (DESIGN.md 7.1).
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    // Run once: a reload partway down the page starts scrolled.
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isItemActive = (href: string) =>
    href.startsWith('/#') ? false : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-[height,background-color,border-color] duration-200',
        scrolled
          ? // backdrop-filter is confined to this one element (DESIGN.md 5):
            // it is expensive to render and spreading it costs Performance.
            'border-border bg-background/70 border-b backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container
        className={cn(
          'flex items-center justify-between transition-[height] duration-200',
          scrolled ? 'h-[60px]' : 'h-[72px]',
        )}
      >
        <Link
          href="/"
          className="text-foreground hover:text-primary flex items-center gap-2 font-mono text-base font-semibold tracking-tight transition-colors"
        >
          <span className="text-primary font-bold" aria-hidden="true">
            &gt;
          </span>
          <span>bani.dev</span>
        </Link>

        <nav
          aria-label="Main Navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => {
            const isActive = isItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? // The underline carries the same meaning as the colour,
                      // so the active item is not signalled by colour alone
                      // (DESIGN.md 13).
                      'text-foreground border-primary border-b-2 font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="border-border ml-3 flex items-center gap-2 border-l pl-3">
            <ThemeToggle />
            {resumeUrl && (
              <Button asChild variant="outline" size="sm">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>Download CV</span>
                </a>
              </Button>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation menu"
            className="text-foreground"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </Container>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="bg-background fixed inset-x-0 bottom-0 z-50 md:hidden"
          style={{ top: scrolled ? 60 : 72 }}
        >
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col gap-2 p-6"
          >
            {navItems.map((item) => {
              const isActive = isItemActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex min-h-11 items-center rounded-lg px-4 py-3 text-lg font-medium transition-colors',
                    isActive
                      ? 'bg-muted text-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {resumeUrl && (
              <Button asChild variant="outline" size="lg" className="mt-4 w-full">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>Download CV</span>
                </a>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
