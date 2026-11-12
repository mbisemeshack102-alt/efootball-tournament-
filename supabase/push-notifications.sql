-- KICKOFF WINS GIFTS: Web Push subscriptions
-- Run once in Supabase Dashboard > SQL Editor.

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  subscription jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx
  on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

-- Intentionally create no client policies.
-- The Edge Function accesses this table using SUPABASE_SERVICE_ROLE_KEY,
-- and verifies the signed-in user's identity / admin role before any action.
