-- Paste into Supabase SQL Editor and RUN once.
-- Public read + constrained public write for a casual, unverified booth leaderboard.
create table if not exists public.detective_scores (
  id bigint generated always as identity primary key,
  event_id text not null default 'bts-2026' check (length(event_id) between 1 and 48),
  nickname text not null check (length(trim(nickname)) between 2 and 24),
  score integer not null check (score between 0 and 20000),
  completed integer not null check (completed between 0 and 5),
  total integer not null default 5 check (total = 5),
  created_at timestamptz not null default now()
);
create index if not exists detective_scores_rank on public.detective_scores(event_id,score desc,completed desc,created_at asc);
alter table public.detective_scores enable row level security;
revoke all on public.detective_scores from anon, authenticated;
grant select (nickname,score,completed,total,created_at,event_id) on public.detective_scores to anon,authenticated;
grant insert (event_id,nickname,score,completed,total) on public.detective_scores to anon,authenticated;
create policy "Public can view event scores" on public.detective_scores for select to anon,authenticated using (true);
create policy "Public can submit constrained scores" on public.detective_scores for insert to anon,authenticated with check (event_id = 'bts-2026' and total=5 and completed between 0 and 5 and score between 0 and 20000);
