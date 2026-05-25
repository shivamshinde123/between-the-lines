create extension if not exists citext;
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username citext not null unique,
  auth_email text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_username_format check (
    username::text ~ '^[a-z0-9](?:[a-z0-9._-]{1,28}[a-z0-9])?$'
  )
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  author_name text not null,
  cover_bucket text not null default 'book-covers',
  cover_path text,
  title_sort_key text generated always as (lower(trim(title))) stored,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint books_title_nonempty check (char_length(trim(title)) > 0),
  constraint books_author_nonempty check (char_length(trim(author_name)) > 0),
  constraint books_id_user_id_unique unique (id, user_id)
);

create table public.thought_entries (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint thought_entries_content_nonempty check (char_length(trim(content)) > 0),
  constraint thought_entries_book_owner_fk
    foreign key (book_id, user_id)
    references public.books (id, user_id)
    on delete cascade
);

create table public.generated_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid,
  scope text not null,
  insight_type text not null,
  content text not null default '',
  last_generated_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint generated_insights_scope_check check (scope in ('book', 'library')),
  constraint generated_insights_type_check check (
    insight_type in ('book_shift', 'reading_voice', 'recurring_thought')
  ),
  constraint generated_insights_scope_target_check check (
    (scope = 'book' and book_id is not null and insight_type = 'book_shift')
    or
    (scope = 'library' and book_id is null and insight_type in ('reading_voice', 'recurring_thought'))
  ),
  constraint generated_insights_book_owner_fk
    foreign key (book_id, user_id)
    references public.books (id, user_id)
    on delete cascade
);

create index books_user_id_title_sort_key_idx
  on public.books (user_id, title_sort_key, title, id);

create index thought_entries_book_id_created_at_idx
  on public.thought_entries (book_id, created_at, id);

create index thought_entries_user_id_created_at_idx
  on public.thought_entries (user_id, created_at, id);

create unique index generated_insights_book_unique_idx
  on public.generated_insights (user_id, book_id, insight_type)
  where book_id is not null;

create unique index generated_insights_library_unique_idx
  on public.generated_insights (user_id, insight_type)
  where book_id is null;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger books_set_updated_at
before update on public.books
for each row
execute function public.set_updated_at();

create trigger thought_entries_set_updated_at
before update on public.thought_entries
for each row
execute function public.set_updated_at();

create trigger generated_insights_set_updated_at
before update on public.generated_insights
for each row
execute function public.set_updated_at();

grant usage on schema public to authenticated;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.books to authenticated;
grant select, insert, update, delete on public.thought_entries to authenticated;
grant select, insert, update, delete on public.generated_insights to authenticated;

revoke all on public.profiles from anon;
revoke all on public.books from anon;
revoke all on public.thought_entries from anon;
revoke all on public.generated_insights from anon;

alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.thought_entries enable row level security;
alter table public.generated_insights enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using (id = auth.uid());

create policy "books_select_own"
on public.books
for select
to authenticated
using (user_id = auth.uid());

create policy "books_insert_own"
on public.books
for insert
to authenticated
with check (user_id = auth.uid());

create policy "books_update_own"
on public.books
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "books_delete_own"
on public.books
for delete
to authenticated
using (user_id = auth.uid());

create policy "thought_entries_select_own"
on public.thought_entries
for select
to authenticated
using (user_id = auth.uid());

create policy "thought_entries_insert_own"
on public.thought_entries
for insert
to authenticated
with check (user_id = auth.uid());

create policy "thought_entries_update_own"
on public.thought_entries
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "thought_entries_delete_own"
on public.thought_entries
for delete
to authenticated
using (user_id = auth.uid());

create policy "generated_insights_select_own"
on public.generated_insights
for select
to authenticated
using (user_id = auth.uid());

create policy "generated_insights_insert_own"
on public.generated_insights
for insert
to authenticated
with check (user_id = auth.uid());

create policy "generated_insights_update_own"
on public.generated_insights
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "generated_insights_delete_own"
on public.generated_insights
for delete
to authenticated
using (user_id = auth.uid());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'book-covers',
  'book-covers',
  false,
  5242880,
  array['image/avif', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "book_covers_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'book-covers'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "book_covers_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'book-covers'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "book_covers_update_own"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'book-covers'
  and owner_id = (select auth.uid())
)
with check (
  bucket_id = 'book-covers'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "book_covers_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'book-covers'
  and owner_id = (select auth.uid())
);
