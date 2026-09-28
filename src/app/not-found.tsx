import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <Container width="prose">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          404 · NOT FOUND
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          Halaman yang Anda tuju mungkin telah dipindahkan, dihapus, atau alamat URL yang Anda masukkan keliru.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
