-- Green Ads Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (extends Supabase auth.users)
create type user_role as enum ('visitor', 'gratuit', 'premium', 'featured', 'admin');

create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  role user_role default 'gratuit',
  full_name text,
  phone text,
  avatar_url text,
  subscription_expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for users
create policy "Public profiles are viewable by everyone." on public.users
  for select using (true);

create policy "Users can insert their own profile." on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.users
  for update using (auth.uid() = id);

-- CATEGORIES TABLE
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  icon text, -- Lucide icon name or URL
  description text,
  custom_fields jsonb, -- JSON definition of specific fields
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;
create policy "Categories are viewable by everyone." on public.categories for select using (true);
create policy "Only admin can insert/update categories." on public.categories for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- ADS TABLE
create type ad_status as enum ('draft', 'pending', 'approved', 'rejected', 'expired', 'sold');
create type ad_plan as enum ('gratuit', 'premium', 'featured');

create table public.ads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  category_id uuid references public.categories(id) not null,
  title text not null,
  description text not null,
  price numeric not null,
  currency text default 'F CFA',
  location text not null,
  custom_data jsonb,
  status ad_status default 'pending',
  plan ad_plan default 'gratuit',
  images text[],
  views_count integer default 0,
  approved_at timestamp with time zone,
  approved_by uuid references public.users(id),
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ads enable row level security;

-- Policies for ads
create policy "Approved ads are viewable by everyone." on public.ads
  for select using (status = 'approved');

create policy "Users can see their own ads regardless of status." on public.ads
  for select using (auth.uid() = user_id);

create policy "Users can insert their own ads." on public.ads
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own ads." on public.ads
  for update using (auth.uid() = user_id);

create policy "Users can delete their own ads." on public.ads
  for delete using (auth.uid() = user_id);

create policy "Admins can view all ads." on public.ads
  for select using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update all ads." on public.ads
  for update using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- SUBSCRIPTIONS TABLE
create type subscription_status as enum ('pending', 'active', 'expired', 'cancelled');

create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  plan ad_plan not null,
  amount numeric not null,
  currency text default 'F CFA',
  status subscription_status default 'pending',
  payment_method text,
  payment_reference text,
  starts_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;
create policy "Users can view own subscriptions." on public.subscriptions for select using (auth.uid() = user_id);
create policy "Admins can view and update subscriptions." on public.subscriptions for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- MESSAGES TABLE
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid not null, -- Grouping ID
  sender_id uuid references public.users(id) not null,
  receiver_id uuid references public.users(id) not null,
  ad_id uuid references public.ads(id),
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;
create policy "Users can view messages sent to or by them." on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can insert messages." on public.messages for insert with check (auth.uid() = sender_id);

-- ADVERTISING BANNERS TABLE
create type banner_placement as enum ('homepage_top', 'homepage_sidebar', 'detail_middle');

create table public.advertising_banners (
  id uuid default uuid_generate_v4() primary key,
  title text,
  description text,
  image_url text not null,
  link_url text,
  placement banner_placement not null,
  is_active boolean default true,
  impressions_count integer default 0,
  clicks_count integer default 0,
  starts_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.advertising_banners enable row level security;
create policy "Active banners are viewable by everyone." on public.advertising_banners for select using (is_active = true);
create policy "Admins can manage banners." on public.advertising_banners for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- FUNCTIONS & TRIGGERS

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'gratuit');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA (Categories)
insert into public.categories (name, slug, icon, description) values
('Véhicules', 'vehicules', 'Car', 'Voitures, motos, camions...'),
('Immobilier', 'immobilier', 'Home', 'Appartements, maisons, terrains...'),
('Emploi', 'emploi', 'Briefcase', 'Offres d''emploi, stages...'),
('Maison & Jardin', 'maison-jardin', 'Sofa', 'Meubles, électroménager, décoration...'),
('Mode & Beauté', 'mode-beaute', 'Shirt', 'Vêtements, chaussures, accessoires...'),
('Multimédia', 'multimedia', 'Smartphone', 'Téléphones, ordinateurs, consoles...'),
('Services', 'services', 'Wrench', 'Plomberie, électricité, cours...');

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('ads', 'ads', true);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('banners', 'banners', true);

-- Storage policies
create policy "Ads images are publicly accessible." on storage.objects for select using (bucket_id = 'ads');
create policy "Authenticated users can upload ad images." on storage.objects for insert with check (bucket_id = 'ads' and auth.role() = 'authenticated');

create policy "Avatars are publicly accessible." on storage.objects for select using (bucket_id = 'avatars');
create policy "Users can update own avatar." on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Banners are publicly accessible." on storage.objects for select using (bucket_id = 'banners');
create policy "Only admin can upload banners." on storage.objects for insert with check (
  bucket_id = 'banners' and exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);
