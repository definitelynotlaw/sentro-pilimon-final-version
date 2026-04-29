-- Migration 003: Functions and Triggers

-- Auto-update updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger announcements_updated_at
  before update on public.announcements
  for each row execute function public.handle_updated_at();

create trigger rsvp_updated_at
  before update on public.rsvp_records
  for each row execute function public.handle_updated_at();

create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Increment view count
create or replace function public.increment_view_count(announcement_uuid uuid)
returns void language sql security definer as $$
  update public.announcements
  set view_count = view_count + 1
  where id = announcement_uuid and status = 'published';
$$;

-- Increment QR scan count
create or replace function public.increment_scan_count(qr_uuid uuid)
returns void language sql security definer as $$
  update public.qr_links
  set scan_count = scan_count + 1
  where id = qr_uuid;
$$;