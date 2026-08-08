-- =============================================================================
-- Rudra Guruji Seva Trust — database schema
-- =============================================================================
-- Run this in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- It is idempotent, so it is safe to re-run after edits.
--
-- Security model: the public may read published events and all categories.
-- Every write is restricted to the single master admin, identified by a row in
-- public.admin_users. See the "Seeding the master admin" note at the bottom.
-- =============================================================================

create extension if not exists "pgcrypto";  -- gen_random_uuid()

-- -----------------------------------------------------------------------------
-- Admin identity
-- -----------------------------------------------------------------------------
-- A one-row table rather than a hard-coded email, so the admin account can be
-- rotated without editing every policy.
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so policies can read admin_users without granting the
-- public role direct select on it. search_path is pinned to block hijacking.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;

-- -----------------------------------------------------------------------------
-- categories
-- -----------------------------------------------------------------------------
-- `name` holds the English label; `translations` holds the others, keyed by the
-- locale codes the site supports (hi, te, kn):
--   {"hi": {"name": "अन्नदान"}, "te": {"name": "అన్నదానం"}, "kn": {"name": "ಅನ್ನದಾನ"}}
-- A jsonb column rather than one column per language means adding a fifth
-- locale later needs no migration. Missing keys fall back to English.
create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null,
  color        text,                    -- hex like '#E2711D', used for badges
  translations jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  constraint categories_name_key unique (name),
  constraint categories_slug_key unique (slug),
  constraint categories_name_not_blank check (length(btrim(name)) > 0)
);

-- Safe to re-run against a database created before translations were added.
alter table public.categories
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- -----------------------------------------------------------------------------
-- events
-- -----------------------------------------------------------------------------
-- `images` holds an ordered array of public Storage URLs. An array (not a child
-- table) because order matters, the list is always read whole, and it is never
-- queried by individual element.
-- `title`/`description` are the English original. `translations` carries the
-- other locales in the same shape, so the admin can fill in as many as they
-- have; anything missing falls back to English rather than showing blank.
--   {"te": {"title": "…", "description": "…"}, "kn": {…}, "hi": {…}}
create table if not exists public.events (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text not null default '',
  images       text[] not null default '{}',
  translations jsonb not null default '{}'::jsonb,
  event_date   date not null default current_date,
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint events_title_not_blank check (length(btrim(title)) > 0)
);

-- Safe to re-run against a database created before translations were added.
alter table public.events
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- -----------------------------------------------------------------------------
-- event_categories (join)
-- -----------------------------------------------------------------------------
create table if not exists public.event_categories (
  event_id    uuid not null references public.events (id)     on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (event_id, category_id)
);

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------
-- The public feed is "published events, newest first".
create index if not exists events_feed_idx
  on public.events (event_date desc, created_at desc)
  where published;

create index if not exists event_categories_category_idx
  on public.event_categories (category_id);

-- -----------------------------------------------------------------------------
-- updated_at maintenance
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.admin_users      enable row level security;
alter table public.categories       enable row level security;
alter table public.events           enable row level security;
alter table public.event_categories enable row level security;

-- admin_users: only the admin may look at it; nobody may write from the client.
drop policy if exists "admin reads admin_users" on public.admin_users;
create policy "admin reads admin_users"
  on public.admin_users for select
  using (public.is_admin());

-- categories: world-readable, admin-writable.
drop policy if exists "categories are public" on public.categories;
create policy "categories are public"
  on public.categories for select
  using (true);

drop policy if exists "admin writes categories" on public.categories;
create policy "admin writes categories"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- events: the public sees published rows; the admin sees and edits everything.
drop policy if exists "published events are public" on public.events;
create policy "published events are public"
  on public.events for select
  using (published or public.is_admin());

drop policy if exists "admin writes events" on public.events;
create policy "admin writes events"
  on public.events for all
  using (public.is_admin())
  with check (public.is_admin());

-- event_categories: readable when its event is readable.
drop policy if exists "event links are public" on public.event_categories;
create policy "event links are public"
  on public.event_categories for select
  using (
    exists (
      select 1 from public.events e
      where e.id = event_categories.event_id
        and (e.published or public.is_admin())
    )
  );

drop policy if exists "admin writes event links" on public.event_categories;
create policy "admin writes event links"
  on public.event_categories for all
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- Storage bucket for event photos
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do update set public = true;

drop policy if exists "event images are public" on storage.objects;
create policy "event images are public"
  on storage.objects for select
  using (bucket_id = 'event-images');

drop policy if exists "admin uploads event images" on storage.objects;
create policy "admin uploads event images"
  on storage.objects for insert
  with check (bucket_id = 'event-images' and public.is_admin());

drop policy if exists "admin updates event images" on storage.objects;
create policy "admin updates event images"
  on storage.objects for update
  using (bucket_id = 'event-images' and public.is_admin())
  with check (bucket_id = 'event-images' and public.is_admin());

drop policy if exists "admin deletes event images" on storage.objects;
create policy "admin deletes event images"
  on storage.objects for delete
  using (bucket_id = 'event-images' and public.is_admin());

-- -----------------------------------------------------------------------------
-- Starter categories
-- -----------------------------------------------------------------------------
-- Seeded with all four languages so the public filter reads correctly from the
-- first page load, in every locale.
insert into public.categories (name, slug, color, translations) values
  ('Annadhanam', 'annadhanam', '#E2711D', '{"hi":{"name":"अन्नदान"},"te":{"name":"అన్నదానం"},"kn":{"name":"ಅನ್ನದಾನ"}}'),
  ('Farmer Support', 'farmer-support', '#4C8B3F', '{"hi":{"name":"किसान सहायता"},"te":{"name":"రైతు సహాయం"},"kn":{"name":"ರೈತರ ನೆರವು"}}'),
  ('Medical Aid', 'medical-aid', '#2F6FA5', '{"hi":{"name":"चिकित्सा सहायता"},"te":{"name":"వైద్య సహాయం"},"kn":{"name":"ವೈದ್ಯಕೀಯ ನೆರವು"}}'),
  ('Financial Help', 'financial-help', '#9B3D8B', '{"hi":{"name":"आर्थिक सहायता"},"te":{"name":"ఆర్థిక సహాయం"},"kn":{"name":"ಆರ್ಥಿಕ ನೆರವು"}}'),
  ('Vidya Daanam', 'vidya-daanam', '#6B4CA8', '{"hi":{"name":"विद्या दान"},"te":{"name":"విద్యా దానం"},"kn":{"name":"ವಿದ್ಯಾ ದಾನ"}}'),
  ('Utsava', 'utsava', '#B32B2B', '{"hi":{"name":"उत्सव"},"te":{"name":"ఉత్సవం"},"kn":{"name":"ಉತ್ಸವ"}}')
on conflict (slug) do nothing;

-- =============================================================================
-- Seeding the master admin
-- =============================================================================
-- 1. Dashboard → Authentication → Users → "Add user" → create the one admin
--    account with an email and password. Tick "Auto Confirm User".
-- 2. Disable public sign-ups so no second account can ever be created:
--    Authentication → Sign In / Providers → Email → turn OFF "Allow new users
--    to sign up".
-- 3. Run the statement below, substituting the real address:
--
--      insert into public.admin_users (user_id, email)
--      select id, email from auth.users where email = 'admin@example.com'
--      on conflict (user_id) do nothing;
--
-- 4. Verify — this must return exactly one row:
--
--      select * from public.admin_users;
-- =============================================================================
