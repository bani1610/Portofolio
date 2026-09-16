Siap. Saya buatkan PRD yang bukan sekadar landing page, tapi **portfolio personal + CMS/Admin Dashboard** sehingga pengalaman, project, sertifikat, skill, pendidikan, dan konten penting bisa kamu update tanpa mengubah kode.

Saya arahkan stack ke **Next.js + TypeScript + Tailwind CSS + Supabase + Vercel**, dengan fokus utama positioning sebagai **Web Developer / Full Stack Web Developer**.

# PRD — Personal Portfolio Website

**Version:** 1.0
**Project Type:** Personal Developer Portfolio + CMS
**Target User:** Recruiter, HR, interviewer, client, developer community
**Owner:** Sholahuddin Robbani
**Primary Role:** Web Developer / Full Stack Web Developer

---

## 1. Product Overview

Website ini merupakan portfolio personal yang digunakan untuk menampilkan identitas profesional, pengalaman, project, sertifikat, pendidikan, skill, dan informasi lain yang relevan dengan karier sebagai Web Developer.

Website memiliki dua sisi:

### Public Website

Dapat diakses oleh siapa saja untuk melihat:

* Profile
* About
* Experience
* Projects
* Certificates
* Skills
* Education
* Contact
* CV

### Admin Dashboard

Digunakan oleh pemilik portfolio untuk mengelola seluruh konten website tanpa perlu mengubah source code.

Contoh:

```text
Admin
 │
 ├── Dashboard
 ├── Profile
 ├── Experiences
 ├── Projects
 ├── Certificates
 ├── Skills
 ├── Education
 ├── Achievements
 ├── Social Links
 └── Settings
```

---

# 2. Goals

### Primary Goals

1. Membuat personal branding sebagai Web Developer.
2. Menampilkan project nyata yang pernah dikerjakan.
3. Menampilkan pengalaman profesional dan akademik.
4. Menampilkan sertifikat dan pencapaian.
5. Memudahkan recruiter memahami kemampuan dalam waktu singkat.
6. Memiliki CMS sehingga konten dapat diperbarui dengan mudah.
7. Memiliki desain modern, profesional, responsive, dan cepat.
8. Memiliki SEO yang baik sehingga portfolio mudah ditemukan melalui search engine.

### Secondary Goals

* Menjadi showcase kemampuan frontend.
* Menjadi showcase kemampuan backend/API.
* Menunjukkan kemampuan database dan system architecture.
* Menunjukkan kemampuan membangun aplikasi full-stack.
* Menjadi pusat informasi yang menghubungkan GitHub, LinkedIn, CV, dan project demo.

---

# 3. Non-Goals

Versi pertama tidak perlu memiliki:

* Sistem registrasi user umum.
* Social media internal.
* Comment system.
* Marketplace.
* Payment system.
* Multi-user CMS.
* Chat realtime.

Admin hanya digunakan oleh pemilik portfolio.

---

# 4. Target Audience

### 4.1 Recruiter / HR

Membutuhkan informasi:

* Siapa pemilik portfolio?
* Skill apa yang dimiliki?
* Pengalaman apa yang dimiliki?
* Project apa yang pernah dibuat?
* Pendidikan?
* Sertifikat?
* Kontak?

### 4.2 Technical Interviewer

Membutuhkan informasi lebih teknis:

* Tech stack
* Architecture
* API
* Database
* Git
* Problem solving
* Project contribution

### 4.3 Potential Client

Membutuhkan:

* Kemampuan
* Project sebelumnya
* Service yang dapat diberikan
* Contact information

---

# 5. Tech Stack

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
Lucide Icons
```

Next.js digunakan untuk:

* Routing
* Server-side rendering
* SEO
* Static generation
* Dynamic project pages
* API integration

---

## Backend / Database

```text
Supabase
├── PostgreSQL
├── Authentication
└── Storage
```

Supabase digunakan untuk:

* Database
* Admin authentication
* File storage
* CRUD content

---

## Deployment

```text
Vercel
```

Architecture:

```text
                    ┌─────────────────┐
                    │     Visitor     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Vercel      │
                    │    Next.js      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Supabase     │
                    ├─────────────────┤
                    │ PostgreSQL      │
                    │ Authentication  │
                    │ Storage         │
                    └─────────────────┘
```

---

# 6. Information Architecture

## Public

```text
/
├── /about
├── /projects
│   └── /projects/[slug]
├── /experience
├── /certificates
├── /skills
├── /education
└── /contact
```

## Admin

```text
/admin
├── /login
├── /dashboard
├── /profile
├── /projects
├── /projects/create
├── /projects/[id]/edit
├── /experience
├── /experience/create
├── /certificates
├── /certificates/create
├── /skills
├── /education
├── /achievements
├── /social-links
├── /messages
└── /settings
```

---

# 7. Public Website

## 7.1 Navbar

Navbar harus sederhana.

```text
SHOLAHUDDIN
--------------------------------
Home
About
Projects
Experience
Certificates
Contact

[Download CV]
```

Pada mobile:

```text
SHOLAHUDDIN       ☰
```

Navbar menggunakan sticky navigation.

---

# 8. Hero Section

Hero merupakan bagian pertama yang dilihat visitor.

Contoh:

```text
Hi, I'm Sholahuddin Robbani

Web Developer
Building modern and scalable web applications.

[View My Projects]
[Download CV]

GitHub  LinkedIn  Email
```

Hero harus menampilkan:

* Nama
* Professional title
* Short description
* CTA
* Social links
* Profile image/avatar optional

---

# 9. About Section

Menjelaskan background secara singkat.

Content:

```text
About Me

Saya adalah mahasiswa Teknik Informatika yang memiliki
ketertarikan dan pengalaman dalam pengembangan aplikasi web.

Saya terbiasa mengembangkan aplikasi dari sisi frontend,
backend, database, hingga integrasi API.
```

Admin dapat mengubah seluruh text melalui dashboard.

---

# 10. Skills

Skill dikelompokkan berdasarkan kategori.

Contoh:

### Frontend

```text
HTML
CSS
JavaScript
TypeScript
React
Next.js
Tailwind CSS
```

### Backend

```text
PHP
Laravel
REST API
Laravel Sanctum
Livewire
```

### Database

```text
MySQL
PostgreSQL
Supabase
```

### Tools

```text
Git
GitHub
Docker
VS Code
```

Skill tidak boleh hard-code.

Admin dapat:

```text
+ Add Skill

Name:
React

Category:
Frontend

Icon:
...

Order:
3

Visible:
✓
```

Skill disimpan pada tabel `technologies` (§24) — bukan tabel terpisah.
Tabel yang sama juga dipakai sebagai tag teknologi pada project,
sehingga satu teknologi cukup didaftarkan sekali.

Field `Visible` menentukan apakah teknologi tersebut tampil di section
Skills. Teknologi dengan `visible = false` tetap dapat dipakai sebagai
tag project.

---

# 11. Projects

Ini harus menjadi salah satu bagian paling penting.

Card:

```text
┌───────────────────────────────┐
│                               │
│       PROJECT IMAGE           │
│                               │
├───────────────────────────────┤
│ Templas                       │
│                               │
│ UI/UX & Code Template         │
│ Repository Platform           │
│                               │
│ Laravel • React • MySQL       │
│                               │
│ [View Project] [GitHub]       │
└───────────────────────────────┘
```

Project memiliki:

* Title
* Slug
* Short description
* Full description
* Project image (cover, tunggal — `projects.cover_image`)
* Gallery (banyak gambar — tabel `project_images`)
* Technologies
* GitHub URL
* Live demo URL
* Project category (`web` / `ai` / `data` / `other`, dipilih dari dropdown di admin)
* Project date
* Role
* Team
* Features
* Challenges
* Solutions
* Results
* Featured status
* Published status

---

# 12. Project Detail

URL:

```text
/projects/templas
```

Struktur:

```text
Templas
Community-Driven UI/UX Asset
& Code Template Repository

[Live Demo] [GitHub]

────────────────────────

Overview

...

My Role

Full Stack Developer

────────────────────────

Tech Stack

Laravel
React
MySQL

────────────────────────

Key Features

✓ Authentication
✓ Template Management
✓ Search
✓ Filtering
✓ Admin Dashboard

────────────────────────

Challenges

...

Solutions

...

Screenshots

[ IMAGE ]
[ IMAGE ]
[ IMAGE ]
```

Ini penting karena recruiter bisa melihat **bukan hanya hasil project, tetapi kontribusimu**.

---

# 13. Experience

Timeline:

```text
2026
│
├── Web Developer Intern
│   Company Name
│
│   Description...
│
2026
│
├── Full Stack Developer
│   Templas
│
│   Description...
│
2025
│
└── Full Stack Developer
    SAPA
```

Data:

```text
Company
Position
Location
Employment Type
Start Date
End Date
Description
Responsibilities
Technologies
Company Logo
Current Position
Published
```

Support:

```text
Present
```

sehingga jika pekerjaan masih berlangsung:

```text
July 2026 - Present
```

---

# 14. Certificates

Grid:

```text
Certificates

┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Certificate │ │ Certificate │ │ Certificate │
│             │ │             │ │             │
│ Google      │ │ Dicoding    │ │ Kampus      │
└─────────────┘ └─────────────┘ └─────────────┘
```

Data:

```text
Certificate Name
Issuer
Issue Date
Credential ID
Credential URL
Certificate Image
Certificate File
Description
Published
```

Jika visitor klik:

```text
View Certificate
```

akan membuka credential URL atau file sertifikat.

---

# 15. Education

Contoh:

```text
Education

Sekolah Tinggi Teknologi Terpadu Nurul Fikri
S1 Teknik Informatika

2024 - Present
```

Data:

```text
Institution
Degree
Field of Study
Start Date
End Date
Description
Logo
```

---

# 16. Achievements

Termasuk dalam MVP. Tabel, CRUD admin, dan tampilan publik dibuat pada
versi pertama.

Section publik dirender secara kondisional: hanya muncul apabila
terdapat minimal 2 achievement published.

Contoh:

```text
Achievements

🏆 Hackathon Finalist
📜 Data Mining Project
🎯 BIG TECH Event
```

Data:

```text
Title
Organization
Date
Description
Image
URL
```

---

# 17. Contact

Section:

```text
Let's Work Together

Have a project or opportunity?

[ Name ]
[ Email ]
[ Subject ]
[ Message ]

[ Send Message ]
```

Social:

```text
GitHub
LinkedIn
Email
Instagram
```

Pesan yang dikirim disimpan ke tabel `contact_messages` (§24) dan dapat
dibaca admin melalui `/admin/messages`.

Contact form dapat dikembangkan menjadi email notification pada fase berikutnya.

Proteksi spam pada MVP menggunakan honeypot field tersembunyi dan
pembatasan jumlah pengiriman per IP. CAPTCHA tidak digunakan karena
mengganggu alur pengisian dan menurunkan skor Accessibility.

---

# 18. Footer

```text
SHOLAHUDDIN ROBBANI

Web Developer

GitHub | LinkedIn | Email

© 2026 Sholahuddin Robbani
Built with Next.js
```

---

# 19. Admin Dashboard

Dashboard tidak perlu terlalu kompleks.

```text
┌──────────────────────────────────────────────┐
│ Admin Portfolio                              │
├─────────────┬────────────────────────────────┤
│ Dashboard   │                                │
│ Profile     │ Welcome back, Sholahuddin      │
│ Projects    │                                │
│ Experience  │ ┌──────┐ ┌──────┐ ┌──────┐    │
│ Certificates│ │  6   │ │  3   │ │  12  │    │
│ Skills      │ │Proj. │ │ Exp. │ │Cert. │    │
│ Education   │ └──────┘ └──────┘ └──────┘    │
│ Achievement │                                │
│ Social      │ Recent Updates                 │
│ Messages    │                                │
│ Settings    │                                │
└─────────────┴────────────────────────────────┘
```

---

# 20. Admin CRUD

Semua konten utama harus mendukung:

```text
Create
Read
Update
Delete
```

Ditambah:

```text
Publish / Unpublish
Featured / Unfeatured
Ordering
```

---

# 21. Project Management

Admin:

```text
Projects

[ + Add Project ]

------------------------------------------------
Title          Status       Featured     Action
------------------------------------------------
Templas        Published    ✓            Edit
SAPA           Published    ✓            Edit
NLP BPJS       Published    ✓            Edit
YOLO Detection Draft        -            Edit
```

---

# 22. Image & File Management

Supabase Storage digunakan untuk:

```text
/storage
├── profile/
├── projects/
├── certificates/
├── education/
├── achievements/
└── documents/
```

File yang didukung:

```text
.jpg
.jpeg
.png
.webp
.pdf
```

Untuk keamanan, ukuran file perlu dibatasi.

---

# 23. Authentication

Admin login:

```text
/admin/login
```

Form:

```text
Email
Password

[Login]
```

Hanya akun yang terdaftar sebagai admin yang dapat mengakses dashboard.

Semua route:

```text
/admin/*
```

harus dilindungi authentication.

Mekanisme penentuan admin:

```text
1. Akun dibuat manual melalui Supabase — registrasi publik dinonaktifkan
2. user_id akun tersebut dimasukkan ke tabel admin_users (§24)
3. Fungsi is_admin() memeriksa keanggotaan tabel tersebut
4. Seluruh policy RLS memanggil is_admin() untuk operasi tulis
```

Login yang berhasil tetapi akunnya tidak terdaftar pada `admin_users`
harus ditolak dan langsung di-sign out.

Pesan error pada form login tidak boleh membedakan antara email tidak
terdaftar dan password salah, agar tidak membocorkan email mana yang
terdaftar.

---

# 24. Database Design

Seluruh tabel utama menggunakan konvensi berikut:

```text
id            uuid, primary key
created_at    timestamptz, default now()
updated_at    timestamptz, diperbarui otomatis via trigger
published     boolean, default false
```

`published` sengaja default `false` sehingga konten baru tidak langsung
tampil di website publik sebelum sengaja di-publish oleh admin.

## admin_users

```text
id
user_id        → referensi ke auth.users
created_at
```

Tabel ini menentukan siapa yang berhak mengakses admin dashboard
(PRD §23). Seluruh policy Row Level Security memeriksa keanggotaan
tabel ini melalui fungsi `is_admin()`.

Pengecekan admin harus berada di dalam database, bukan berdasarkan
environment variable, karena policy RLS tidak dapat membaca environment
variable. Registrasi publik dinonaktifkan; akun admin dibuat manual.

## profiles

```text
id
name
headline
bio
profile_image
location
email
phone
resume_url
created_at
updated_at
```

## projects

```text
id
title
slug
short_description
description
category
role
team
features
challenges
solutions
results
start_date
end_date
github_url
demo_url
cover_image
featured
published
created_at
updated_at
```

Catatan field naratif project (dirender pada halaman detail §12):

```text
team          → mis. "Solo" atau "Tim 4 orang"
features      → array teks, dirender sebagai daftar bercentang
challenges    → teks panjang
solutions     → teks panjang
results       → teks panjang
```

`features` disimpan sebagai array (bukan satu blok teks) karena setiap
butir dirender sebagai item terpisah dengan ikon centang.

Catatan `category`:

```text
web
ai
data
other
```

Satu project hanya memiliki satu category, digunakan untuk filter pada
halaman /projects. Category berbeda dengan technologies: satu project
dapat memiliki banyak technology, tetapi hanya satu category.

## project_technologies

```text
id
project_id
technology_id
```

## technologies

```text
id
name
category
icon
display_order
visible
created_at
```

Tabel ini melayani dua kebutuhan sekaligus:

```text
1. Section Skills (§10)      → semua baris dengan visible = true
2. Tag teknologi project     → melalui project_technologies
```

Skills dan technologies **tidak dipisah menjadi dua tabel** karena
keduanya memiliki field yang sama dan isi yang tumpang tindih (React,
Laravel, PostgreSQL muncul di kedua konteks). Dua tabel terpisah akan
membuat satu teknologi harus ditulis dua kali dan berisiko tidak sinkron.

Konsekuensinya: sebuah teknologi dapat dipakai sebagai tag project tanpa
tampil di section Skills dengan mengatur `visible = false`. Ini berguna
untuk teknologi pendukung yang tidak perlu ditonjolkan sebagai skill.

`category` mengikuti pengelompokan pada §10:

```text
frontend
backend
database
tools
```

## project_images

```text
id
project_id
image_url
caption
display_order
created_at
```

Digunakan untuk Gallery dan Screenshots pada halaman detail project.
Satu project dapat memiliki banyak image, diurutkan berdasarkan
`display_order`. Berbeda dengan `projects.cover_image` yang merupakan
gambar tunggal untuk card dan Open Graph image.

Jika sebuah project dihapus, seluruh image miliknya ikut terhapus
(cascade), termasuk file di storage.

## experiences

```text
id
company
position
location
employment_type
start_date
end_date
description
company_logo
current
featured
published
created_at
updated_at
```

## certificates

```text
id
title
issuer
issue_date
credential_id
credential_url
certificate_image
certificate_file
description
published
created_at
updated_at
```

## education

```text
id
institution
degree
field
start_date
end_date
description
logo
published
```

## achievements

```text
id
title
organization
date
description
image
url
display_order
published
created_at
updated_at
```

Section Achievements pada website publik hanya dirender apabila terdapat
**minimal 2 achievement** dengan status published. Section berisi satu
item terlihat lemah; dengan aturan ini section akan muncul dengan
sendirinya ketika kontennya sudah cukup.

## social_links

```text
id
platform
url
icon
display_order
visible
```

## contact_messages

```text
id
name
email
subject
message
read
created_at
```

Pesan dari contact form (§17) disimpan ke database. Pada MVP belum ada
email notification — fitur tersebut berada di Phase 2 (§39) — sehingga
tanpa tabel ini pesan yang dikirim visitor akan hilang.

Admin membaca pesan melalui halaman `/admin/messages` dengan aksi
tandai sudah dibaca dan hapus.

Policy RLS tabel ini berbeda dari tabel lain:

```text
Publik : INSERT saja
Admin  : SELECT, UPDATE, DELETE
```

Publik tidak boleh melakukan SELECT agar pesan dari visitor lain tidak
dapat dibaca.

## site_settings

```text
id
site_title
site_description
og_image
resume_url
updated_at
```

Tabel baris tunggal untuk metadata global dan SEO default (§30), dikelola
melalui `/admin/settings`.

---

# 25. Important Database Relationship

```text
projects
    │
    ├──── project_technologies
    │              │
    │              ▼
    │        technologies
    │
    └──── project_images
```

Sehingga satu project bisa mempunyai banyak teknologi:

```text
Templas
│
├── Laravel
├── React
├── MySQL
├── Tailwind CSS
└── REST API
```

Dan satu teknologi bisa digunakan di banyak project.

---

# 26. Content Status

Semua content utama memiliki:

```text
Draft
Published
```

Flow:

```text
Create
   ↓
Draft
   ↓
Edit
   ↓
Publish
   ↓
Public Website
```

Admin juga dapat melakukan:

```text
Unpublish
```

untuk menyembunyikan content tanpa menghapusnya.

---

# 27. Featured Content

Admin dapat memilih:

```text
Featured: ✓
```

Contohnya dari 10 project hanya 3 yang ditampilkan di homepage.

```text
Featured Projects

1. Templas
2. SAPA
3. NLP BPJS
```

Project lainnya tetap tersedia di:

```text
/projects
```

---

# 28. Search & Filtering

Untuk halaman project:

```text
Search Project...

[All]
[Web]
[AI]
[Data]
[Other]
```

Filter berdasarkan:

* Category — kolom `projects.category` (`web`, `ai`, `data`, `other`)
* Technology — melalui relasi `project_technologies`
* Year — diturunkan dari `projects.start_date`

---

# 29. Responsive Design

Website harus optimal untuk:

### Desktop

```text
1440px+
```

### Laptop

```text
1024px
```

### Tablet

```text
768px
```

### Mobile

```text
375px+
```

Mobile harus tetap nyaman digunakan.

---

# 30. SEO

Setiap halaman harus memiliki:

```text
Title
Description
Open Graph Image
Canonical URL
```

Contoh:

```text
Title:
Sholahuddin Robbani — Web Developer

Description:
Portfolio Sholahuddin Robbani, Web Developer
yang berfokus pada pengembangan aplikasi web.
```

Project detail:

```text
Templas — Sholahuddin Robbani
```

Tambahkan:

```text
sitemap.xml
robots.txt
structured data
```

---

# 31. Performance

Target:

```text
Lighthouse

Performance   ≥ 90
Accessibility ≥ 90
SEO           ≥ 90
Best Practices ≥ 90
```

Optimasi:

* Next.js Image
* WebP
* Lazy loading
* Server components
* Minimize JavaScript
* Optimized fonts
* Caching

---

# 32. Security

Supabase Row Level Security wajib digunakan.

Public:

```text
SELECT published content
```

Admin:

```text
SELECT
INSERT
UPDATE
DELETE
```

Admin dashboard tidak boleh dapat diakses tanpa authentication.

File storage juga harus menggunakan policy yang sesuai.

---

# 33. UI / UX Direction

Saya menyarankan desain:

**Modern Developer Portfolio**

Karakter:

```text
Minimal
Professional
Modern
Technical
Clean
Responsive
```

Bukan desain portfolio yang terlalu ramai.

### Visual

Gunakan:

```text
Dark / Light mode
Glassmorphism ringan
Rounded cards
Subtle borders
Micro animations
Monospace accent
Clean typography
```

Contoh visual hierarchy:

```text
BIG HEADLINE

Short description

[CTA] [CTA]

-------------------

Projects

[Card] [Card] [Card]

-------------------

Experience

Timeline

-------------------

Certificates

Cards
```

---

# 34. Dark Mode

Default:

```text
Dark Mode
```

User dapat mengganti:

```text
☀ Light
🌙 Dark
```

Preferensi disimpan di browser.

---

# 35. Animation

Gunakan animasi secara minimal.

Contoh:

* Fade-in section
* Hover project card
* Smooth scrolling
* Button hover
* Timeline reveal
* Image hover

Jangan menggunakan animasi berlebihan yang mengganggu recruiter.

---

# 36. Homepage Flow

```text
Visitor
   │
   ▼
Hero
   │
   ▼
About
   │
   ▼
Featured Projects
   │
   ▼
Experience
   │
   ▼
Skills
   │
   ▼
Certificates
   │
   ▼
Education
   │
   ▼
Achievements  (hanya jika ≥ 2 item published)
   │
   ▼
Contact
   │
   ▼
Footer
```

---

# 37. Admin Flow

```text
Login
  │
  ▼
Dashboard
  │
  ├── Manage Projects
  │       ├── Create
  │       ├── Edit
  │       ├── Publish
  │       └── Delete
  │
  ├── Manage Experience
  │
  ├── Manage Certificates
  │
  ├── Manage Skills
  │
  ├── Manage Education
  │
  └── Manage Profile
```

---

# 38. MVP

Untuk versi pertama, fokus pada:

### Public

* [x] Homepage
* [x] About
* [x] Projects
* [x] Project Detail
* [x] Experience
* [x] Certificates
* [x] Skills
* [x] Education
* [x] Contact
* [x] Download CV
* [x] Responsive
* [x] Dark mode

### Admin

* [x] Login
* [x] Dashboard
* [x] Profile CRUD
* [x] Project CRUD
* [x] Experience CRUD
* [x] Certificate CRUD
* [x] Skill CRUD
* [x] Education CRUD
* [x] Achievement CRUD
* [x] Social Links CRUD
* [x] Contact Messages
* [x] Site Settings
* [x] Image upload
* [x] Publish/unpublish
* [x] Featured content

---

# 39. Phase 2

Setelah MVP selesai:

```text
Blog
GitHub API Integration
Project Analytics
Visitor Counter
Contact Email Notification
Services
Testimonials
```

Achievements dipindahkan ke MVP (§16) karena tabel dan CRUD-nya
menggunakan pola yang sama persis dengan Certificates, sehingga biaya
implementasinya kecil.

---

# 40. Acceptance Criteria

Website dianggap selesai apabila:

### Public

* Website dapat dibuka tanpa login.
* Semua halaman responsive.
* Project dapat ditampilkan dari database.
* Experience dapat ditampilkan dari database.
* Certificate dapat ditampilkan dari database.
* Skill dapat ditampilkan dari database.
* Project memiliki detail page.
* CV dapat diakses.
* Social link dapat diklik.
* SEO metadata tersedia.
* Contact form tersimpan ke database.
* Konten berstatus draft tidak dapat diakses publik, termasuk melalui
  URL langsung.

### Admin

* Admin dapat login.
* Admin dapat menambahkan project.
* Admin dapat mengedit project.
* Admin dapat menghapus project.
* Admin dapat publish/unpublish project.
* Admin dapat menambahkan experience.
* Admin dapat menambahkan certificate.
* Admin dapat mengubah skill.
* Admin dapat mengubah profile.
* Admin dapat upload gambar/file.
* Admin dapat membaca pesan dari contact form.
* Perubahan di admin muncul di public website tanpa deploy ulang.

Catatan teknis untuk poin terakhir: halaman publik dirender statis demi
target performa, sehingga perubahan tidak muncul dengan sendirinya.
Setiap operasi tulis di admin wajib melakukan revalidasi pada halaman
yang terdampak.

---

# 41. Contoh Content Awal

Untuk initial data, portfolio bisa langsung diisi dengan project yang memang sudah kamu punya.

### Projects

```text
Templas
SAPA
NLP BPJS / RAG Chatbot
YOLO Object Detection
Transjakarta Forecasting
Website RBQ
Casir POS
```

### Experience / Project Experience

```text
Web Developer Internship
2026

Full Stack Developer — Templas
2026

Full Stack Developer — SAPA
2025
```

### Skills

```text
HTML
CSS
JavaScript
TypeScript
React
Next.js
PHP
Laravel
Livewire
REST API
Laravel Sanctum
MySQL
PostgreSQL
Supabase
Git
GitHub
Docker
Tailwind CSS
```

Data tersebut **jangan langsung di-hard-code**; semuanya nantinya masuk melalui CMS.

---

# 42. Definition of Done

Project dinyatakan selesai apabila:

```text
✓ Next.js project berjalan
✓ Supabase terhubung
✓ Database schema selesai
✓ Authentication selesai
✓ Admin dashboard selesai
✓ CRUD selesai
✓ Storage selesai
✓ Public portfolio selesai
✓ Responsive selesai
✓ SEO selesai
✓ Dark mode selesai
✓ Content awal dimasukkan
✓ Production build berhasil
✓ Deploy ke Vercel
✓ Domain portfolio aktif
```

---

## Rekomendasi final architecture

Kalau PRD ini kita implementasikan, struktur akhirnya kira-kira:

```text
                   PERSONAL PORTFOLIO
                          │
             ┌────────────┴────────────┐
             │                         │
          PUBLIC                     ADMIN
             │                         │
       Next.js UI                 Admin Dashboard
             │                         │
             └────────────┬────────────┘
                          │
                     Supabase
                          │
             ┌────────────┼────────────┐
             │            │            │
         PostgreSQL      Auth        Storage
             │
       ┌─────┼──────┐
       │     │      │
    Project  Exp.  Certificate
       │
    Skills
       │
   Education
```

**Intinya:** jangan kita buat portfolio yang setiap ada sertifikat baru harus buka VS Code dan edit array. Kita buat **CMS-first portfolio**. Kamu cukup login `/admin`, upload sertifikat atau tambah pengalaman, lalu website publik otomatis mengambil data terbaru.

Dan karena ini akan menjadi **portfolio seorang Web Developer**, CMS tersebut sendiri juga bisa kamu tunjukkan sebagai salah satu bukti kemampuan: *“Portfolio website with custom CMS, Supabase PostgreSQL, authentication, file storage, and dynamic content management.”*
