create extension if not exists "pgcrypto";

create type quiz_status as enum ('draft', 'active', 'closed');
create type question_type as enum ('single_choice', 'multiple_choice', 'true_false', 'short_text', 'long_text', 'scale');

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  slug text not null unique,
  status quiz_status not null default 'draft',
  cover_image_url text,
  require_identification boolean not null default true,
  show_score boolean not null default true,
  show_ranking boolean not null default false,
  final_message text,
  final_verse text,
  created_by uuid references public.admin_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quiz_settings (
  quiz_id uuid primary key references public.quizzes(id) on delete cascade,
  require_full_name boolean not null default true,
  require_age boolean not null default false,
  require_phone boolean not null default false,
  require_cell_group boolean not null default false,
  require_leader_name boolean not null default false,
  collect_prayer_request boolean not null default true,
  collect_follow_up boolean not null default true,
  whatsapp_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt text not null,
  question_type question_type not null,
  position integer not null default 0,
  points integer not null default 0,
  required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  label text not null,
  is_correct boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  participant_name text not null,
  age integer,
  phone text,
  cell_group text,
  leader_name text,
  is_visitor boolean not null default false,
  wants_follow_up boolean not null default false,
  prayer_request text,
  score integer not null default 0,
  max_score integer not null default 0,
  idempotency_key text not null unique,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_ids uuid[] not null default '{}',
  answer_text text,
  points_awarded integer not null default 0,
  created_at timestamptz not null default now()
);

create index quizzes_status_idx on public.quizzes(status);
create index quizzes_slug_idx on public.quizzes(slug);
create index questions_quiz_position_idx on public.questions(quiz_id, position);
create index options_question_position_idx on public.question_options(question_id, position);
create index submissions_quiz_created_idx on public.submissions(quiz_id, created_at desc);
create index submissions_cell_group_idx on public.submissions(cell_group);
create index submissions_phone_idx on public.submissions(phone);
create index answers_submission_idx on public.answers(submission_id);

alter table public.admin_profiles enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_settings enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.submissions enable row level security;
alter table public.answers enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and role in ('admin', 'owner')
  );
$$;

create policy "Admins manage profiles" on public.admin_profiles
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads active quizzes" on public.quizzes
  for select using (status = 'active');
create policy "Admins manage quizzes" on public.quizzes
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads active quiz settings" on public.quiz_settings
  for select using (exists (select 1 from public.quizzes q where q.id = quiz_id and q.status = 'active'));
create policy "Admins manage settings" on public.quiz_settings
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads active questions" on public.questions
  for select using (exists (select 1 from public.quizzes q where q.id = quiz_id and q.status = 'active'));
create policy "Admins manage questions" on public.questions
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Public reads active options" on public.question_options
  for select using (
    exists (
      select 1 from public.questions qu
      join public.quizzes q on q.id = qu.quiz_id
      where qu.id = question_id and q.status = 'active'
    )
  );
create policy "Admins manage options" on public.question_options
  for all using (public.is_admin()) with check (public.is_admin());

create policy "Participants insert submissions" on public.submissions
  for insert with check (exists (select 1 from public.quizzes q where q.id = quiz_id and q.status = 'active'));
create policy "Admins read submissions" on public.submissions
  for select using (public.is_admin());
create policy "Admins manage submissions" on public.submissions
  for delete using (public.is_admin());

create policy "Participants insert answers" on public.answers
  for insert with check (exists (select 1 from public.submissions s where s.id = submission_id));
create policy "Admins read answers" on public.answers
  for select using (public.is_admin());

insert into public.quizzes (title, description, slug, status, show_score, final_message, final_verse)
values (
  'Quiz Conectados no Altar',
  'Um quiz biblico rapido para jovens, visitantes e celulas da MIRJE.',
  'conectados-no-altar',
  'active',
  true,
  'Obrigado por participar. A lideranca podera acompanhar suas respostas no painel.',
  'Reconstruirei o tabernaculo caido de Davi. Atos 15:16'
)
on conflict (slug) do nothing;
