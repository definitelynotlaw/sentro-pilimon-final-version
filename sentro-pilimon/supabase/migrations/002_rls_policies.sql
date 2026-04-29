-- Migration 002: Row-Level Security Policies

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.organizations enable row level security;
alter table public.offices enable row level security;
alter table public.event_categories enable row level security;
alter table public.announcements enable row level security;
alter table public.qr_links enable row level security;
alter table public.rsvp_records enable row level security;
alter table public.audit_logs enable row level security;
alter table public.channel_follows enable row level security;

-- Helper function: get current user role
create or replace function public.current_user_role()
returns text language sql security definer stable as $$
  select role from public.users where id = auth.uid()
$$;

-- USERS policies
create policy "Users can view own profile"
  on public.users for select using (id = auth.uid());
create policy "Admins can view all users"
  on public.users for select using (public.current_user_role() = 'admin');
create policy "Users can update own profile"
  on public.users for update using (id = auth.uid());
create policy "Admins can manage all users"
  on public.users for all using (public.current_user_role() = 'admin');

-- ORGANIZATIONS & OFFICES — public read
create policy "Anyone can view active organizations"
  on public.organizations for select using (status = 'active');
create policy "Admins can manage organizations"
  on public.organizations for all using (public.current_user_role() = 'admin');

create policy "Anyone can view active offices"
  on public.offices for select using (status = 'active');
create policy "Admins can manage offices"
  on public.offices for all using (public.current_user_role() = 'admin');

-- EVENT CATEGORIES — public read
create policy "Anyone can view categories"
  on public.event_categories for select using (true);
create policy "Admins can manage categories"
  on public.event_categories for all using (public.current_user_role() = 'admin');

-- ANNOUNCEMENTS policies
-- Public can see published announcements
create policy "Anyone can view published announcements"
  on public.announcements for select
  using (status = 'published');

-- Officers/staff can see their own drafts and all pending/approved/published
create policy "Officers see own drafts + published queue"
  on public.announcements for select
  using (
    publisher_user_id = auth.uid()
    or status in ('approved', 'published')
    or public.current_user_role() in ('moderator', 'admin')
  );

-- Officers can create announcements
create policy "Officers and staff can create announcements"
  on public.announcements for insert
  with check (
    public.current_user_role() in ('officer', 'office_staff', 'admin')
    and publisher_user_id = auth.uid()
  );

-- Officers can edit their own draft/pending announcements
create policy "Officers can update own announcements"
  on public.announcements for update
  using (
    publisher_user_id = auth.uid()
    and status in ('draft', 'pending')
  );

-- Moderators and admins can update any announcement (approval workflow)
create policy "Moderators can update announcement status"
  on public.announcements for update
  using (public.current_user_role() in ('moderator', 'admin'));

-- QR LINKS — public read for published
create policy "Anyone can read active QR links"
  on public.qr_links for select using (is_active = true);
create policy "System can manage QR links"
  on public.qr_links for all
  using (public.current_user_role() in ('officer', 'office_staff', 'moderator', 'admin'));

-- RSVP RECORDS
create policy "Students can see own RSVPs"
  on public.rsvp_records for select using (user_id = auth.uid());
create policy "Officers see RSVPs for their announcements"
  on public.rsvp_records for select
  using (
    exists (
      select 1 from public.announcements a
      where a.id = announcement_id and a.publisher_user_id = auth.uid()
    )
    or public.current_user_role() in ('moderator', 'admin')
  );
create policy "Authenticated users can RSVP"
  on public.rsvp_records for insert
  with check (user_id = auth.uid() and public.current_user_role() = 'student');
create policy "Users can update own RSVP"
  on public.rsvp_records for update using (user_id = auth.uid());

-- AUDIT LOGS — admin only
create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (public.current_user_role() = 'admin');
create policy "System can insert audit logs"
  on public.audit_logs for insert with check (true);

-- CHANNEL FOLLOWS
create policy "Users manage own follows"
  on public.channel_follows for all using (user_id = auth.uid());
create policy "Anyone can view follows"
  on public.channel_follows for select using (true);