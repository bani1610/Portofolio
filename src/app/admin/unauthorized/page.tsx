import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/lib/actions/auth';

export default function AdminUnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="h-6 w-6" />
        </div>

        <p className="font-mono text-xs uppercase tracking-wider text-destructive font-semibold">
          403 · AKSES DITOLAK
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          Bukan Administrator
        </h1>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Akun Anda telah berhasil terotentikasi, namun akun ini tidak terdaftar di dalam tabel keanggotaan admin sistem.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <form action={logoutAction}>
            <Button type="submit" variant="outline" className="w-full sm:w-auto gap-2">
              <LogOut className="h-4 w-4" />
              <span>Keluar (Logout)</span>
            </Button>
          </form>

          <Button asChild className="w-full sm:w-auto gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span>Ke Halaman Utama</span>
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
