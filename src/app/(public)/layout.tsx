import { SkipLink } from '@/components/layout/skip-link';
import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';
import { getProfile, getVisibleSocialLinks } from '@/lib/queries';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, socialLinks] = await Promise.all([
    getProfile(),
    getVisibleSocialLinks(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors selection:bg-primary/20 selection:text-primary">
      <SkipLink />
      <PublicNavbar />
      <main id="main-content" className="flex-1 focus:outline-none">
        {children}
      </main>
      <PublicFooter profile={profile} socialLinks={socialLinks} />
    </div>
  );
}
