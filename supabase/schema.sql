-- ============================================================
-- RENOMAG — Supabase Schema Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'USER' check (role in ('USER', 'ARTISAN', 'ADMIN')),
  first_name text,
  last_name text,
  phone text,
  address text,
  city text,
  zip_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'USER');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- CERTIFICATIONS
-- ============================================================
create table if not exists public.certifications (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  code text not null unique
);

insert into public.certifications (name, code) values
  ('RGE Qualibat', 'QUALIBAT'),
  ('RGE QualiPAC', 'QUALIPAC'),
  ('RGE QualiSol', 'QUALISOL'),
  ('RGE Qualibois', 'QUALIBOIS'),
  ('RGE Qualifelec', 'QUALIFELEC'),
  ('RGE QualiPV', 'QUALIPV'),
  ('Eco Artisan', 'ECO_ARTISAN')
on conflict (code) do nothing;

-- ============================================================
-- SPECIALTIES
-- ============================================================
create table if not exists public.specialties (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique
);

insert into public.specialties (name, slug) values
  ('Isolation thermique', 'isolation'),
  ('Pompe à chaleur', 'pompe-a-chaleur'),
  ('Panneaux solaires', 'solaire'),
  ('Chaudière à granulés', 'chaudiere-granules'),
  ('Ventilation VMC', 'vmc'),
  ('Fenêtres et menuiseries', 'menuiseries'),
  ('Rénovation globale', 'renovation-globale'),
  ('Audit énergétique', 'audit-energetique')
on conflict (slug) do nothing;

-- ============================================================
-- ARTISAN COMPANIES
-- ============================================================
create table if not exists public.artisan_companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  name text not null,
  siret text not null unique,
  description text,
  address text not null,
  city text not null,
  zip_code text not null,
  department text not null,
  latitude float,
  longitude float,
  phone text,
  website text,
  logo_url text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.artisan_companies enable row level security;

create policy "Anyone can view artisan companies"
  on public.artisan_companies for select
  using (true);

create policy "Artisans can update own company"
  on public.artisan_companies for update
  using (auth.uid() = user_id);

create policy "Artisans can insert own company"
  on public.artisan_companies for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- ARTISAN <-> CERTIFICATIONS (many-to-many)
-- ============================================================
create table if not exists public.artisan_certifications (
  artisan_id uuid not null references public.artisan_companies(id) on delete cascade,
  certification_id uuid not null references public.certifications(id) on delete cascade,
  primary key (artisan_id, certification_id)
);

alter table public.artisan_certifications enable row level security;

create policy "Anyone can view artisan certifications"
  on public.artisan_certifications for select
  using (true);

-- ============================================================
-- ARTISAN <-> SPECIALTIES (many-to-many)
-- ============================================================
create table if not exists public.artisan_specialties (
  artisan_id uuid not null references public.artisan_companies(id) on delete cascade,
  specialty_id uuid not null references public.specialties(id) on delete cascade,
  primary key (artisan_id, specialty_id)
);

alter table public.artisan_specialties enable row level security;

create policy "Anyone can view artisan specialties"
  on public.artisan_specialties for select
  using (true);

-- ============================================================
-- LEADS
-- ============================================================
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  zip_code text not null,
  department text not null,
  project_type text not null,
  description text,
  budget text,
  status text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'REJECTED')),
  score float,
  artisan_id uuid references public.artisan_companies(id) on delete set null,
  specialty_id uuid references public.specialties(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);

create policy "Artisans can view assigned leads"
  on public.leads for select
  using (
    artisan_id in (
      select id from public.artisan_companies where user_id = auth.uid()
    )
  );

create policy "Admins can view all leads"
  on public.leads for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

create policy "Artisans can update assigned leads"
  on public.leads for update
  using (
    artisan_id in (
      select id from public.artisan_companies where user_id = auth.uid()
    )
  );

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  rating int not null check (rating between 1 and 5),
  comment text,
  artisan_id uuid not null references public.artisan_companies(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews for insert
  with check (auth.uid() is not null);

-- ============================================================
-- MESSAGES
-- ============================================================
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Users can view own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can mark messages as read"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can mark notifications as read"
  on public.notifications for update
  using (auth.uid() = user_id);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  artisan_id uuid not null unique references public.artisan_companies(id) on delete cascade,
  plan text not null default 'FREE' check (plan in ('FREE', 'STARTER', 'PREMIUM', 'ENTERPRISE')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'PAST_DUE', 'CANCELLED', 'TRIALING')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Artisans can view own subscription"
  on public.subscriptions for select
  using (
    artisan_id in (
      select id from public.artisan_companies where user_id = auth.uid()
    )
  );

-- ============================================================
-- ARTICLES & CATEGORIES (Blog)
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique
);

create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  image text,
  published boolean not null default false,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.articles enable row level security;

create policy "Anyone can view published articles"
  on public.articles for select
  using (published = true);

create policy "Admins can manage articles"
  on public.articles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'ADMIN'
    )
  );

-- ============================================================
-- DEPARTMENTS
-- ============================================================
create table if not exists public.departments (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  name text not null,
  region text not null,
  density float
);

-- ============================================================
-- UPDATED_AT triggers
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger artisan_companies_updated_at before update on public.artisan_companies
  for each row execute procedure public.set_updated_at();

create trigger leads_updated_at before update on public.leads
  for each row execute procedure public.set_updated_at();

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

create trigger articles_updated_at before update on public.articles
  for each row execute procedure public.set_updated_at();
