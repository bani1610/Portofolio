import { Container, Section, SectionHeader } from '@/components/layout';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDateRange } from '@/lib/utils';

/**
 * Design system preview — the Fase 3 exit criterion: every token and
 * component visible at once, in both themes, to check nothing is
 * unreadable before real pages are built on top.
 *
 * Not linked from anywhere and not part of the public IA (PRD §6).
 * Delete once the real pages exist.
 */
export const metadata = {
  title: 'Design Preview',
  robots: { index: false, follow: false },
};

const SWATCHES = [
  ['background', 'bg-background'],
  ['card', 'bg-card'],
  ['muted', 'bg-muted'],
  ['border', 'bg-border'],
  ['primary', 'bg-primary'],
  ['destructive', 'bg-destructive'],
  ['success', 'bg-success'],
  ['warning', 'bg-warning'],
] as const;

export default function DesignPreviewPage() {
  return (
    <main>
      <Section>
        <div className="mb-10 flex items-center justify-between">
          <SectionHeader
            index="00"
            label="Design System"
            title="Token & Component Preview"
            description="Setiap token dan komponen dirender sekaligus untuk diperiksa di dark dan light mode."
            className="mb-0"
          />
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {SWATCHES.map(([name, className]) => (
            <div key={name}>
              <div className={`border-border h-16 rounded-lg border ${className}`} />
              <p className="text-muted-foreground mt-2 font-mono text-xs">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-border border-t">
        <SectionHeader index="01" label="Typography" title="Type Scale" />
        <div className="space-y-6">
          <p className="text-4xl leading-[1.05] font-bold tracking-[-0.02em] md:text-[60px]">
            Hi, I&apos;m Sholahuddin Robbani
          </p>
          <h1 className="text-3xl font-bold tracking-[-0.02em] md:text-[40px]">
            H1 Halaman
          </h1>
          <h2 className="text-2xl font-semibold tracking-[-0.01em] md:text-[32px]">
            H2 Section
          </h2>
          <h3 className="text-lg font-semibold tracking-[-0.01em] md:text-xl">
            H3 Card Title
          </h3>
          <p className="max-w-[68ch] text-[17px] leading-[1.65] md:text-lg">
            Body large — dipakai untuk paragraf pembuka. Dibatasi 68ch agar baris tidak
            terlalu panjang untuk dibaca.
          </p>
          <p className="text-muted-foreground max-w-[68ch] text-[15px] leading-[1.6] md:text-base">
            Body reguler dengan warna muted-foreground untuk teks sekunder.
          </p>
          <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.08em] uppercase">
            01 — Mono Label
          </p>
        </div>
      </Section>

      <Section className="border-border border-t">
        <SectionHeader index="02" label="Buttons" title="Varian & Ukuran" />
        <div className="flex flex-wrap items-center gap-4">
          <Button size="lg">View My Projects</Button>
          <Button variant="outline" size="lg">
            Download CV
          </Button>
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete (admin)</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section className="border-border border-t">
        <SectionHeader index="03" label="Cards" title="Project & Chip" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Templas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                UI/UX &amp; Code Template Repository Platform
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Laravel', 'React', 'MySQL'].map((tech) => (
                  <span
                    key={tech}
                    className="bg-muted text-muted-foreground rounded-sm px-2 py-1 font-mono text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Badge (admin)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Published</Badge>
              <Badge variant="secondary">Draft</Badge>
              <Badge variant="outline">Featured</Badge>
              <Badge variant="destructive">Deleted</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-mono text-xs">
                {formatDateRange('2026-07-01', null, true)}
              </p>
              <p className="mt-2 font-semibold">Web Developer Intern</p>
              <p className="text-muted-foreground text-[15px]">Company Name</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section className="border-border border-t">
        <SectionHeader index="04" label="Form" title="Contact Form" />
        <Container width="prose" className="px-0">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preview-name">Name</Label>
              <Input id="preview-name" placeholder="Nama kamu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preview-email">Email</Label>
              <Input id="preview-email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preview-message">Message</Label>
              <Textarea id="preview-message" rows={4} placeholder="Pesan kamu" />
            </div>
            <Button>Send Message</Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
