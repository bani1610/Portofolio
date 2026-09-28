'use client';

import Link from 'next/link';
import { Container } from './container';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/shared/icons';
import type { Tables } from '@/lib/supabase/types';

type PublicFooterProps = {
  socialLinks?: Tables<'social_links'>[];
  profile?: Tables<'profiles'> | null;
};

const iconMap: Record<string, React.ReactNode> = {
  github: <GithubIcon className="h-4 w-4" />,
  linkedin: <LinkedinIcon className="h-4 w-4" />,
  twitter: <TwitterIcon className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
};

export function PublicFooter({ socialLinks = [], profile }: PublicFooterProps) {
  const currentYear = 2026;

  return (
    <footer className="mt-auto border-t border-border bg-background transition-colors">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <h3 className="font-mono text-base font-semibold tracking-tight text-foreground">
              {profile?.name || 'Sholahuddin Robbani'}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[32ch] leading-relaxed">
              {profile?.headline ||
                'Web Developer yang berfokus pada pembuatan aplikasi web performan, fungsional, dan ramah pengguna.'}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Navigasi
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/experience"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Experience
                </Link>
              </li>
              <li>
                <Link
                  href="/skills"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skills
                </Link>
              </li>
              <li>
                <Link
                  href="/certificates"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Certificates
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Connect / Social */}
          <div className="space-y-3">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Tautan & Sosial
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => {
                  const iconKey = (link.icon || link.platform).toLowerCase();
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      {iconMap[iconKey] || <span className="font-mono text-xs">↗</span>}
                      <span>{link.platform}</span>
                    </a>
                  );
                })
              ) : (
                <div className="flex gap-3">
                  <a
                    href="https://github.com/bani1610"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} {profile?.name || 'Sholahuddin Robbani'}. All rights reserved.</p>
          <p className="font-mono">Built with Next.js 16 & Supabase</p>
        </div>
      </Container>
    </footer>
  );
}
