-- Migration: 20260912_profile_schema_update.sql
-- Description: Add missing profile fields, user preferences columns, RLS insert policy, and user provisioning trigger.

-- 1. Safely add missing columns to public.profiles
alter table public.profiles
  add column if not exists home_location text,
  add column if not exists bio text;

-- 2. Safely add notification preference columns to public.user_preferences
alter table public.user_preferences
  add column if not exists alerts boolean not null default true,
  add column if not exists daily_brief boolean not null default true,
  add column if not exists severe_weather boolean not null default true;

-- 3. Add ownership-based INSERT policy for authenticated users on public.profiles
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

-- 4. User provisioning trigger on auth.users for signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do update set
    full_name = case
      when public.profiles.full_name is null or public.profiles.full_name = ''
      then coalesce(excluded.full_name, public.profiles.full_name)
      else public.profiles.full_name
    end;

  insert into public.user_preferences (user_id, language, theme, persona)
  values (new.id, 'en', 'system', 'traveler')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
