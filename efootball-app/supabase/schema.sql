-- KICKOFF WINS GIFTS starter database
-- Run in Supabase SQL Editor. Review policies before production launch.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  country text not null default 'Tanzania',
  role text not null default 'player' check (role in ('player', 'moderator', 'admin')),
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id),
  title text not null,
  description text,
  format text not null default 'knockout' check (format in ('solo', 'duo', 'squad', 'league', 'knockout', 'groups')),
  status text not null default 'draft' check (status in ('draft', 'published', 'registration_open', 'ongoing', 'completed', 'cancelled')),
  starts_at timestamptz,
  registration_closes_at timestamptz,
  max_players integer check (max_players is null or max_players > 1),
  prize_description text,
  rules text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tournament_participants (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  team_name text,
  status text not null default 'registered' check (status in ('registered', 'confirmed', 'eliminated', 'withdrawn')),
  seed integer,
  created_at timestamptz not null default now(),
  unique (tournament_id, player_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  round_name text,
  scheduled_at timestamptz,
  player_one uuid references public.profiles(id),
  player_two uuid references public.profiles(id),
  score_one integer,
  score_two integer,
  winner_id uuid references public.profiles(id),
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'pending_review', 'completed', 'disputed', 'cancelled')),
  result_reported_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.tournament_messages (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  category text not null default 'announcement',
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists tournaments_game_status_idx on public.tournaments(game_id, status);
create index if not exists tournaments_starts_at_idx on public.tournaments(starts_at);
create index if not exists participants_player_idx on public.tournament_participants(player_id);
create index if not exists matches_tournament_idx on public.matches(tournament_id, scheduled_at);
create index if not exists messages_tournament_created_idx on public.tournament_messages(tournament_id, created_at);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'moderator')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_username text;
begin
  chosen_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    'player_' || substr(new.id::text, 1, 8)
  );
  insert into public.profiles (id, username, display_name)
  values (new.id, chosen_username, coalesce(new.raw_user_meta_data ->> 'display_name', chosen_username))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.tournaments enable row level security;
alter table public.tournament_participants enable row level security;
alter table public.matches enable row level security;
alter table public.tournament_messages enable row level security;
alter table public.updates enable row level security;

create policy "profiles are visible to players" on public.profiles
for select to authenticated using (true);
create policy "players update own profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid() and role = 'player');
create policy "admins manage profiles" on public.profiles
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "active games are public" on public.games
for select to anon, authenticated using (is_active or public.is_admin());
create policy "admins manage games" on public.games
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "published tournaments are visible" on public.tournaments
for select to anon, authenticated using (status <> 'draft' or public.is_admin());
create policy "admins manage tournaments" on public.tournaments
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "players see own entries or admins see all" on public.tournament_participants
for select to authenticated using (player_id = auth.uid() or public.is_admin());
create policy "players register themselves" on public.tournament_participants
for insert to authenticated with check (player_id = auth.uid());
create policy "admins manage entries" on public.tournament_participants
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "players see their tournament matches" on public.matches
for select to authenticated using (
  public.is_admin()
  or player_one = auth.uid()
  or player_two = auth.uid()
  or exists (
    select 1 from public.tournament_participants tp
    where tp.tournament_id = matches.tournament_id and tp.player_id = auth.uid()
  )
);
create policy "admins manage matches" on public.matches
for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "participants read tournament chat" on public.tournament_messages
for select to authenticated using (
  public.is_admin()
  or exists (
    select 1 from public.tournament_participants tp
    where tp.tournament_id = tournament_messages.tournament_id and tp.player_id = auth.uid()
  )
);
create policy "participants send tournament chat" on public.tournament_messages
for insert to authenticated with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.tournament_participants tp
    where tp.tournament_id = tournament_messages.tournament_id and tp.player_id = auth.uid()
  )
);

create policy "published updates are public" on public.updates
for select to anon, authenticated using (published or public.is_admin());
create policy "admins manage updates" on public.updates
for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.games (name, slug) values
  ('PUBG Mobile', 'pubg-mobile'),
  ('eFootball', 'efootball'),
  ('Free Fire', 'free-fire')
on conflict (slug) do nothing;

-- Prevent players from changing their own role or match statistics.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() = old.id and not public.is_admin() then
    new.role := old.role;
    new.wins := old.wins;
    new.losses := old.losses;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields
before update on public.profiles
for each row execute procedure public.protect_profile_fields();

-- IMPORTANT:
-- Promote the first trusted administrator manually from the Supabase SQL Editor.
-- Never allow users to set their own role from the mobile app.
