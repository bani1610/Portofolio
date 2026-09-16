# Personal Portfolio — Sholahuddin Robbani

Portfolio personal seorang Web Developer, dibangun sebagai **CMS-first portfolio**: seluruh konten (project, pengalaman, sertifikat, skill, pendidikan) berasal dari database dan dikelola lewat admin dashboard, bukan lewat array yang di-hard-code di source code.

Website terdiri dari dua sisi:

| Sisi | Akses | Fungsi |
|---|---|---|
| **Public** | Siapa saja | Hero, About, Projects, Experience, Certificates, Skills, Education, Achievements, Contact |
| **Admin** | Pemilik portfolio | CRUD seluruh konten, upload gambar/file, publish/unpublish, featured |

---

## Dokumentasi

Tiga dokumen berikut adalah sumber kebenaran project ini. Baca sebelum mengubah kode:

| Dokumen | Isi |
|---|---|
| [PRD.md](PRD.md) | Kebutuhan produk, information architecture, skema database, acceptance criteria |
| [DESIGN.md](DESIGN.md) | Design token, visual language, spesifikasi komponen, aturan aksesibilitas |
| [IMPLEMENTATION.md](IMPLEMENTATION.md) | Urutan fase pengerjaan, keputusan teknis yang dikunci, exit criteria per fase |

Jika implementasi butuh nilai yang berbeda dari yang tertulis di dokumen, ubah dokumennya lebih dulu — supaya tidak ada dua sumber kebenaran.

---

## Tech Stack

```text
Next.js 16 (App Router, Turbopack, Cache Components)
React 19
TypeScript (strict)
Tailwind CSS v4 (CSS-first, @theme)
shadcn/ui + lucide-react
Supabase (PostgreSQL + Auth + Storage)
Vercel
```

Keputusan teknis lengkap beserta alasannya ada di [IMPLEMENTATION.md §2](IMPLEMENTATION.md).

---

## Menjalankan Secara Lokal

**Prasyarat:** Node.js 20+ dan pnpm 11+.

```bash
pnpm install
pnpm dev
```

Buka <http://localhost:3000>.

### Environment Variable

Salin `.env.example` menjadi `.env.local`, lalu isi dengan kredensial project Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

`.env*` tidak masuk version control. Service role key tidak pernah dipakai di sisi client — seluruh proteksi data bertumpu pada Row Level Security.

---

## Script

| Perintah | Fungsi |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Menjalankan hasil build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | Prettier — menulis perubahan |
| `pnpm format:check` | Prettier — hanya memeriksa |
| `pnpm check:contrast` | Verifikasi kontras token warna terhadap DESIGN.md §2.4 |
| `bash supabase/tests/run.sh` | Uji migrasi + RLS + seed di Postgres sekali pakai (butuh Docker) |

---

## Struktur Folder Target

```text
portifolio/
├── PRD.md · DESIGN.md · IMPLEMENTATION.md
├── supabase/              # lihat supabase/README.md
│   ├── migrations/        # skema sebagai file SQL, bukan lewat dashboard
│   ├── tests/             # bukti RLS bekerja, dijalankan di container
│   └── seed.sql
└── src/
    ├── app/
    │   ├── (public)/      # layout publik: navbar + footer
    │   ├── admin/         # login + (dashboard)
    │   ├── sitemap.ts · robots.ts · opengraph-image.tsx
    │   └── globals.css
    ├── components/        # ui (shadcn) · layout · public · admin · shared
    ├── lib/               # supabase · queries · actions · validations · utils
    └── proxy.ts           # proteksi route /admin/* (bukan middleware.ts)
```

Route group `(public)` dan `(dashboard)` dipakai agar dua shell layout yang berbeda tidak saling bocor, tanpa menambah segmen pada URL.

---

## Catatan Arsitektur

Tiga hal yang paling mudah salah jika tidak dibaca lebih dulu:

**1. Caching bersifat eksplisit.**
`cacheComponents: true` aktif di `next.config.ts`, artinya data fetching dinamis secara default. Caching dinyatakan lewat `use cache` + `cacheTag` pada modul query, dan setiap Server Action admin wajib memanggil `updateTag()` pada entitas terdampak. Tanpa itu, perubahan di admin tidak akan muncul di website publik — melanggar acceptance criteria PRD §40.

`updateTag` dipakai (bukan `revalidateTag`) supaya admin langsung melihat hasil editnya sendiri, bukan konten stale.

**2. Tema tidak memakai utility `dark:`.**
Pergantian tema dilakukan dengan menambah class `light` pada `<html>` (DESIGN.md §10), sedangkan `dark:` milik Tailwind mengikuti `prefers-color-scheme`. Keduanya tidak sinkron: visitor yang memilih light di perangkat ber-OS gelap akan tetap kena aturan `dark:`. Semua warna karena itu melalui token di `globals.css` — utility `dark:` sudah dihapus dari komponen shadcn dan tidak boleh ditambahkan kembali.

**3. Otorisasi ada di database, bukan di aplikasi.**
Admin ditentukan oleh keanggotaan tabel `admin_users` yang diperiksa fungsi SQL `is_admin()`, dan seluruh policy RLS memanggil fungsi tersebut. Pengecekan di `proxy.ts` hanya lapisan optimistik untuk UX — bukan satu-satunya pertahanan.

Registrasi publik dimatikan; akun admin dibuat manual sekali lewat dashboard Supabase.

---

## Status Pengerjaan

Mengikuti fase di [IMPLEMENTATION.md §8](IMPLEMENTATION.md):

| Fase | Deliverable | Status |
|---|---|---|
| 0 | Repo hygiene & scaffold Next.js | ✅ selesai |
| 1 | Supabase: schema, RLS, storage | 🟡 SQL selesai & teruji, belum diterapkan ke project Supabase |
| 2 | Data layer & seed | 🟡 `seed.sql` selesai; client & query layer belum |
| 3 | Design system (token, shadcn, theme) | ✅ selesai |
| 4 | Public website | ⬜ belum |
| 5 | Deploy pertama — portfolio LIVE | ⬜ belum |
| 6 | Autentikasi admin | ⬜ belum |
| 7 | Admin dashboard & CRUD | ⬜ belum |
| 8 | SEO — sitemap, OG, structured data | ⬜ belum |
| 9 | Polish, aksesibilitas, performa | ⬜ belum |

Titik paling menentukan adalah **Fase 5**: sejak saat itu portfolio sudah bisa dikirim ke recruiter, dan seluruh pekerjaan setelahnya bersifat meningkatkan.

---

## Target Kualitas

Lighthouse **≥ 90** pada keempat kategori (Performance, Accessibility, SEO, Best Practices), diukur pada profil **mobile** — lebih ketat daripada desktop.

Responsif dan bebas horizontal scroll pada 375px, 768px, 1024px, dan 1440px.

---

## Lisensi

Project personal. Kode boleh dijadikan referensi; konten (teks, gambar, sertifikat, CV) adalah milik pribadi dan tidak untuk digunakan ulang.
