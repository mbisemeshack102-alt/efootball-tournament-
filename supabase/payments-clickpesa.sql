-- KICKOFF WINS GIFTS: ClickPesa BillPay payment workflow.
-- Run once in Supabase SQL Editor. Uses manual ClickPesa transaction verification
-- until ClickPesa API access is enabled for the Kem merchant account.

alter table public.tournaments
  add column if not exists entry_fee_tzs integer not null default 0
  check (entry_fee_tzs >= 0);

create table if not exists public.tournament_payments (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  player_id uuid not null references public.profiles(id) on delete cascade,
  amount_tzs integer not null default 0 check (amount_tzs > 0),
  transaction_reference text not null unique,
  status text not null default 'pending' check (status in ('pending','paid','rejected')),
  verified_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.tournament_payments enable row level security;

drop policy if exists "Players submit own payments" on public.tournament_payments;
create policy "Players submit own payments" on public.tournament_payments
  for insert to authenticated with check (
    player_id = auth.uid() and status = 'pending' and verified_by is null
  );

drop policy if exists "Players view own payments and admins view all" on public.tournament_payments;
create policy "Players view own payments and admins view all" on public.tournament_payments
  for select to authenticated using (
    player_id = auth.uid() or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins verify payments" on public.tournament_payments;
create policy "Admins verify payments" on public.tournament_payments
  for update to authenticated using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create or replace function public.kwg_set_payment_amount()
returns trigger language plpgsql security definer set search_path = public
as $$
declare fee integer;
begin
  select entry_fee_tzs into fee from public.tournaments where id = new.tournament_id;
  if fee is null or fee <= 0 then
    raise exception 'Mashindano haya hayana kiingilio cha kulipia.';
  end if;
  new.amount_tzs := fee;
  new.status := 'pending';
  new.verified_by := null;
  return new;
end;
$$;

drop trigger if exists kwg_set_payment_amount on public.tournament_payments;
create trigger kwg_set_payment_amount
before insert on public.tournament_payments
for each row execute function public.kwg_set_payment_amount();

create or replace function public.kwg_register_paid_player()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.status = 'paid' and old.status is distinct from 'paid' then
    insert into public.tournament_registrations(tournament_id, player_id)
    values (new.tournament_id, new.player_id)
    on conflict (tournament_id, player_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists kwg_register_paid_player on public.tournament_payments;
create trigger kwg_register_paid_player
after update of status on public.tournament_payments
for each row execute function public.kwg_register_paid_player();

-- The browser only collects the ClickPesa transaction reference.
-- Admin confirms it against the ClickPesa merchant dashboard before marking paid.
