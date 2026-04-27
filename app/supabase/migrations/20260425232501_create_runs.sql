-- runs: persisted orchestration runs (logged-in users only)
create table public.runs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  goal             text not null,
  team_id          text,
  status           text not null,
  total_actual_eth numeric,
  total_naive_eth  numeric,
  saved_pct        numeric,
  created_at       timestamptz default now() not null
);

create index runs_user_id_idx on public.runs (user_id);

-- subtasks: child rows of a run
create table public.subtasks (
  id             uuid primary key default gen_random_uuid(),
  run_id         uuid references public.runs(id) on delete cascade not null,
  description    text not null,
  tier           text not null,
  model          text not null,
  agent_id       text,
  status         text not null,
  actual_tokens  int,
  cost_eth       numeric,
  output         jsonb,
  classification jsonb,
  created_at     timestamptz default now() not null
);

create index subtasks_run_id_idx on public.subtasks (run_id);

-- RLS on runs
alter table public.runs enable row level security;

create policy "runs: select own"
  on public.runs for select
  using (auth.uid() = user_id);

create policy "runs: insert own"
  on public.runs for insert
  with check (auth.uid() = user_id);

create policy "runs: update own"
  on public.runs for update
  using (auth.uid() = user_id);

create policy "runs: delete own"
  on public.runs for delete
  using (auth.uid() = user_id);

-- RLS on subtasks (access via parent run ownership)
alter table public.subtasks enable row level security;

create policy "subtasks: select via run"
  on public.subtasks for select
  using (
    exists (
      select 1 from public.runs
      where runs.id = subtasks.run_id
        and runs.user_id = auth.uid()
    )
  );

create policy "subtasks: insert via run"
  on public.subtasks for insert
  with check (
    exists (
      select 1 from public.runs
      where runs.id = subtasks.run_id
        and runs.user_id = auth.uid()
    )
  );

create policy "subtasks: update via run"
  on public.subtasks for update
  using (
    exists (
      select 1 from public.runs
      where runs.id = subtasks.run_id
        and runs.user_id = auth.uid()
    )
  );

create policy "subtasks: delete via run"
  on public.subtasks for delete
  using (
    exists (
      select 1 from public.runs
      where runs.id = subtasks.run_id
        and runs.user_id = auth.uid()
    )
  );
