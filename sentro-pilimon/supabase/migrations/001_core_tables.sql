-- Migration 001: Core Tables for Sentro Pilimon
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null check (role in ('student','officer','office_staff','moderator','admin')),
  status text not null default 'active' check (status in ('active','inactive')),
  org_id uuid,
  office_id uuid,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ORGANIZATIONS
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  banner_url text,
  accent_color text default '#6B0000',
  short_description text,
  contact_email text,
  social_links jsonb default '{}',
  member_count int default 0,
  founded_year int,
  adviser_name text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

-- OFFICES
create table public.offices (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  banner_url text,
  accent_color text default '#6B0000',
  short_description text,
  contact_email text,
  social_links jsonb default '{}',
  college text,
  channel_type text default 'department' check (channel_type in ('department','office','admin')),
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

-- EVENT CATEGORIES
create table public.event_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text unique not null,
  color text not null default '#6B0000',
  icon text,
  description text,
  sort_order int not null default 0
);

-- Seed default categories
insert into public.event_categories (name, slug, color, icon, sort_order) values
  ('Academic', 'academic', '#1E3A5F', 'BookOpen', 1),
  ('Co-curricular', 'co-curricular', '#6B0000', 'Users', 2),
  ('Administrative', 'administrative', '#5A5A56', 'Building2', 3),
  ('Recruitment', 'recruitment', '#1A6B3C', 'UserPlus', 4),
  ('Sports', 'sports', '#7B3F00', 'Trophy', 5),
  ('Cultural', 'cultural', '#4A1A7A', 'Music', 6),
  ('Community Service', 'community-service', '#C9972C', 'Heart', 7),
  ('General', 'general', '#9A9A95', 'Megaphone', 8);

-- ANNOUNCEMENTS (central table)
create table public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  start_datetime timestamptz not null,
  end_datetime timestamptz not null,
  venue text,
  status text not null default 'draft'
    check (status in ('draft','pending','approved','published','archived')),
  publisher_user_id uuid not null references public.users(id),
  org_id uuid references public.organizations(id),
  office_id uuid references public.offices(id),
  category_id uuid not null references public.event_categories(id),
  poster_url text,
  poster_thumbnail_url text,
  tags text[] default '{}',
  view_count int not null default 0,
  moderator_remarks text,
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint end_after_start check (end_datetime > start_datetime),
  constraint org_or_office check (
    (org_id is not null and office_id is null) or
    (office_id is not null and org_id is null) or
    (org_id is null and office_id is null)
  )
);

-- Full-text search index
create index announcements_fts_idx on public.announcements
  using gin(to_tsvector('english', title || ' ' || description));
create index announcements_status_idx on public.announcements(status);
create index announcements_category_idx on public.announcements(category_id);
create index announcements_start_idx on public.announcements(start_datetime);
create index announcements_org_idx on public.announcements(org_id);

-- QR LINKS
create table public.qr_links (
  id uuid primary key default uuid_generate_v4(),
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  qr_code_url text not null,
  target_url text not null,
  is_active boolean not null default true,
  scan_count int not null default 0,
  generated_at timestamptz not null default now(),
  unique(announcement_id)
);

-- RSVP RECORDS
create table public.rsvp_records (
  id uuid primary key default uuid_generate_v4(),
  announcement_id uuid not null references public.announcements(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  rsvp_status text not null check (rsvp_status in ('interested','going','attended','cancelled')),
  check_in_token text unique,
  token_expires_at timestamptz,
  token_used boolean not null default false,
  check_in_time timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(announcement_id, user_id)
);

-- AUDIT LOGS
create table public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id),
  announcement_id uuid references public.announcements(id),
  action_type text not null,
  action_timestamp timestamptz not null default now(),
  details jsonb default '{}'
);
create index audit_logs_user_idx on public.audit_logs(user_id);
create index audit_logs_action_idx on public.audit_logs(action_type);
create index audit_logs_ts_idx on public.audit_logs(action_timestamp desc);

-- CHANNEL FOLLOWS
create table public.channel_follows (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  channel_type text not null check (channel_type in ('org','department','plmun')),
  channel_id uuid,
  followed_at timestamptz not null default now(),
  unique(user_id, channel_type, channel_id)
);

-- Seed PLMun departments
insert into public.offices
  (name, slug, accent_color, short_description, college, channel_type)
values
  ('CITCS', 'citcs', '#0D47A1',
   'College of Information Technology and Computer Studies',
   'College of Information Technology and Computer Studies', 'department'),
  ('CAS', 'cas', '#1A6B3C',
   'College of Arts and Sciences',
   'College of Arts and Sciences', 'department'),
  ('CBA', 'cba', '#854F0B',
   'College of Business Administration',
   'College of Business Administration', 'department'),
  ('CTE', 'cte', '#4A1A7A',
   'College of Teacher Education',
   'College of Teacher Education', 'department'),
  ('COE', 'coe', '#7B3F00',
   'College of Engineering',
   'College of Engineering', 'department'),
  ('CON', 'con', '#1E3A5F',
   'College of Nursing',
   'College of Nursing', 'department'),
  ('OSA', 'osa', '#6B0000',
   'Office of Student Affairs',
   NULL, 'admin'),
  ('Registrar', 'registrar', '#5A5A56',
   'Office of the University Registrar',
   NULL, 'office'),
  ('MIS', 'mis', '#2C2C2A',
   'Management Information Systems Office',
   NULL, 'office');