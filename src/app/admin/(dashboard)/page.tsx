import Link from 'next/link';
import {
  FolderKanban,
  Briefcase,
  Cpu,
  Mail,
  ArrowRight,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const instant = false;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { data: projects },
    { data: experiences },
    { data: technologies },
    { data: messages },
  ] = await Promise.all([
    supabase.from('projects').select('id, title, published, featured, updated_at'),
    supabase.from('experiences').select('id, published'),
    supabase.from('technologies').select('id, visible'),
    supabase
      .from('contact_messages')
      .select('id, name, email, subject, read, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const totalProjects = projects?.length ?? 0;
  const publishedProjects = projects?.filter((p) => p.published).length ?? 0;

  const totalExperiences = experiences?.length ?? 0;
  const publishedExperiences = experiences?.filter((e) => e.published).length ?? 0;

  const totalSkills = technologies?.length ?? 0;

  const unreadMessagesCount = messages?.filter((m) => !m.read).length ?? 0;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Links */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan status konten dan metrik website portfolio Anda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
            <Link href="/" target="_blank">
              <span>Lihat Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button asChild size="sm" className="gap-1.5 text-xs">
            <Link href="/admin/projects/new">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Project</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stat Cards (DESIGN.md §8.2) */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Projects Card */}
        <Link href="/admin/projects" className="group">
          <Card className="rounded-xl border border-border bg-card p-5 transition-colors group-hover:border-foreground/20">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Projects
              </span>
              <FolderKanban className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-semibold tabular-nums text-foreground">
              {totalProjects}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {publishedProjects} diterbitkan
            </p>
          </Card>
        </Link>

        {/* Experience Card */}
        <Link href="/admin/experiences" className="group">
          <Card className="rounded-xl border border-border bg-card p-5 transition-colors group-hover:border-foreground/20">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Experience
              </span>
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-semibold tabular-nums text-foreground">
              {totalExperiences}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {publishedExperiences} diterbitkan
            </p>
          </Card>
        </Link>

        {/* Skills Card */}
        <Link href="/admin/skills" className="group">
          <Card className="rounded-xl border border-border bg-card p-5 transition-colors group-hover:border-foreground/20">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Skills & Tech
              </span>
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-semibold tabular-nums text-foreground">
              {totalSkills}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">teknologi terdaftar</p>
          </Card>
        </Link>

        {/* Messages Card */}
        <Link href="/admin/messages" className="group">
          <Card className="rounded-xl border border-border bg-card p-5 transition-colors group-hover:border-foreground/20">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Pesan Masuk
              </span>
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-semibold tabular-nums text-foreground">
              {messages?.length ?? 0}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {unreadMessagesCount} belum dibaca
            </p>
          </Card>
        </Link>
      </div>

      {/* Recent Projects and Messages sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Projects Preview */}
        <Card className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Daftar Project Terkini
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <span>Semua</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {projects && projects.length > 0 ? (
              projects.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-foreground truncate">
                      {p.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={p.published ? 'default' : 'secondary'}
                      className="font-mono text-[10px] uppercase"
                    >
                      {p.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">
                Belum ada data project.
              </p>
            )}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Pesan Kontak Masuk
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <span>Semua</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {messages && messages.length > 0 ? (
              messages.map((m) => (
                <div key={m.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      {m.name}
                    </span>
                    {!m.read && (
                      <Badge variant="destructive" className="font-mono text-[10px]">
                        Baru
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {m.subject || m.email}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">
                Belum ada pesan yang masuk.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
