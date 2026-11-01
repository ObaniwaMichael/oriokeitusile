insert into public.site_settings (
  church_name,
  subtitle,
  branch_name,
  address,
  phone_primary,
  phone_secondary,
  tagline,
  minister_in_charge,
  about,
  logo_url,
  campaign_title,
  campaign_theme,
  campaign_scripture,
  campaign_time,
  campaign_venue,
  campaign_start_date,
  campaign_end_date,
  maps_embed_url,
  maps_link,
  socials
)
select
  'Cherubim & Seraphim Unification Church of Nigeria',
  'The Eternal Sacred Order of the Cherubim and Seraphim',
  'Ijo Itusile (Sanctuary of Freedom)',
  'No 23, Shofoluwe Street (Chief Bakery), Odan Ilogbo Eremi Phase 1, Along Badagry Expressway, Lagos',
  '08084357473',
  '08132630799',
  'Come, Be Refreshed. Be Healed. Be Transformed.',
  'S/M/I Obaniwa Mary',
  'Ijo Itusile — the Sanctuary of Freedom — is a branch of the Cherubim & Seraphim Unification Church of Nigeria. We gather each week to worship, pray, and welcome every visitor into the overflowing life of God. Our Minister in Charge and host is S/M/I Obaniwa Mary.',
  '/logo.png',
  'Sundays of Power',
  'Golden Waters',
  'Ezekiel 47:1-12',
  '9:00 AM prompt',
  'Church Auditorium',
  '2026-11-01',
  '2026-11-30',
  'https://www.google.com/maps?q=Shofoluwe+Street+Odan+Ilogbo+Eremi+Lagos&output=embed',
  'https://www.google.com/maps/search/?api=1&query=No+23+Shofoluwe+Street+Odan+Ilogbo+Eremi+Phase+1+Lagos',
  '{}'::jsonb
where not exists (select 1 from public.site_settings);

insert into public.announcements (
  title,
  body,
  is_pinned,
  publish_at,
  status
)
select
  'Sundays of Power: Golden Waters',
  'Join us every Sunday in November at 9 AM prompt in the Church Auditorium. Theme: Golden Waters (Ezekiel 47:1-12). Minister in Charge & Host: S/M/I Obaniwa Mary. Come, be refreshed. Be healed. Be transformed.',
  true,
  now(),
  'published'
where not exists (
  select 1 from public.announcements where title = 'Sundays of Power: Golden Waters'
);

insert into public.events (
  title,
  description,
  starts_at,
  location,
  is_recurring_weekly
)
select
  'Sundays of Power',
  'Golden Waters (Ezekiel 47:1-12). Every Sunday in November, 9 AM prompt.',
  '2026-11-01 09:00:00+01',
  'Church Auditorium',
  true
where not exists (
  select 1 from public.events where title = 'Sundays of Power'
);
