create extension if not exists "pgcrypto";

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  church_name text not null,
  subtitle text not null,
  branch_name text not null,
  address text not null,
  phone_primary text not null,
  phone_secondary text not null,
  tagline text not null,
  minister_in_charge text not null,
  about text not null default '',
  logo_url text not null default '/logo.png',
  campaign_title text not null,
  campaign_theme text not null,
  campaign_scripture text not null,
  campaign_time text not null,
  campaign_venue text not null,
  campaign_start_date date not null,
  campaign_end_date date not null,
  maps_embed_url text not null default '',
  maps_link text not null default '',
  socials jsonb not null default '{}'::jsonb,
  bank_name text not null default '',
  bank_account_name text not null default '',
  bank_account_number text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('super_admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.live_streams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  youtube_id text not null,
  scheduled_at timestamptz not null,
  status text not null check (status in ('upcoming', 'live', 'ended')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  image_url text,
  is_pinned boolean not null default false,
  publish_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text not null default '',
  is_recurring_weekly boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  name text,
  email text,
  phone text,
  category text not null,
  amount integer not null check (amount >= 10000),
  currency text not null default 'NGN',
  status text not null check (status in ('pending', 'success', 'failed')),
  note text,
  is_anonymous boolean not null default false,
  paystack_access_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists live_streams_featured_status_idx
  on public.live_streams (is_featured, status);

create index if not exists announcements_pinned_publish_idx
  on public.announcements (is_pinned, publish_at desc);

create unique index if not exists donations_reference_idx
  on public.donations (reference);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid()
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where user_id = auth.uid()
      and role = 'super_admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_super_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists live_streams_updated_at on public.live_streams;
create trigger live_streams_updated_at
before update on public.live_streams
for each row execute function public.set_updated_at();

drop trigger if exists announcements_updated_at on public.announcements;
create trigger announcements_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists donations_updated_at on public.donations;
create trigger donations_updated_at
before update on public.donations
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.admins enable row level security;
alter table public.live_streams enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.donations enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings"
  on public.site_settings for select
  using (true);

drop policy if exists "admins can update site settings" on public.site_settings;
create policy "admins can update site settings"
  on public.site_settings for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can insert site settings" on public.site_settings;
create policy "admins can insert site settings"
  on public.site_settings for insert
  with check (public.is_admin());

drop policy if exists "admins can read admins" on public.admins;
create policy "admins can read admins"
  on public.admins for select
  using (public.is_admin());

drop policy if exists "super admins manage admins" on public.admins;
create policy "super admins manage admins"
  on public.admins for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

drop policy if exists "public can read live streams" on public.live_streams;
create policy "public can read live streams"
  on public.live_streams for select
  using (true);

drop policy if exists "admins write live streams" on public.live_streams;
create policy "admins write live streams"
  on public.live_streams for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "public can read published announcements" on public.announcements;
create policy "public can read published announcements"
  on public.announcements for select
  using (
    status = 'published'
    and publish_at <= now()
    and (expires_at is null or expires_at > now())
  );

drop policy if exists "admins read all announcements" on public.announcements;
create policy "admins read all announcements"
  on public.announcements for select
  using (public.is_admin());

drop policy if exists "admins write announcements" on public.announcements;
create policy "admins write announcements"
  on public.announcements for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "public can read events" on public.events;
create policy "public can read events"
  on public.events for select
  using (true);

drop policy if exists "admins write events" on public.events;
create policy "admins write events"
  on public.events for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "super admins read donations" on public.donations;
create policy "super admins read donations"
  on public.donations for select
  using (public.is_super_admin());

drop policy if exists "public can submit contact messages" on public.contact_messages;
create policy "public can submit contact messages"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "admins manage contact messages" on public.contact_messages;
create policy "admins manage contact messages"
  on public.contact_messages for all
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('church-media', 'church-media', true)
on conflict (id) do nothing;

drop policy if exists "public read church media" on storage.objects;
create policy "public read church media"
  on storage.objects for select
  using (bucket_id = 'church-media');

drop policy if exists "admins upload church media" on storage.objects;
create policy "admins upload church media"
  on storage.objects for insert
  with check (bucket_id = 'church-media' and public.is_admin());

drop policy if exists "admins update church media" on storage.objects;
create policy "admins update church media"
  on storage.objects for update
  using (bucket_id = 'church-media' and public.is_admin());

drop policy if exists "admins delete church media" on storage.objects;
create policy "admins delete church media"
  on storage.objects for delete
  using (bucket_id = 'church-media' and public.is_admin());
