import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/shared/icons';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import type { Tables } from '@/lib/supabase/types';

type HeroSectionProps = {
  profile?: Tables<'profiles'> | null;
  socialLinks?: Tables<'social_links'>[];
};

export function HeroSection({ profile, socialLinks = [] }: HeroSectionProps) {
  const name = profile?.name || 'Sholahuddin Robbani';
  const headline = profile?.headline || 'Web Developer';
  const bio =
    profile?.bio ||
    'Membangun aplikasi web yang performan, modern, dan dirancang dengan struktur kode yang bersih.';

  const githubLink = socialLinks.find(
    (l) => l.platform.toLowerCase() === 'github'
  )?.url || 'https://github.com/bani1610';

  const linkedinLink = socialLinks.find(
    (l) => l.platform.toLowerCase() === 'linkedin'
  )?.url;

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32">
      <Container>
        <div className="flex flex-col-reverse items-center justify-between gap-12 lg:flex-row lg:gap-16">
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-mono text-muted-foreground mb-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Available for opportunities</span>
            </div>

            <h1 className="text-foreground text-4xl font-bold tracking-[-0.02em] leading-[1.05] sm:text-5xl md:text-6xl">
              Halo, saya{' '}
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
                {name}
              </span>
            </h1>

            <p className="mt-4 font-mono text-base font-medium text-primary sm:text-lg">
              {headline}
            </p>

            <p className="mt-4 max-w-[60ch] text-muted-foreground text-base leading-relaxed sm:text-lg">
              {bio}
            </p>

            {/* CTAs — DESIGN.md §2.3: Only one primary button per viewport */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/projects" className="gap-2">
                  <span>Lihat Project Saya</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              {profile?.resume_url ? (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download CV</span>
                  </a>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Link href="/contact" className="gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Hubungi Saya</span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-8 flex items-center justify-center gap-4 lg:justify-start">
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {linkedinLink && (
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              )}
              <Link
                href="/contact"
                aria-label="Email or Contact Form"
                className="rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Avatar Column */}
          <div className="relative flex-shrink-0">
            <div className="relative h-48 w-48 sm:h-64 sm:w-64 md:h-72 md:w-72 lg:h-80 lg:w-80 rounded-2xl overflow-hidden border-2 border-border bg-muted shadow-2xl">
              {profile?.profile_image ? (
                <Image
                  src={profile.profile_image}
                  alt={name}
                  fill
                  priority
                  sizes="(max-width: 640px) 192px, (max-width: 1024px) 288px, 320px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/40 font-mono text-muted-foreground">
                  <div className="text-5xl font-bold text-foreground/40 mb-2">
                    {name.charAt(0)}
                  </div>
                  <div className="text-xs uppercase tracking-widest opacity-60">
                    Portfolio
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
