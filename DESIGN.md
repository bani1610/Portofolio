# DESIGN — Personal Portfolio Website

**Version:** 1.0
**Companion to:** [PRD.md](PRD.md)
**Owner:** Sholahuddin Robbani
**Scope:** Design system, visual language, dan spesifikasi komponen untuk public website + admin dashboard.

Dokumen ini menerjemahkan arahan UI/UX pada PRD §33–§35 menjadi token, aturan, dan spesifikasi komponen yang bisa langsung diimplementasikan. Setiap nilai di sini adalah **keputusan**, bukan saran — jika implementasi butuh nilai lain, ubah dokumen ini terlebih dahulu agar tidak ada dua sumber kebenaran.

---

## 1. Design Principles

Lima prinsip yang dipakai untuk memutuskan setiap detail visual:

1. **Recruiter-first, bukan designer-first.**
   Recruiter melihat portfolio rata-rata di bawah 60 detik. Informasi harus terbaca tanpa interaksi. Efek visual tidak boleh menunda pembacaan konten.

2. **Konten yang jadi dekorasi.**
   Tidak ada ilustrasi atau ornamen dekoratif. Yang "menghias" halaman adalah screenshot project, logo perusahaan, dan gambar sertifikat — semuanya konten nyata dari CMS.

3. **Restraint dalam warna.**
   Satu warna aksen saja. Warna lain hanya dipakai untuk status semantik (success/danger) di admin. Portfolio yang memakai banyak warna terbaca sebagai latihan, bukan produk.

4. **Struktur lewat garis, bukan bayangan.**
   Pemisahan elemen memakai border 1px dan perbedaan background tipis. Shadow hampir tidak dipakai — ini yang membuat tampilan terasa "technical" dan bukan "template bisnis".

5. **Density yang konsisten.**
   Jarak antar elemen mengikuti skala yang sama di seluruh halaman. Ritme vertikal yang konsisten lebih memberi kesan profesional daripada layout yang ramai.

---

## 2. Design Tokens

Token ditulis dalam **OKLCH** dan dipasang sebagai CSS variable di `globals.css`, mengikuti konvensi shadcn/ui + Tailwind CSS v4. OKLCH dipilih karena perceptually uniform: mengubah lightness tidak mengubah persepsi hue, sehingga varian hover/active bisa diturunkan secara matematis.

### 2.1 Dark Mode (default)

```css
:root {
  --background:            oklch(0.145 0.006 285);  /* kanvas utama */
  --foreground:            oklch(0.960 0.002 285);  /* teks utama */

  --card:                  oklch(0.185 0.007 285);  /* permukaan naik 1 level */
  --card-foreground:       oklch(0.960 0.002 285);

  --muted:                 oklch(0.225 0.008 285);  /* chip, well, input bg */
  --muted-foreground:      oklch(0.660 0.012 285);  /* teks sekunder */

  --border:                oklch(0.275 0.009 285);  /* garis pemisah */
  --input:                 oklch(0.275 0.009 285);
  --ring:                  oklch(0.700 0.150 235);  /* focus ring */

  --primary:               oklch(0.700 0.150 235);  /* aksen tunggal */
  --primary-foreground:    oklch(0.145 0.006 285);  /* teks di atas primary */

  --destructive:           oklch(0.640 0.190 25);
  --success:               oklch(0.700 0.150 155);
  --warning:               oklch(0.780 0.140 85);
}
```

### 2.2 Light Mode

Bukan sekadar inversi. Pada light mode, `--card` dibuat **lebih terang** dari background agar hierarki permukaan tetap terbaca, dan `--primary` diturunkan lightness-nya agar kontras terhadap teks putih tetap lolos WCAG AA.

```css
.light {
  --background:            oklch(0.995 0.001 285);
  --foreground:            oklch(0.200 0.006 285);

  --card:                  oklch(1.000 0 0);
  --card-foreground:       oklch(0.200 0.006 285);

  --muted:                 oklch(0.965 0.003 285);
  --muted-foreground:      oklch(0.500 0.012 285);

  --border:                oklch(0.915 0.004 285);
  --input:                 oklch(0.915 0.004 285);
  --ring:                  oklch(0.545 0.170 245);

  --primary:               oklch(0.545 0.170 245);
  --primary-foreground:    oklch(0.995 0.001 285);

  --destructive:           oklch(0.560 0.200 25);
  --success:               oklch(0.520 0.140 155);
  --warning:               oklch(0.620 0.140 75);
}
```

### 2.3 Aturan pemakaian warna

| Token | Dipakai untuk | Jangan dipakai untuk |
|---|---|---|
| `primary` | CTA utama, link aktif, focus ring, garis aktif tab | Background section, teks paragraf panjang |
| `muted` | Background chip teknologi, input, skeleton | Teks |
| `muted-foreground` | Tanggal, metadata, label form, deskripsi sekunder | Teks utama, isi paragraf |
| `border` | Garis card, divider, outline input | Teks, background |
| `success` / `destructive` / `warning` | **Hanya di admin** (badge status, konfirmasi hapus) | Public website |

**Satu CTA primary per viewport.** Pada hero ada dua tombol: `View My Projects` (primary) dan `Download CV` (outline). Tidak boleh keduanya primary — pilihan yang ditonjolkan harus tunggal.

### 2.4 Kontras (wajib diverifikasi)

Target PRD Lighthouse Accessibility ≥ 90 tidak tercapai tanpa ini:

| Pasangan | Rasio minimum | Berlaku untuk |
|---|---|---|
| `foreground` / `background` | 4.5:1 | Semua teks body |
| `muted-foreground` / `background` | 4.5:1 | Metadata, tanggal, caption |
| `primary-foreground` / `primary` | 4.5:1 | Teks di dalam tombol |
| `border` / `background` | 3:1 | Outline input dan kontrol interaktif |
| `ring` / `background` | 3:1 | Focus indicator |

Nilai di §2.1 dan §2.2 sudah dipilih untuk lolos ambang ini. Setiap kali token warna diubah, verifikasi ulang sebelum merge.

---

## 3. Typography

### 3.1 Font

```text
Sans   : Inter        → seluruh UI, heading, body
Mono   : JetBrains Mono → aksen teknis
```

Keduanya dimuat via `next/font/google` dengan `display: 'swap'` dan subset `latin`, sehingga self-hosted otomatis — tidak ada request ke domain pihak ketiga (mendukung target Performance dan Best Practices).

**Monospace dipakai secara selektif** (PRD §33 "monospace accent"), hanya untuk:

* Nama teknologi pada chip (`Laravel`, `PostgreSQL`)
* Label section kecil di atas heading (`01 — PROJECTS`)
* Tanggal pada timeline experience
* Credential ID sertifikat
* Angka statistik di dashboard admin

Monospace **tidak** dipakai untuk heading besar atau paragraf — mengurangi keterbacaan dan membuat halaman terasa seperti terminal, bukan portfolio profesional.

### 3.2 Type Scale

Skala 1.25 (major third), dibulatkan ke kelipatan yang nyaman:

| Peran | Mobile | Desktop | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Hero headline | 36px | 60px | 700 | -0.02em | 1.05 |
| H1 halaman | 30px | 40px | 700 | -0.02em | 1.15 |
| H2 section | 24px | 32px | 600 | -0.01em | 1.2 |
| H3 card title | 18px | 20px | 600 | -0.01em | 1.3 |
| Body large | 17px | 18px | 400 | 0 | 1.65 |
| Body | 15px | 16px | 400 | 0 | 1.6 |
| Small / meta | 13px | 14px | 400 | 0 | 1.5 |
| Mono label | 12px | 12px | 500 | 0.08em | 1.4 |

Aturan:

* Heading besar selalu **negative tracking** — pada ukuran besar, tracking normal terlihat renggang.
* Mono label selalu **uppercase + positive tracking**.
* Paragraf dibatasi `max-width: 68ch` agar baris tidak terlalu panjang untuk dibaca.

---

## 4. Spacing & Layout

### 4.1 Skala spacing

Memakai skala Tailwind bawaan (basis 4px). Nilai yang boleh dipakai dibatasi agar ritme konsisten:

```text
4  8  12  16  24  32  48  64  96  128
```

Nilai di luar daftar ini (mis. 20px, 40px) tidak dipakai kecuali untuk optical alignment pada ikon.

### 4.2 Container

```text
max-width : 1200px
padding   : 16px  (mobile)
            24px  (≥768px)
            32px  (≥1024px)
```

Halaman detail project dan halaman berbasis teks memakai container yang lebih sempit (`max-width: 768px`) agar baca nyaman.

### 4.3 Ritme vertikal antar section

| Breakpoint | Padding vertikal section |
|---|---|
| Mobile | 64px |
| Tablet | 80px |
| Desktop | 96px |

Jarak di dalam section:

```text
Label mono → heading        : 12px
Heading → deskripsi section : 16px
Deskripsi → konten          : 32px
Antar item dalam grid       : 24px
```

### 4.4 Grid

| Konten | Mobile | Tablet (768px) | Desktop (1024px+) |
|---|---|---|---|
| Project cards | 1 kolom | 2 kolom | 3 kolom |
| Certificate cards | 1 kolom | 2 kolom | 3 kolom |
| Skill groups | 1 kolom | 2 kolom | 4 kolom |
| Achievements | 1 kolom | 2 kolom | 3 kolom |
| Experience timeline | 1 kolom | 1 kolom | 1 kolom |

Timeline sengaja tetap satu kolom di semua ukuran — layout zig-zag dua sisi terlihat menarik tapi merusak urutan baca dan sulit diakses screen reader.

---

## 5. Radius, Border & Elevation

```css
--radius-sm : 6px    /* chip, badge, input kecil */
--radius-md : 8px    /* button, input */
--radius-lg : 12px   /* card */
--radius-xl : 16px   /* panel besar, modal */
```

**Border adalah alat struktur utama:**

```text
Card          : 1px solid var(--border)
Divider       : 1px solid var(--border)
Input         : 1px solid var(--input)
Input :focus  : 1px solid var(--ring) + ring 3px var(--ring)/40%
```

**Elevation** dipakai sangat hemat:

| Level | Dipakai untuk | Nilai |
|---|---|---|
| 0 | Card, section — default | tanpa shadow, hanya border |
| 1 | Dropdown, popover | `0 4px 12px rgb(0 0 0 / 0.18)` |
| 2 | Modal, dialog | `0 12px 32px rgb(0 0 0 / 0.28)` |

Card **tidak** memakai shadow bahkan saat hover — perubahan hover ditandai oleh border dan background, bukan bayangan (lihat §7.3).

**Glassmorphism** (PRD §33 "glassmorphism ringan") hanya dipakai di satu tempat: navbar saat halaman ter-scroll.

```css
background: color-mix(in oklch, var(--background) 72%, transparent);
backdrop-filter: blur(12px);
border-bottom: 1px solid var(--border);
```

Dipakai di satu tempat saja karena `backdrop-filter` mahal untuk rendering; memakainya di banyak card akan menurunkan skor Performance.

---

## 6. Iconography

* **Library:** Lucide (sesuai PRD §5).
* **Ukuran:** 16px (inline teks), 20px (tombol, nav), 24px (fitur/aksen).
* **Stroke:** 1.5px untuk 16–20px, 2px untuk 24px.
* **Warna:** mewarisi `currentColor` — tidak pernah di-hard-code.
* Ikon dekoratif wajib `aria-hidden="true"`; ikon yang berdiri sendiri sebagai tombol wajib punya `aria-label`.

**Logo teknologi** (Laravel, React, dsb.) tidak memakai Lucide. Field `technologies.icon` menyimpan nama ikon atau URL; jika kosong, chip menampilkan teks saja. Chip teks tanpa ikon adalah fallback yang sah, bukan kondisi error.

---

## 7. Komponen — Public

### 7.1 Navbar

```text
State awal (scroll = 0):
  background transparan, tanpa border

State ter-scroll (> 8px):
  glass background + border-bottom, tinggi menyusut 72px → 60px
  transisi 200ms
```

* Posisi `sticky top-0`, `z-index: 50`.
* Link aktif: warna `foreground` + garis bawah 2px `primary`; link non-aktif: `muted-foreground`.
* `Download CV` tampil sebagai tombol outline ukuran sm — bukan primary, agar tidak bersaing dengan CTA hero.
* **Mobile:** tombol hamburger membuka panel full-screen, bukan dropdown kecil. Target sentuh setiap item minimal 44px. Scroll body dikunci saat panel terbuka.

### 7.2 Button

| Varian | Dipakai untuk | Style |
|---|---|---|
| `primary` | CTA utama | bg `primary`, teks `primary-foreground` |
| `outline` | Aksi sekunder | transparan, border `border` |
| `ghost` | Aksi tersier, ikon | transparan, tanpa border |
| `destructive` | Hapus (**admin saja**) | bg `destructive` |

```text
Ukuran:
  sm  : tinggi 36px, padding-x 12px, teks 14px
  md  : tinggi 40px, padding-x 16px, teks 14px   ← default
  lg  : tinggi 48px, padding-x 24px, teks 16px   ← CTA hero

Hover   : lightness +4%, transisi 150ms
Active  : lightness -3%, tanpa transform
Focus   : ring 3px var(--ring)/40% + offset 2px
Disabled: opacity 50%, cursor not-allowed
Loading : spinner menggantikan ikon, lebar tombol dikunci agar tidak melompat
```

Tombol tidak memakai efek `scale` saat hover — pada elemen yang sering diklik, gerakan ini terasa mengganggu dan menyebabkan layout shift terukur.

### 7.3 Project Card

Komponen paling penting di seluruh website (PRD §11).

```text
┌─────────────────────────────┐
│                             │  Cover 16:9, object-cover
│      COVER IMAGE            │  next/image, sizes responsif
│                             │
├─────────────────────────────┤
│ Templas                     │  H3, 20px/600
│                             │
│ UI/UX & Code Template       │  Body 15px, muted-foreground
│ Repository Platform         │  clamp 2 baris
│                             │
│ ▸ Laravel  React  MySQL     │  chip mono 12px, maks 4 + "+N"
│                             │
│ [View Project]  [GitHub]    │  ghost sm + ikon
└─────────────────────────────┘
```

Spesifikasi:

* Seluruh card adalah link ke `/projects/[slug]`; tombol GitHub memakai `stopPropagation` agar tidak ikut memicu navigasi.
* **Hover:** `border` → `primary` pada 40% opacity, background naik ke `muted`, cover `scale(1.03)` di dalam container `overflow-hidden`. Card itu sendiri tidak bergerak — hanya gambarnya.
* Judul di-clamp 1 baris, deskripsi 2 baris, sehingga tinggi card seragam dalam satu baris grid.
* Badge `Featured` di pojok kanan atas cover: mono 11px, background `background` 80% + blur.
* Tanpa cover image: tampilkan blok `muted` dengan inisial judul dalam mono — jangan tampilkan ikon gambar rusak.

### 7.4 Chip Teknologi

```text
tinggi     : 24px
padding-x  : 8px
radius     : var(--radius-sm)
background : var(--muted)
teks       : mono 12px, muted-foreground
border     : none
```

Chip bersifat statis di card. Pada halaman `/projects`, chip yang sama juga berfungsi sebagai filter aktif — saat aktif: background `primary` 15%, teks `primary`, border 1px `primary` 30%.

### 7.5 Experience Timeline

```text
2026  │
      ●──  Web Developer Intern
      │    Company Name · Jakarta · Internship
      │    Jul 2026 — Present
      │
      │    Deskripsi singkat peran dan tanggung jawab.
      │
      │    Laravel  React  MySQL
      │
2025  ●──  Full Stack Developer
      │    SAPA · Remote
      │    Jan 2025 — Jun 2025
```

* Garis vertikal 1px `border`, node lingkaran 10px.
* Node posisi terkini (`current = true`): isi `primary` + ring `primary` 20% selebar 4px.
* Tahun dalam mono 12px uppercase, warna `muted-foreground`.
* Logo perusahaan 32×32 radius-sm jika ada; jika tidak ada, node tetap tampil tanpa placeholder.
* `current = true` menampilkan **Present** sebagai pengganti tanggal akhir (PRD §13).
* Pada mobile, kolom tahun pindah ke atas judul agar tidak memakan lebar.

### 7.6 Certificate Card

```text
┌───────────────────┐
│  [ gambar 4:3 ]   │  object-contain di atas muted —
│                   │  sertifikat jangan ter-crop
├───────────────────┤
│ Google Data …     │  H3 18px, clamp 2 baris
│ Google · Mar 2026 │  small, muted-foreground
│                   │
│ View Certificate ↗│  link primary 14px
└───────────────────┘
```

`object-contain` dipilih secara sengaja: sertifikat punya rasio yang bervariasi dan `object-cover` akan memotong nama atau logo penerbit. Link membuka `credential_url`, jatuh ke `certificate_file` bila kosong; bila keduanya kosong, link tidak dirender sama sekali.

### 7.7 Skills

Dikelompokkan per kategori dalam card berisi daftar chip:

```text
┌──────────────────────┐  ┌──────────────────────┐
│ FRONTEND             │  │ BACKEND              │
│                      │  │                      │
│ HTML  CSS  JS  TS    │  │ PHP  Laravel  REST   │
│ React  Next.js       │  │ Sanctum  Livewire    │
└──────────────────────┘  └──────────────────────┘
```

Tanpa progress bar dan tanpa rating bintang. Level skill yang dinyatakan sendiri tidak kredibel bagi technical interviewer dan justru mengundang pertanyaan yang tidak menguntungkan — bukti kemampuan ada di project.

### 7.8 Contact Form

```text
Label       : small 14px, muted-foreground, di atas field
Input       : tinggi 44px, radius-md, bg muted, border input
Textarea    : min-height 140px, resize vertical saja
Error       : teks 13px destructive di bawah field + border destructive
Success     : banner inline di atas form, bukan alert() atau toast
Submit      : primary md, full-width di mobile
```

* Validasi dijalankan saat blur, lalu re-validasi saat submit — bukan saat setiap ketikan.
* Selama pengiriman, tombol masuk state loading dan field dikunci.
* Honeypot field tersembunyi untuk bot; jangan pakai CAPTCHA di MVP karena merusak alur dan skor Accessibility.

### 7.9 Section Header

Pola berulang untuk setiap section di homepage:

```text
01 — PROJECTS              ← mono 12px, uppercase, tracking 0.08em, muted
Featured Work              ← H2
Beberapa project terpilih  ← body, muted-foreground, max 60ch
yang saya kerjakan.
```

Penomoran mono memberi kesan terstruktur dan membantu orientasi saat scroll panjang.

### 7.10 Footer

Tiga kolom di desktop, bertumpuk di mobile, dipisahkan border-top 1px. Berisi nama + role, navigasi ringkas, dan social links. Baris bawah: copyright kiri, "Built with Next.js" kanan — keduanya small `muted-foreground`.

---

## 8. Komponen — Admin

Admin memakai token yang sama, tetapi density lebih rapat: ini alat kerja, bukan halaman pemasaran.

### 8.1 Shell

```text
┌──────────┬────────────────────────────────┐
│ sidebar  │  topbar (56px)                 │
│ 240px    ├────────────────────────────────┤
│ fixed    │                                │
│          │  content, padding 24px         │
│          │  max-width 1100px              │
└──────────┴────────────────────────────────┘
```

* Sidebar: background `card`, border-right 1px. Item aktif: background `muted` + garis kiri 2px `primary`.
* Di bawah 1024px sidebar menjadi drawer yang dipicu ikon hamburger di topbar.
* Topbar memuat judul halaman, toggle tema, dan menu akun (logout).

### 8.2 Stat Card (Dashboard)

```text
┌─────────────┐
│ PROJECTS    │  mono 11px uppercase muted
│ 6           │  36px 600, tabular-nums
│ 4 published │  13px muted
└─────────────┘
```

`font-variant-numeric: tabular-nums` agar angka tidak bergeser saat data berubah.

### 8.3 Data Table

```text
Header  : mono 11px uppercase, muted-foreground, border-bottom
Row     : tinggi 52px, border-bottom 1px, hover bg muted
Kolom   : Title │ Status │ Featured │ Updated │ Actions
Actions : ikon ghost — Edit (pencil), Delete (trash, destructive saat hover)
```

* Badge status: `Published` → success 15% bg + teks success; `Draft` → muted bg + muted-foreground.
* Featured ditandai ikon bintang terisi `warning`, bukan teks.
* **Mobile:** tabel berubah menjadi daftar card — jangan pernah horizontal-scroll tabel di ponsel.
* **Empty state:** ikon + satu kalimat penjelas + tombol primary "Add ...". Tabel kosong tanpa penjelasan terbaca seperti error.

### 8.4 Form

```text
Layout       : satu kolom, max-width 720px
Grup field   : dipisahkan heading small + border-top
Field wajib  : label diberi tanda * warna destructive
Helper text  : 13px muted-foreground di bawah field
Action bar   : sticky di bawah — [Cancel ghost] [Save primary]
```

* Slug dibuat otomatis dari title, tetapi dapat di-override manual; tampilkan preview `/projects/<slug>`.
* Toggle `Published` dan `Featured` memakai switch dengan label yang menjelaskan dampaknya ("Tampil di website publik").
* Konfirmasi hapus memakai dialog yang menyebut **nama item**, bukan "item ini".

### 8.5 Image Uploader

```text
┌─────────────────────────────┐
│   ⬆  Drop image or browse   │
│   PNG, JPG, WEBP · max 2MB  │
└─────────────────────────────┘
```

* Setelah terpilih: preview thumbnail + nama file + tombol hapus.
* Progress bar tipis 2px `primary` saat upload.
* Error (ukuran/tipe) tampil inline di bawah dropzone dengan teks yang menyebutkan batasnya, bukan pesan generik.
* Untuk PDF (CV, file sertifikat), preview diganti ikon dokumen + nama file.

---

## 9. Motion

```text
Durasi:
  instan (hover warna, focus)   : 120ms
  cepat  (transform kecil)      : 200ms
  sedang (reveal section)       : 400ms

Easing:
  masuk      : cubic-bezier(0.16, 1, 0.3, 1)     /* ease-out-expo */
  keluar     : cubic-bezier(0.4, 0, 1, 1)
  standar    : cubic-bezier(0.4, 0, 0.2, 1)
```

Animasi yang diizinkan (PRD §35):

| Animasi | Spesifikasi |
|---|---|
| Section reveal | `opacity 0→1` + `translateY 12px→0`, 400ms, trigger IntersectionObserver `threshold 0.15`, **sekali saja** |
| Project card hover | Gambar `scale 1→1.03`, 200ms |
| Timeline reveal | Item berurutan, stagger 60ms |
| Navbar shrink | Height + background, 200ms |
| Button hover | Warna saja, 120ms |

Aturan keras:

* Hanya `opacity` dan `transform` yang dianimasikan — properti lain memicu layout/paint dan merusak metrik INP.
* Reveal berjalan sekali; animasi yang berulang saat scroll naik-turun membuat halaman terasa gelisah.
* Tidak ada animasi di atas 400ms. Tidak ada parallax. Tidak ada animasi loading teks/typewriter pada hero — menunda pembacaan informasi terpenting.
* Konten hero **tidak** dianimasikan masuk; harus sudah terbaca pada frame pertama demi LCP.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Elemen yang muncul via reveal harus tetap **terlihat** dalam mode ini — state akhir (`opacity: 1`) diterapkan langsung, bukan dibiarkan pada `opacity: 0`.

---

## 10. Dark Mode Implementation

* **Default: dark** (PRD §34).
* Preferensi disimpan di `localStorage` dengan kunci `theme` (`dark` | `light` | `system`).
* Skrip inline kecil di `<head>` membaca localStorage dan memasang class pada `<html>` **sebelum** paint pertama, agar tidak terjadi flash tema terang.
* Toggle di navbar (public) dan topbar (admin), ikon sun/moon, dengan `aria-label` yang berubah sesuai state.
* Semua warna melalui token — **tidak ada** utility `dark:` yang tersebar di komponen. Satu sumber kebenaran di `globals.css`.
* `<meta name="theme-color">` mengikuti tema aktif.

---

## 11. Imagery

| Konteks | Rasio | Fit | Ukuran render |
|---|---|---|---|
| Project cover | 16:9 | cover | 800×450 |
| Project gallery | bebas | contain | maks lebar 1200 |
| Certificate | 4:3 | contain | 600×450 |
| Company logo | 1:1 | contain | 64×64 |
| Avatar profil | 1:1 | cover | 320×320 |

* Wajib memakai `next/image` dengan `sizes` yang tepat; format WebP.
* `priority` **hanya** pada gambar hero/avatar; sisanya lazy.
* `alt` diambil dari data CMS (judul project, nama sertifikat), tidak pernah kosong untuk gambar bermakna.
* Setiap gambar punya `width`/`height` eksplisit atau container ber-aspect-ratio untuk mencegah CLS.
* Placeholder saat loading: blok `muted`, bukan spinner.

---

## 12. Responsive Behaviour

Breakpoint Tailwind standar, sesuai target PRD §29:

```text
sm  640px   md  768px   lg  1024px   xl  1280px
```

| Elemen | Mobile (375px) | Tablet (768px) | Desktop (1024px+) |
|---|---|---|---|
| Navigasi | Hamburger → panel full-screen | Hamburger | Link horizontal |
| Hero headline | 36px, rata kiri | 48px | 60px |
| Hero CTA | Bertumpuk, full-width | Sejajar | Sejajar |
| Project grid | 1 kolom | 2 kolom | 3 kolom |
| Admin sidebar | Drawer | Drawer | Fixed 240px |
| Admin table | Card list | Card list | Tabel penuh |
| Padding section | 64px | 80px | 96px |

Aturan mobile:

* Target sentuh minimal 44×44px.
* Tidak ada horizontal scroll pada `<body>` di lebar berapa pun.
* Filter pada `/projects` menjadi baris chip yang bisa di-scroll horizontal dengan momentum, bukan `<select>`.
* Form field tidak pernah dua kolom di bawah 640px.

---

## 13. Accessibility

Bukan opsional — PRD §31 menargetkan Accessibility ≥ 90.

* **Struktur heading** menurun berurutan; satu `<h1>` per halaman.
* **Landmark** eksplisit: `<header>`, `<nav>`, `<main>`, `<footer>`.
* **Skip link** "Skip to content" sebagai elemen fokusable pertama.
* **Focus visible** di semua elemen interaktif — ring 3px `ring` 40% + offset 2px. Jangan pernah `outline: none` tanpa pengganti.
* **Urutan fokus** mengikuti urutan visual; panel mobile dan dialog wajib trap fokus dan mengembalikan fokus ke pemicu saat ditutup.
* **Form**: setiap input punya `<label>` yang terhubung; pesan error terhubung via `aria-describedby` dan `aria-invalid`.
* **Link vs button**: navigasi memakai `<a>`, aksi memakai `<button>`. Jangan `<div onClick>`.
* **Link eksternal** memakai `rel="noopener noreferrer"` dan ikon `↗` yang `aria-hidden`.
* Informasi tidak pernah disampaikan lewat warna saja — status di admin memakai teks badge, bukan titik warna saja.

---

## 14. Performance Guardrails (implikasi desain)

Keputusan desain di bawah ini diambil demi target Lighthouse ≥ 90 (PRD §31):

* Hero tidak memakai gambar berat penuh layar; LCP-nya adalah teks headline.
* `backdrop-filter` hanya di navbar (§5).
* Font hanya dua family, dimuat lewat `next/font` — tanpa `@import` eksternal.
* Tidak ada library animasi berat. Reveal cukup dengan IntersectionObserver + CSS; Framer Motion hanya jika memang diperlukan dan diimpor dinamis.
* Semua section publik adalah Server Component; `"use client"` hanya untuk navbar, theme toggle, filter project, contact form, dan seluruh admin.
* Ikon diimpor per-ikon (`import { Github } from 'lucide-react'`), tidak pernah seluruh paket.

---

## 15. Halaman — Ringkasan Komposisi

### Homepage

```text
Navbar (sticky)
Hero              — H1, role, deskripsi, 2 CTA, social, avatar
About             — 2 kolom: teks + highlight singkat
Featured Projects — 3 card + link "View all projects →"
Experience        — timeline, maks 3 terbaru + link
Skills            — 4 card kategori
Certificates      — 3 card + link
Education         — 1–2 entri ringkas
Contact           — form + social
Footer
```

### /projects

```text
H1 + deskripsi
Search input + filter chip (All / Web / AI / Data / Other)
Grid card responsif
Empty state bila filter tidak menghasilkan apa pun
```

### /projects/[slug]

```text
Back link
Title + short description
[Live Demo] [GitHub]
Cover image
── Overview
── My Role · Team · Periode  (grid meta)
── Tech Stack (chip)
── Key Features (list ikon centang)
── Challenges
── Solutions
── Results
── Screenshots (galeri)
Navigasi Prev / Next project
```

Container 768px untuk bagian teks; gambar boleh melebar hingga 1024px.

---

## 16. Definition of Done — Desain

```text
✓ Token warna dark & light terpasang di globals.css
✓ Seluruh pasangan warna lolos ambang kontras §2.4
✓ Dark mode default, tanpa flash saat load
✓ Tidak ada warna hard-code di luar token
✓ Semua komponen punya state hover / focus / active / disabled
✓ Focus ring terlihat di seluruh elemen interaktif
✓ Empty state tersedia untuk setiap daftar (public & admin)
✓ Loading state tersedia untuk setiap fetch dan submit
✓ Layout diverifikasi pada 375 / 768 / 1024 / 1440px
✓ Tanpa horizontal scroll di semua breakpoint
✓ prefers-reduced-motion dihormati
✓ Admin table berubah menjadi card list di mobile
✓ Seluruh gambar punya alt dan dimensi eksplisit
```
