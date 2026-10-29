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
