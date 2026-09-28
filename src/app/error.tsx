'use client';

import * as React from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Container width="prose">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-destructive">
          500 · ERROR
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Terjadi Kesalahan
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Mohon maaf, sistem mengalami kendala yang tidak terduga saat memproses halaman ini.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => reset()} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            <span>Coba Lagi</span>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              <span>Beranda</span>
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
