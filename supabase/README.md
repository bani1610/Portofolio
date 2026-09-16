# Supabase — schema, RLS, seed

Semua perubahan skema ditulis sebagai file SQL di sini, **bukan** lewat SQL editor di dashboard. Skema harus bisa direproduksi dari nol dan masuk version control (IMPLEMENTATION.md Fase 1).

## Isi

```text
migrations/
├── 20260916000001_helpers.sql   pgcrypto, trigger set_updated_at()
├── 20260916000002_schema.sql    13 tabel, constraint, index, is_admin()
├── 20260916000003_rls.sql       RLS + policy seluruh tabel
└── 20260916000004_storage.sql   6 bucket + policy tulis khusus admin
seed.sql                         konten awal (PRD §41)
tests/
├── 00_stubs.sql                 stub auth/storage untuk Postgres polos
├── 01_rls_test.sql              assertion RLS + constraint
└── run.sh                       jalankan seluruhnya di container sekali pakai
```

## Menjalankan test

Membuktikan exit criteria Fase 1 tanpa menyentuh project Supabase sungguhan. Butuh Docker.

```bash
bash supabase/tests/run.sh
```

Script membuat container Postgres sekali pakai, menerapkan stub → seluruh migrasi → assertion, lalu menghapus containernya. Assertion yang gagal menghentikan proses dengan exit code bukan nol.

`tests/00_stubs.sql` hanya untuk keperluan test — berisi tiruan minimal `auth.users`, `auth.uid()`, dan `storage.objects` yang di Supabase sudah tersedia. File ini tidak pernah diterapkan ke database sungguhan.

## Menerapkan ke project Supabase

Urutan file adalah urutan penerapan. Setelah migrasi terpasang:

1. Buat akun admin lewat dashboard Supabase (Authentication → Users → Add user).
2. Masukkan `user_id` akun tersebut ke `admin_users`:

   ```sql
   insert into public.admin_users (user_id) values ('<user-id>');
   ```

3. Matikan registrasi publik (Authentication → Providers → Email → Allow new users to sign up: off).

Langkah 2 sengaja manual dan tidak punya policy INSERT — bahkan admin tidak bisa mempromosikan akun lain lewat aplikasi.

## Catatan seed

`seed.sql` hanya mengisi yang tertulis sebagai fakta di PRD: nama teknologi, judul project, institusi pendidikan, dan copy About/hero.

Deskripsi project, role, challenge, dan hasil **tidak diisi** — itu menggambarkan pekerjaan nyata dan hanya pemiliknya yang bisa menuliskannya dengan benar. Karena itu seluruh project dan experience masuk sebagai **draft**: muncul di admin siap diisi, tidak muncul di website publik sampai sengaja di-publish.

Social links di-seed dengan `visible = false` karena URL-nya belum diketahui. Link yang mengarah ke profil salah lebih buruk daripada tidak ada link.
