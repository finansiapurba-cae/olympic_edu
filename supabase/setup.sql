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
