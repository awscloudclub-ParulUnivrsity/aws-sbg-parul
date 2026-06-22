-- ============================================================
-- AWS SBG Parul University — Supabase Schema
-- Run this ONCE in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. PROFILES (extends Supabase auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  email       text not null unique,
  role        text not null default 'member'
                check (role in ('leader','social_media','technical','operations','promotions','member')),
  department  text,
  enrolment   text,
  institute   text,
  mobile      text,
  avatar_url  text,
  approved    boolean default false,
  badge_url   text,
  created_at  timestamptz default now()
);

-- 2. EVENTS
create table if not exists public.events (
  id          uuid default gen_random_uuid() primary key,
  title       text not null,
  type        text not null,
  date        text not null,
  time        text,
  location    text,
  description text,
  status      text default 'upcoming' check (status in ('upcoming','past')),
  created_by  uuid references public.profiles(id),
  created_at  timestamptz default now()
);

-- 3. TEAM MEMBERS (core team)
create table if not exists public.team_members (
  id          uuid default gen_random_uuid() primary key,
  profile_id  uuid references public.profiles(id) on delete cascade unique,
  role_title  text,
  department  text,
  linkedin    text,
  github      text,
  approved_by uuid references public.profiles(id),
  approved_at timestamptz,
  created_at  timestamptz default now()
);

-- 4. CERTIFICATIONS
create table if not exists public.certifications (
  id           uuid default gen_random_uuid() primary key,
  profile_id   uuid references public.profiles(id),
  name         text not null,
  email        text not null,
  parul_email  text,
  mobile       text,
  enrolment    text,
  department   text,
  semester     text,
  institute    text,
  exam_date    text,
  cert_title   text not null,
  credly_link  text,
  result_url   text,
  photo_url    text,
  post_draft   text,
  status       text default 'pending' check (status in ('pending','approved','posted','rejected')),
  created_at   timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles       enable row level security;
alter table public.events         enable row level security;
alter table public.team_members   enable row level security;
alter table public.certifications enable row level security;

-- PROFILES policies
create policy "Public profiles readable by all"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Leader can update any profile"
  on public.profiles for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'leader')
  );

-- EVENTS policies
create policy "Events readable by all"
  on public.events for select using (true);

create policy "Leader or technical can insert events"
  on public.events for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('leader','technical'))
  );

create policy "Leader or technical can update events"
  on public.events for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('leader','technical'))
  );

create policy "Leader or technical can delete events"
  on public.events for delete using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('leader','technical'))
  );

-- TEAM MEMBERS policies
create policy "Team members readable by all"
  on public.team_members for select using (true);

create policy "Leader can insert team members"
  on public.team_members for insert with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'leader')
  );

create policy "Leader can update team members"
  on public.team_members for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'leader')
  );

create policy "Leader can delete team members"
  on public.team_members for delete using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'leader')
  );

-- CERTIFICATIONS policies
create policy "Leader and social media can read certs"
  on public.certifications for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid()
      and p.role in ('leader','social_media'))
  );

create policy "Anyone can submit certification"
  on public.certifications for insert with check (true);

create policy "Leader can update cert status"
  on public.certifications for update using (
    exists (select 1 from public.profiles p where p.id = auth.uid()
      and p.role in ('leader','social_media'))
  );

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- INSERT LEADER ACCOUNT (run after creating your auth user)
-- Replace 'YOUR-AUTH-USER-UUID' with actual UUID from auth.users
-- ============================================================
-- update public.profiles set role = 'leader', approved = true
-- where email = 'awssbgpu@gmail.com';

-- ============================================================
-- STORAGE BUCKETS FOR FILE UPLOADS
-- ============================================================

-- Create storage bucket for certifications
insert into storage.buckets (id, name, public)
values ('certifications', 'certifications', true)
on conflict (id) do nothing;

-- Storage policies for certifications bucket
create policy "Anyone can upload certification files"
  on storage.objects for insert
  with check (bucket_id = 'certifications');

create policy "Public certification files are readable"
  on storage.objects for select
  using (bucket_id = 'certifications');
