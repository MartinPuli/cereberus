-- custom_agents: user-registered agents (supplement fixtures)
create table public.custom_agents (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid references auth.users(id) on delete cascade not null,
  name         text not null,
  handle       text,
  description  text,
  github_url   text,
  skills       text[],
  default_tier text,
  metrics      jsonb,
  quality      numeric,
  created_at   timestamptz default now() not null
);

create index custom_agents_owner_id_idx on public.custom_agents (owner_id);

-- custom_teams: user-assembled teams (supplement fixtures)
create table public.custom_teams (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references auth.users(id) on delete cascade not null,
  slug          text not null,
  name          text not null,
  tagline       text,
  description   text,
  vertical      text,
  member_ids    text[],
  lead_agent_id text,
  created_at    timestamptz default now() not null,
  unique (owner_id, slug)
);

create index custom_teams_owner_id_idx on public.custom_teams (owner_id);

-- RLS on custom_agents: public read, owner write
alter table public.custom_agents enable row level security;

create policy "custom_agents: select public"
  on public.custom_agents for select
  using (true);

create policy "custom_agents: insert own"
  on public.custom_agents for insert
  with check (auth.uid() = owner_id);

create policy "custom_agents: update own"
  on public.custom_agents for update
  using (auth.uid() = owner_id);

create policy "custom_agents: delete own"
  on public.custom_agents for delete
  using (auth.uid() = owner_id);

-- RLS on custom_teams: public read, owner write
alter table public.custom_teams enable row level security;

create policy "custom_teams: select public"
  on public.custom_teams for select
  using (true);

create policy "custom_teams: insert own"
  on public.custom_teams for insert
  with check (auth.uid() = owner_id);

create policy "custom_teams: update own"
  on public.custom_teams for update
  using (auth.uid() = owner_id);

create policy "custom_teams: delete own"
  on public.custom_teams for delete
  using (auth.uid() = owner_id);
