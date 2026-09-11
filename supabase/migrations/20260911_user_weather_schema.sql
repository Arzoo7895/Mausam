create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  temperature_unit text not null default 'celsius',
  wind_unit text not null default 'kmh',
  theme text not null default 'system',
  language text not null default 'en',
  persona text not null default 'traveler',
  reduced_motion boolean not null default false,
  high_contrast boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_id text,
  name text not null,
  region text,
  country text,
  country_code text,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists saved_locations_user_provider_idx on public.saved_locations(user_id, provider_id) where provider_id is not null;
create unique index if not exists saved_locations_user_coordinates_idx on public.saved_locations(user_id, round(latitude::numeric, 2), round(longitude::numeric, 2));

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.saved_locations enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists preferences_own on public.user_preferences;
create policy preferences_own on public.user_preferences for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists saved_locations_own on public.saved_locations;
create policy saved_locations_own on public.saved_locations for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
