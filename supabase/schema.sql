-- KICKOFF WINS GIFTS: run this in Supabase SQL Editor.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'player' check (role in ('player','admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  game text not null,
  status text not null default 'open' check (status in ('open','ongoing','completed','cancelled')),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create table if not exists public.tournament_registrations (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(tournament_id, player_id)
);
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id, display_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)), 'player')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_registrations enable row level security;

drop policy if exists "Signed-in users can view profiles" on public.profiles;
create policy "Signed-in users can view profiles" on public.profiles
for select to authenticated using (true);
-- Profile role is intentionally not user-editable. Promote admins manually in SQL.

drop policy if exists "Anyone can view tournaments" on public.tournaments;
create policy "Anyone can view tournaments" on public.tournaments
for select to authenticated using (true);
drop policy if exists "Admins create tournaments" on public.tournaments;
create policy "Admins create tournaments" on public.tournaments
for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
drop policy if exists "Admins update tournaments" on public.tournaments;
create policy "Admins update tournaments" on public.tournaments
for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
drop policy if exists "Admins delete tournaments" on public.tournaments;
create policy "Admins delete tournaments" on public.tournaments
for delete to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "Players view own registrations and admins view all" on public.tournament_registrations;
create policy "Players view own registrations and admins view all" on public.tournament_registrations
for select to authenticated using (
  player_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
drop policy if exists "Players register themselves" on public.tournament_registrations;
create policy "Players register themselves" on public.tournament_registrations
for insert to authenticated with check (player_id = auth.uid());
drop policy if exists "Admins manage registrations" on public.tournament_registrations;
create policy "Admins manage registrations" on public.tournament_registrations
for delete to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- After creating your own account, promote it by replacing EMAIL below:
-- update public.profiles p set role = 'admin'
-- from auth.users u where p.id = u.id and u.email = 'YOUR_ADMIN_EMAIL';


-- Gift dashboard schema and row-level security
create table if not exists public.gifts (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 description text not null default '',
 status text not null default 'available' check (status in ('available','paused')),
 created_by uuid not null references public.profiles(id),
 created_at timestamptz not null default now()
);
create table if not exists public.gift_claims (
 id uuid primary key default gen_random_uuid(),
 gift_id uuid not null references public.gifts(id) on delete cascade,
 player_id uuid not null references public.profiles(id) on delete cascade,
 status text not null default 'pending' check (status in ('pending','delivered')),
 created_at timestamptz not null default now(),
 unique(gift_id, player_id)
);
alter table public.gifts enable row level security;
alter table public.gift_claims enable row level security;
drop policy if exists "Authenticated users view gifts" on public.gifts;
create policy "Authenticated users view gifts" on public.gifts for select to authenticated using (true);
drop policy if exists "Admins manage gifts" on public.gifts;
create policy "Admins manage gifts" on public.gifts for all to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'))
with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
drop policy if exists "Players view gift claims" on public.gift_claims;
create policy "Players view gift claims" on public.gift_claims for select to authenticated
using (player_id=auth.uid() or exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
drop policy if exists "Players claim gifts" on public.gift_claims;
create policy "Players claim gifts" on public.gift_claims for insert to authenticated with check (player_id=auth.uid());
drop policy if exists "Admins update gift claims" on public.gift_claims;
create policy "Admins update gift claims" on public.gift_claims for update to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'))
with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
