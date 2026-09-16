# IMPLEMENTATION PLAN — Personal Portfolio Website

**Version:** 1.0
**Companion to:** [PRD.md](PRD.md) · [DESIGN.md](DESIGN.md)
**Owner:** Sholahuddin Robbani

Dokumen ini adalah rencana kerja untuk mengimplementasikan PRD. Urutannya sengaja tidak sama dengan urutan bab di PRD — PRD menjelaskan *apa*, dokumen ini menjelaskan *dalam urutan apa* dan *mengapa urutan itu*.

---

## 1. Strategi Urutan

Ada dua urutan yang masuk akal, dan pilihannya berpengaruh besar terhadap risiko:

**Opsi A — Admin dulu, public belakangan.**
Bangun CMS lengkap, baru render halaman publik. Risikonya: butuh waktu lama sebelum ada sesuatu yang bisa dilihat, dan jika waktu habis di tengah jalan, yang ada hanyalah CMS tanpa portfolio — persis kebalikan dari yang dibutuhkan recruiter.

**Opsi B — Schema + seed SQL → public → admin.** ← **dipilih**
Isi database lewat SQL seed terlebih dahulu, bangun seluruh halaman publik di atas data nyata, baru kemudian bangun admin yang menggantikan proses seeding manual.

Alasan memilih B:

1. **Portfolio hidup lebih cepat.** Setelah Fase 5 sudah ada website yang bisa dikirim ke recruiter. Admin memperbaiki *cara mengelola*, bukan *apakah ada yang bisa dilihat*.
2. **Schema tervalidasi sebelum 7 form dibuat.** Kalau ternyata `projects` kurang satu kolom, jauh lebih murah ketahuan saat merender halaman detail daripada setelah form CRUD-nya jadi.
3. **Degradasi yang aman.** Jika pengerjaan terhenti di tengah, hasilnya adalah portfolio berfungsi penuh yang kontennya diedit via SQL — bukan aplikasi setengah jadi.

Seed SQL di Fase 2 bukan pekerjaan terbuang: file itu tetap dipakai untuk mengisi database lokal/staging setelah admin selesai.

**Yang tetap dikerjakan lebih awal:** autentikasi dan RLS. Keduanya menyentuh setiap query, jadi memasangnya belakangan berarti membongkar ulang data layer.

---

## 2. Keputusan Teknis yang Dikunci

| Area | Keputusan | Alasan |
|---|---|---|
| Package manager | **pnpm** | Sudah terpasang (v11.2.2), disk-efficient, lockfile deterministik |
| Framework | **Next.js 16.3.5** App Router + Turbopack | Sesuai PRD §5 |
| Bahasa | **TypeScript strict** | `strict: true` sejak awal; menambahkannya belakangan selalu menyakitkan |
| Styling | **Tailwind CSS v4** (CSS-first, `@theme`) | Token DESIGN.md dipasang sebagai CSS variable, satu sumber kebenaran |
| Komponen | **shadcn/ui** (copy-in, bukan dependency) | Sesuai PRD §5; komponen bisa diubah mengikuti DESIGN.md |
| Ikon | **lucide-react**, impor per-ikon | Menghindari bundle seluruh paket |
| Database & Auth | **Supabase** (`@supabase/ssr`) | Sesuai PRD §5 |
| Form & validasi | **react-hook-form + zod** | Skema zod dipakai ulang di client dan Server Action — validasi tidak ditulis dua kali |
| Mutasi data | **Server Actions**, bukan route handler | Lebih ringkas, dan invalidasi cache bisa dipanggil langsung setelah mutasi |
| Rendering publik | **Cache Components** (`cacheComponents: true`) + `use cache` + `cacheTag` | Lihat catatan di bawah |
| Proteksi route | **`proxy.ts`** (bukan `middleware.ts`) + pengecekan di data layer | `middleware` deprecated di Next 16 |
| Deploy | **Vercel** | Sesuai PRD §5 |

### Catatan penting soal caching (disesuaikan dengan Next.js 16)

PRD §40 mensyaratkan perubahan di admin langsung muncul di website publik **tanpa redeploy**. Ini tidak otomatis — konten yang di-cache akan tetap disajikan sampai di-invalidate.

Next.js 16 memperkenalkan **Cache Components**, yang mengubah model caching secara mendasar dibanding versi sebelumnya:

* **Data fetching sekarang dinamis secara default.** Tidak ada lagi caching implisit yang harus di-opt-out.
* Caching dinyatakan secara eksplisit lewat direktif `use cache` pada fungsi atau komponen.
* `cacheComponents: true` sekaligus mengaktifkan **Partial Prerendering** sebagai perilaku default — halaman dikirim sebagai shell statis, bagian dinamis di-stream menyusul.

Model yang dipakai project ini:

```ts
// lib/queries/projects.ts
export async function getPublishedProjects() {
  'use cache';
  cacheLife('max');          // konten CMS jarang berubah
  cacheTag('projects');      // invalidasi lewat tag, bukan path
  return supabase.from('projects').select(...);
}
```

```ts
// lib/actions/projects.ts
'use server';
export async function updateProject(...) {
  // ...tulis ke database
  updateTag('projects');     // admin langsung melihat perubahannya
}
```

Dua keputusan penting di sini:

1. **Tag, bukan path.** Dokumentasi Next 16 secara eksplisit merekomendasikan `cacheTag`/`revalidateTag` di atas `revalidatePath`, karena lebih presisi dan tidak melakukan over-invalidation. Rencana awal yang memakai `revalidatePath` di setiap action diganti dengan tag per entitas.

2. **`updateTag`, bukan `revalidateTag`, untuk mutasi dari admin.** Keduanya berbeda perilaku:

   | | `updateTag` | `revalidateTag` |
   |---|---|---|
   | Perilaku | Cache langsung kedaluwarsa | Stale-while-revalidate |
   | Cocok untuk | Admin melihat hasil editnya sendiri | Refresh di latar belakang |

   Untuk CMS, admin harus langsung melihat perubahannya setelah menyimpan — kalau masih melihat konten lama, itu terbaca sebagai bug. Karena itu `updateTag` yang dipakai di Server Action admin.

`cacheLife('max')` dipilih karena konten portfolio jarang berubah: tidak ada gunanya revalidasi berbasis waktu ketika satu-satunya sumber perubahan adalah admin, dan setiap perubahan itu sudah memicu invalidasi lewat tag.

---

## 3. Gap PRD yang Harus Diselesaikan Sebelum Koding

Saat menurunkan skema dari PRD, ada lima ketidaksesuaian yang akan menghambat implementasi kalau tidak diputuskan lebih dulu. Semuanya perlu update ke PRD.md §24.

### 3.1 `skills` dan `technologies` sebenarnya entitas yang sama

PRD §10 mendefinisikan Skill: `name`, `category`, `icon`, `order`, `visible`.
PRD §24 mendefinisikan `technologies`: `id`, `name`, `category`, `icon`.

Keduanya nyaris identik, dan isinya juga tumpang tindih (React, Laravel, PostgreSQL muncul di dua tempat). Membuat dua tabel terpisah berarti "React" harus ditulis dua kali dan bisa tidak sinkron.

**Resolusi:** satu tabel `technologies` yang melayani keduanya — ditampilkan di section Skills, sekaligus dipakai sebagai tag project lewat `project_technologies`. Tambahkan kolom:

```text
display_order   → urutan tampil (PRD §10 "Order")
visible         → tampil/tidak di section Skills (PRD §10 "Visible")
```

Konsekuensi yang perlu disadari: sebuah teknologi bisa dipakai sebagai tag project tanpa muncul di Skills (`visible = false`). Ini justru berguna — tag teknis minor tidak perlu mengotori daftar skill.

### 3.2 `projects` kekurangan lima kolom yang dirender di §12

PRD §11 dan §12 menampilkan **Team**, **Features**, **Challenges**, **Solutions**, **Results** di halaman detail, tetapi skema §24 tidak memuatnya.

**Resolusi:** tambahkan ke `projects`:

```text
team          text        → mis. "Solo" / "Tim 4 orang"
features      text[]      → array, dirender sebagai list bercentang
challenges    text        → markdown/plain text
solutions     text
results       text
```

`features` memakai `text[]` (bukan teks satu blok) karena DESIGN.md §15 merendernya sebagai daftar ber-ikon, dan array membuat tiap butir bisa distyle terpisah.

### 3.3 Tidak ada tabel untuk pesan contact form

PRD §17 menyediakan contact form, dan §39 menempatkan *email notification* di Phase 2. Artinya di MVP pesan harus disimpan — kalau tidak, form mengirim data ke mana pun tidak ada, dan pesan hilang.

**Resolusi:** tabel baru.

```text
contact_messages
  id, name, email, subject, message, read, created_at
```

Ditambah halaman admin `/admin/messages` sederhana (daftar + tandai sudah dibaca + hapus). RLS: publik boleh `INSERT`, hanya admin boleh `SELECT`.

### 3.4 Rute `/admin/settings` tidak punya tabel

PRD §6 mencantumkan `/settings` di IA admin, tetapi tidak ada tabel pendukung.

**Resolusi:** tabel `site_settings` baris tunggal untuk SEO default dan metadata global.

```text
site_settings
  id, site_title, site_description, og_image, resume_url, updated_at
```

### 3.5 Bagaimana sistem tahu siapa admin

PRD §23 menyatakan hanya akun terdaftar sebagai admin yang boleh masuk, tetapi tidak menjelaskan mekanismenya.

**Resolusi:** tabel `admin_users` berisi `user_id` yang mereferensikan `auth.users`, plus fungsi SQL `is_admin()` yang dipakai di seluruh policy RLS. Pendekatan ini dipilih ketimbang mencocokkan email dengan environment variable, karena policy RLS tidak bisa membaca env — pengecekan harus ada di dalam database.

Registrasi publik dimatikan di dashboard Supabase; akun admin dibuat manual sekali.

---

## 4. Fase Implementasi

Setiap fase punya **exit criteria** — jangan lanjut sebelum terpenuhi, karena fase berikutnya bergantung padanya.

---

### Fase 0 — Repo Hygiene & Scaffold

Repo saat ini masih menyimpan 291 file project YOLO lama dalam status deleted dan belum ada remote.

**Tugas:**

1. Commit penghapusan project lama sebagai satu commit bersih (`chore: remove legacy YOLO project`). Riwayatnya tetap ada di git jika sewaktu-waktu diperlukan.
2. Commit `PRD.md`, `DESIGN.md`, `IMPLEMENTATION.md`.
3. Scaffold Next.js di root: TypeScript, Tailwind, App Router, alias `@/*`, pnpm.
4. Aktifkan `strict: true` dan `noUncheckedIndexedAccess` di `tsconfig.json`.
5. `.gitignore`: pastikan `.env*.local`, `.next`, `node_modules`, `.vercel` masuk.
6. Prettier + ESLint, plus `prettier-plugin-tailwindcss` agar urutan class konsisten.
7. Buat repo GitHub dan push.

**Exit criteria:** `pnpm dev` jalan, `pnpm build` sukses, repo ter-push, halaman default tampil.

---

### Fase 1 — Supabase: Schema, RLS, Storage

Fase paling menentukan. Kesalahan di sini menjalar ke semua fase lain.

**Tugas:**

1. Buat project Supabase (region **Singapore** — terdekat dari Indonesia, latensi paling rendah).
2. Tulis migrasi SQL sebagai file di `supabase/migrations/`, **bukan** lewat editor dashboard. Skema harus bisa direproduksi dan masuk version control.
3. Tabel sesuai PRD §24 plus resolusi Bagian 3 di atas:

   ```text
   admin_users        profiles           technologies
   projects           project_technologies   project_images
   experiences        certificates       education
   achievements       social_links       contact_messages
   site_settings
   ```

4. Constraint yang wajib dipasang sejak awal:

   ```sql
   slug           unique not null
   category       check (category in ('web','ai','data','other'))
   published      not null default false   -- default draft, bukan published
   featured       not null default false
   display_order  not null default 0
   foreign key    on delete cascade        -- project_images, project_technologies
   ```

   `published` default `false` disengaja: konten baru tidak boleh bocor ke publik sebelum sengaja di-publish.

5. Fungsi `is_admin()` + aktifkan RLS di **semua** tabel.
6. Policy per tabel:

   ```text
   Publik : SELECT where published = true
   Admin  : SELECT / INSERT / UPDATE / DELETE penuh
   contact_messages : publik INSERT saja, admin SELECT/DELETE
   ```

   Tabel tanpa kolom `published` (`technologies`, `social_links`) memakai `visible` dengan pola sama.

7. Storage bucket sesuai PRD §22, semuanya public-read + write khusus admin, dengan batas ukuran dan MIME type di level policy — bukan hanya validasi di frontend.
8. Trigger `updated_at` otomatis.
9. Buat akun admin, masukkan `user_id`-nya ke `admin_users`, matikan signup publik.

**Exit criteria:** RLS terbukti bekerja — query dengan anon key hanya mengembalikan baris published; percobaan `INSERT` sebagai anon ditolak. **Uji ini secara eksplisit**, jangan diasumsikan.

---

### Fase 2 — Data Layer & Seed

**Tugas:**

1. Generate tipe TypeScript dari schema (`supabase gen types`), simpan di `lib/supabase/types.ts`, tambahkan script `pnpm db:types`.
2. Buat tiga client: browser, server (RSC), dan proxy — memakai `@supabase/ssr`.
3. Modul query per entitas di `lib/queries/` (`getPublishedProjects`, `getProjectBySlug`, dst.). Komponen tidak pernah memanggil Supabase langsung; semua lewat modul ini, sehingga perubahan skema terlokalisasi.
4. Skema zod per entitas di `lib/validations/` — dipakai bersama oleh form dan Server Action.
5. Tulis `supabase/seed.sql` berisi konten nyata dari PRD §41: 7 project, 3 experience, 18 technology, education, sertifikat, social links.

**Exit criteria:** seed berhasil dijalankan, query modul mengembalikan data dengan tipe yang benar.

---

### Fase 3 — Design System

Menerapkan DESIGN.md sebelum komponen apa pun dibuat, supaya tidak ada warna atau spacing hard-code yang harus dibersihkan belakangan.

**Tugas:**

1. Token OKLCH dark + light ke `globals.css` via `@theme` (DESIGN.md §2).
2. Font Inter + JetBrains Mono lewat `next/font/google`.
3. Theme provider + skrip inline anti-flash di `<head>` (DESIGN.md §10).
4. `pnpm dlx shadcn@latest init`, lalu tambahkan komponen yang dipakai: button, input, textarea, label, select, switch, dialog, dropdown-menu, table, badge, card, sonner, form, tabs.
5. Sesuaikan varian shadcn dengan spesifikasi DESIGN.md §7.2 (ukuran, radius, tanpa efek `scale` saat hover).
6. Primitif layout: `Container`, `Section`, `SectionHeader`.
7. Utility bersama: format tanggal (dengan dukungan **Present**), `cn()`, slugify.
8. **Verifikasi kontras** semua pasangan warna terhadap DESIGN.md §2.4.

**Exit criteria:** halaman contoh menampilkan seluruh komponen di dark dan light mode tanpa flash saat reload.

---

### Fase 4 — Public Website

Dibangun di atas data seed nyata. Semua Server Component kecuali yang disebut interaktif.

**Urutan pengerjaan:**

1. Root layout, navbar sticky + glass (client), footer, skip link.
2. Homepage — hero, about, featured projects, experience timeline, skills, certificates, education, contact (DESIGN.md §15).
3. `/projects` — grid, search + filter chip (client, state di URL searchParams supaya hasil filter bisa di-share dan tombol back berfungsi).
4. `/projects/[slug]` — `generateStaticParams`, seluruh section §12, galeri dari `project_images`, navigasi prev/next, `notFound()` untuk slug tidak dikenal.
5. Halaman `/about`, `/experience`, `/certificates`, `/skills`, `/education`, `/contact`.
6. Contact form (client) + Server Action yang menulis ke `contact_messages`, dengan honeypot dan rate limit sederhana per IP.
7. Empty state dan loading state untuk setiap daftar.
8. `error.tsx` dan `not-found.tsx`.

**Exit criteria:** seluruh halaman render dari database, responsif di 375/768/1024/1440px, tanpa horizontal scroll, `pnpm build` sukses.

---

### Fase 5 — Deploy Pertama

Sengaja ditempatkan sebelum admin: portfolio sudah bisa dipakai, dan masalah deploy ketahuan saat kode masih sederhana.

**Tugas:** hubungkan repo ke Vercel, set environment variable, deploy, uji di perangkat nyata, jalankan Lighthouse sebagai baseline.

**Exit criteria:** website publik live dan bisa diakses.

---

### Fase 6 — Autentikasi Admin

**Tugas:**

1. `/admin/login` — form email + password, pesan error yang tidak membocorkan apakah email terdaftar.
2. `proxy.ts`: refresh session, lindungi seluruh `/admin/*`, redirect ke login beserta parameter `redirectTo`.
   Proxy hanyalah pemeriksaan optimistik — dokumentasi Next 16 menegaskan ini tidak boleh menjadi satu-satunya lapis pertahanan. Pengecekan sesungguhnya tetap berada di data layer dan RLS.
3. Verifikasi keanggotaan `admin_users` — login berhasil tapi bukan admin harus ditolak dan di-sign out.
4. Logout, dan halaman `/admin/unauthorized`.

**Exit criteria:** `/admin/*` tidak bisa diakses tanpa login; diuji dengan akses URL langsung, bukan hanya lewat navigasi UI.

---

### Fase 7 — Admin Dashboard & CRUD

**Tugas:**

1. Shell admin: sidebar + topbar, drawer di bawah 1024px (DESIGN.md §8.1).
2. Dashboard: stat card + aktivitas terbaru.
3. Komponen CRUD generik yang dipakai ulang: `DataTable`, `FormLayout`, `DeleteDialog`, `PublishToggle`, `ImageUploader`.
4. CRUD per entitas, **mulai dari Projects** karena paling kompleks — pola yang terbentuk di sini dipakai ulang oleh sisanya:

   ```text
   Projects  →  Experiences  →  Certificates  →  Technologies/Skills
             →  Education    →  Achievements  →  Social Links
             →  Profile      →  Messages      →  Settings
   ```

5. Form project mencakup: multi-select teknologi, editor array `features`, galeri multi-upload dengan reorder, auto-slug + preview URL.
6. Upload ke Supabase Storage dengan validasi ukuran/tipe, progress bar, dan **hapus file lama saat diganti** agar storage tidak menumpuk sampah.
7. Setiap Server Action memanggil `updateTag()` pada tag entitas terdampak (Bagian 2).
8. Toast sukses/gagal, konfirmasi hapus yang menyebut nama item.

**Exit criteria:** seluruh acceptance criteria admin di PRD §40 terpenuhi — termasuk yang paling menentukan: perubahan di admin muncul di website publik tanpa redeploy.

---

### Fase 8 — SEO

**Tugas:** metadata per halaman, `generateMetadata` dinamis untuk project detail, OG image (`opengraph-image.tsx`), `sitemap.ts` dinamis dari database, `robots.ts`, JSON-LD `Person` di homepage dan `CreativeWork` di detail project, canonical URL.

**Exit criteria:** sitemap memuat seluruh project published; preview OG benar saat link ditempel di LinkedIn/WhatsApp.

---

### Fase 9 — Polish, Aksesibilitas, Performa

**Tugas:**

1. Audit aksesibilitas terhadap DESIGN.md §13 — navigasi keyboard penuh, focus trap pada dialog dan menu mobile, hierarki heading, label form.
2. Lighthouse keempat kategori ≥ 90 pada mobile (PRD §31); mobile lebih ketat daripada desktop, jadi jadikan itu target.
3. Section reveal via IntersectionObserver + `prefers-reduced-motion` (DESIGN.md §9).
4. Periksa CLS: semua gambar punya dimensi eksplisit.
5. Analisis bundle; pastikan `"use client"` tidak menjalar ke komponen yang tidak perlu.
6. Uji lintas browser dan pada perangkat mobile nyata.

**Exit criteria:** seluruh checklist DESIGN.md §16 dan PRD §42 tercentang.

---

## 5. Struktur Folder Target

```text
portifolio/
├── PRD.md · DESIGN.md · IMPLEMENTATION.md
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── src/
    ├── app/
    │   ├── (public)/          # layout publik: navbar + footer
    │   │   ├── page.tsx
    │   │   ├── about/ projects/ experience/
    │   │   ├── certificates/ skills/ education/ contact/
    │   ├── admin/
    │   │   ├── login/
    │   │   └── (dashboard)/   # layout admin: sidebar + topbar
    │   ├── sitemap.ts · robots.ts · opengraph-image.tsx
    │   └── globals.css
    ├── components/
    │   ├── ui/                # shadcn
    │   ├── layout/ public/ admin/ shared/
    ├── lib/
    │   ├── supabase/          # client, server, proxy, types
    │   ├── queries/ actions/ validations/ utils/
    └── proxy.ts
```

Route group `(public)` dan `(dashboard)` dipakai agar dua shell layout yang berbeda tidak saling bocor, tanpa menambah segmen pada URL.

---

## 6. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Policy RLS salah → data draft bocor atau admin terkunci | Tinggi | Uji eksplisit dengan anon key di Fase 1 sebelum lanjut |
| Lupa invalidasi cache | Tinggi — melanggar PRD §40 | Pusatkan `cacheTag`/`updateTag` dalam helper per entitas, jangan ditulis ad-hoc di tiap action |
| Scope creep ke Phase 2 (blog, analytics) | Sedang | PRD §39 sudah tegas; tahan sampai MVP live |
| Lighthouse turun karena animasi/font | Sedang | Guardrail DESIGN.md §14; ukur di Fase 5 sebagai baseline, bukan hanya di akhir |
| File storage yatim setelah ganti gambar | Rendah | Hapus file lama di dalam action yang sama |
| Konten awal belum siap | Sedang | Seed dari PRD §41; screenshot project bisa menyusul |

---

## 7. Keputusan yang Sudah Diambil

| Topik | Keputusan | Status |
|---|---|---|
| Gap PRD Bagian 3 | Kelima resolusi diterapkan ke PRD.md | ✅ selesai |
| Region Supabase | Singapore | ✅ |
| Domain | Subdomain `.vercel.app` dulu | ✅ |
| Repo GitHub | Ditunda — kerjakan lokal dulu | ⏸ |
| Achievements | Masuk MVP: tabel + CRUD admin + tampilan publik kondisional (≥ 2 item published) | ✅ |

Konsekuensi penundaan repo terhadap Fase 0 dan Fase 5:

* Fase 0 tetap melakukan `git init` lokal dan commit — riwayat tetap
  terjaga, hanya `git push` yang ditunda.
* Fase 5 (deploy pertama) **membutuhkan** repo GitHub, karena Vercel
  melakukan deploy dari repository. Alternatifnya memakai `vercel deploy`
  dari CLI tanpa repo, tetapi kehilangan preview deployment otomatis.
  Keputusan repo perlu diambil paling lambat sebelum Fase 5.

---

## 8. Ringkasan Fase

```text
Fase 0  Repo & scaffold           → pnpm dev jalan
Fase 1  Supabase schema + RLS     → RLS terbukti aman
Fase 2  Data layer + seed         → query bertipe, data terisi
Fase 3  Design system             → token & komponen siap
Fase 4  Public website            → seluruh halaman dari database
Fase 5  Deploy pertama            → portfolio LIVE
Fase 6  Auth admin                → /admin terlindungi
Fase 7  Admin CRUD                → CMS berfungsi penuh
Fase 8  SEO                       → sitemap, OG, structured data
Fase 9  Polish & performa         → Lighthouse ≥ 90
```

Titik paling penting adalah **Fase 5** — sejak saat itu portfolio sudah bisa dikirim ke recruiter, dan seluruh pekerjaan setelahnya bersifat meningkatkan, bukan menentukan.
