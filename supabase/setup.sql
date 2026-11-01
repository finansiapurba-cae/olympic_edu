-- Olympic Edu: tabel progres murid. Jalankan sekali di Supabase → SQL Editor → New query → Run.
create table if not exists public.progres (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  username   text not null,
  nama       text,
  kelas      int,
  skor       int,
  dijawab    int,
  benar      int,
  data       jsonb not null default '{}'::jsonb,
  diperbarui timestamptz not null default now()
);

-- Setiap murid hanya bisa membaca dan mengubah progresnya sendiri.
alter table public.progres enable row level security;

drop policy if exists "baca progres sendiri" on public.progres;
drop policy if exists "tambah progres sendiri" on public.progres;
drop policy if exists "ubah progres sendiri" on public.progres;

create policy "baca progres sendiri" on public.progres for select to authenticated using (auth.uid() = user_id);
create policy "tambah progres sendiri" on public.progres for insert to authenticated with check (auth.uid() = user_id);
create policy "ubah progres sendiri" on public.progres for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Masukan (feedback) dari murid. Murid hanya bisa MENGIRIM; hanya admin yang membaca (Table Editor → masukan).
create table if not exists public.masukan (
  id       bigint generated always as identity primary key,
  dibuat   timestamptz not null default now(),
  user_id  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  username text,
  nama     text,
  kelas    int,
  jenis    text not null check (jenis in ('saran', 'masalah', 'soal', 'lainnya')),
  nilai    int check (nilai between 1 and 5),
  pesan    text not null check (char_length(pesan) between 1 and 2000),
  soal_id  text,
  halaman  text,
  bahasa   text
);

alter table public.masukan enable row level security;

drop policy if exists "kirim masukan sendiri" on public.masukan;
create policy "kirim masukan sendiri" on public.masukan for insert to authenticated with check (auth.uid() = user_id);

-- ================= Dashboard guru =================
-- Daftar akun guru. Tidak ada aturan baca, jadi tabel ini hanya terlihat dari dashboard Supabase.
create table if not exists public.guru (email text primary key);
alter table public.guru enable row level security;

create or replace function public.is_guru() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.guru where email = (auth.jwt() ->> 'email'));
$$;
revoke all on function public.is_guru() from public, anon;
grant execute on function public.is_guru() to authenticated;

-- Setiap jawaban yang diperiksa murid (satu baris per soal).
create table if not exists public.jawaban (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  username   text not null,
  nama       text,
  kelas      int,
  soal_id    text not null,
  soal_kelas int,
  paket      text,
  topik      text,
  tingkat    text,
  mode       text,
  pilihan    text not null,
  kunci      text not null,
  benar      boolean not null,
  waktu      timestamptz not null default now()
);
create index if not exists jawaban_waktu_idx on public.jawaban (waktu desc);
create index if not exists jawaban_user_idx on public.jawaban (user_id);
alter table public.jawaban enable row level security;

drop policy if exists "kirim jawaban sendiri" on public.jawaban;
drop policy if exists "guru baca jawaban" on public.jawaban;
drop policy if exists "guru baca progres" on public.progres;
drop policy if exists "guru baca masukan" on public.masukan;

create policy "kirim jawaban sendiri" on public.jawaban for insert to authenticated with check (auth.uid() = user_id);
create policy "guru baca jawaban" on public.jawaban for select to authenticated using (public.is_guru());
create policy "guru baca progres" on public.progres for select to authenticated using (public.is_guru());
create policy "guru baca masukan" on public.masukan for select to authenticated using (public.is_guru());

-- Akun guru: buat dulu user guru@siswa.olympicedu.app di Authentication → Users (centang Auto Confirm User).
insert into public.guru (email) values ('guru@siswa.olympicedu.app') on conflict do nothing;
