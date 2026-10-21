begin;

alter table public.models
  add column if not exists purposes text[] not null default '{}',
  add column if not exists tags text[] not null default '{}',
  add column if not exists features text[] not null default '{}',
  add column if not exists software text[] not null default '{}',
  add column if not exists license text not null default '',
  add column if not exists dimensions text not null default '',
  add column if not exists print_notes text not null default '',
  add column if not exists file_contents text not null default '';

-- Existing models keep unknown purposes and licenses. File extensions do not
-- establish printability, software compatibility or permission to reuse.
create index if not exists models_purposes_idx on public.models using gin (purposes);
create index if not exists models_tags_idx on public.models using gin (tags);

notify pgrst, 'reload schema';
commit;
