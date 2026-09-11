-- Migration: 20260912_user_alerts_schema.sql
-- Description: Create public.user_alerts table with RLS, indexes, and add notification_settings to user_preferences

-- 1. Create public.user_alerts table
create table if not exists public.user_alerts (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  alert_type text not null,
  title text not null,
  location_name text not null,
  detail text not null,
  timestamp text not null,
  relative_time text not null default 'Recent',
  severity text not null default 'low',
  unread boolean not null default true,
  favorite boolean not null default false,
  archived boolean not null default false,
  dismissed boolean not null default false,
  expires_at text,
  temperature text,
  insight text,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Indexes for efficient lookup
create index if not exists user_alerts_user_id_idx on public.user_alerts(user_id);
create index if not exists user_alerts_location_idx on public.user_alerts(user_id, location_name);
create index if not exists user_alerts_unread_idx on public.user_alerts(user_id, unread) where unread = true;

-- 3. Row Level Security: Authenticated users can only read and modify their own alerts
alter table public.user_alerts enable row level security;

drop policy if exists user_alerts_own on public.user_alerts;
create policy user_alerts_own on public.user_alerts
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 4. Safely add notification_settings column to public.user_preferences if missing
alter table public.user_preferences
  add column if not exists notification_settings jsonb;
