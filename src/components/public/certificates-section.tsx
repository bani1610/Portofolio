import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Award, ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/shared/reveal';
import { Section } from '@/components/layout/section';
import { SectionHeader } from '@/components/layout/section-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatMonthYear } from '@/lib/utils/date';
import type { Tables } from '@/lib/supabase/types';

type CertificatesSectionProps = {
  certificates: Tables<'certificates'>[];
  showAllLink?: boolean;
  /** Homepage shows a teaser; a dedicated page passes no limit. */
  limit?: number;
};

export function CertificatesSection({
  certificates,
  showAllLink = true,
  limit,
}: CertificatesSectionProps) {
  if (certificates.length === 0) return null;

  const visible = limit ? certificates.slice(0, limit) : certificates;

  return (
    <Section id="certificates" spacing="base" className="border-border/40 border-t">
      <div className="flex flex-col justify-between sm:flex-row sm:items-end">
        <SectionHeader
          index="05"
          label="CERTIFICATES"
          title="Sertifikasi & Lisensi"
          description="Sertifikasi profesional dan pencapaian kompetensi dalam bidang rekayasa teknologi."
          className="mb-6 sm:mb-8"
        />

        {showAllLink && certificates.length > 3 && (
          <div className="hidden sm:block mb-8">
            <Button asChild variant="ghost" className="gap-1.5 font-medium">
              <Link href="/certificates">
                <span>Selengkapnya</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Reveal
        stagger="cards"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((cert) => {
          const targetUrl = cert.credential_url || cert.certificate_file;
          const issueDateFormatted = formatMonthYear(cert.issue_date);

          return (
            <Card
              key={cert.id}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-foreground/20"
            >
              {/* Image 4:3 with object-contain (DESIGN.md §7.6) */}
              <div className="relative aspect-[4/3] w-full bg-muted/60 p-4">
                {cert.certificate_image ? (
                  <Image
                    src={cert.certificate_image}
                    alt={cert.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground/60">
                    <Award className="h-10 w-10 mb-2" />
                    <span className="font-mono text-xs">Credential</span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold tracking-[-0.01em] text-foreground line-clamp-2 md:text-lg">
                  {cert.title}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {cert.issuer}
                  {issueDateFormatted ? ` · ${issueDateFormatted}` : ''}
                </p>

                {cert.credential_id && (
                  <p className="mt-2 font-mono text-xs text-muted-foreground/75 truncate">
                    ID: {cert.credential_id}
                  </p>
                )}

                {targetUrl && (
                  <div className="mt-auto pt-4 border-t border-border/60">
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline focus:outline-none"
                    >
                      <span>Lihat Kredensial</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </Reveal>

      {showAllLink && certificates.length > 3 && (
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href="/certificates">
              <span>Lihat Semua Sertifikat</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </Section>
  );
}
