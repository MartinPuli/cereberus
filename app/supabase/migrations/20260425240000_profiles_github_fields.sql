-- Add GitHub OAuth metadata columns to profiles
alter table public.profiles
  add column if not exists github_username text null,
  add column if not exists avatar_url      text null,
  add column if not exists updated_at      timestamptz default now() not null;

-- Replace trigger function to populate GitHub OAuth metadata on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, github_username, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    github_username = excluded.github_username,
    display_name    = excluded.display_name,
    avatar_url      = excluded.avatar_url,
    updated_at      = now();
  return new;
end;
$$;
