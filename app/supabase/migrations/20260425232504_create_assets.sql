-- assets: Vercel Blob uploads owned by a user
create table public.assets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  category    text,
  mime_type   text,
  url         text not null,
  size        bigint,
  tags        text[],
  uploaded_at timestamptz default now() not null
);

create index assets_user_id_idx on public.assets (user_id);

-- asset_runs: junction between assets and runs
create table public.asset_runs (
  asset_id uuid references public.assets(id) on delete cascade,
  run_id   uuid references public.runs(id) on delete cascade,
  primary key (asset_id, run_id)
);

create index asset_runs_run_id_idx on public.asset_runs (run_id);

-- RLS on assets
alter table public.assets enable row level security;

create policy "assets: select own"
  on public.assets for select
  using (auth.uid() = user_id);

create policy "assets: insert own"
  on public.assets for insert
  with check (auth.uid() = user_id);

create policy "assets: update own"
  on public.assets for update
  using (auth.uid() = user_id);

create policy "assets: delete own"
  on public.assets for delete
  using (auth.uid() = user_id);

-- RLS on asset_runs (both asset and run must belong to the caller)
alter table public.asset_runs enable row level security;

create policy "asset_runs: select own"
  on public.asset_runs for select
  using (
    exists (select 1 from public.assets where assets.id = asset_runs.asset_id and assets.user_id = auth.uid())
    and
    exists (select 1 from public.runs where runs.id = asset_runs.run_id and runs.user_id = auth.uid())
  );

create policy "asset_runs: insert own"
  on public.asset_runs for insert
  with check (
    exists (select 1 from public.assets where assets.id = asset_runs.asset_id and assets.user_id = auth.uid())
    and
    exists (select 1 from public.runs where runs.id = asset_runs.run_id and runs.user_id = auth.uid())
  );

create policy "asset_runs: delete own"
  on public.asset_runs for delete
  using (
    exists (select 1 from public.assets where assets.id = asset_runs.asset_id and assets.user_id = auth.uid())
    and
    exists (select 1 from public.runs where runs.id = asset_runs.run_id and runs.user_id = auth.uid())
  );
