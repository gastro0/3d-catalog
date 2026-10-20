begin;

create table if not exists public.models (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  description text not null default '',
  category text not null,
  format text not null,
  polygons bigint not null default 0 check (polygons >= 0),
  "imageUrl" text,
  file_size bigint not null default 0 check (file_size >= 0),
  created_at timestamptz not null default now(),
  owner_id uuid references auth.users(id),
  storage_path text unique
);

do $migration$
declare
  field_mapping record;
begin
  for field_mapping in
    select * from (values
      ('model_name', 'name'),
      ('user_id', 'owner_id'),
      ('filename', 'storage_path'),
      ('size', 'file_size'),
      ('preview_url', 'imageUrl')
    ) as field_names(legacy_name, canonical_name)
  loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'models'
        and column_name = field_mapping.legacy_name
    ) then
      if exists (
        select 1 from information_schema.columns
        where table_schema = 'public' and table_name = 'models'
          and column_name = field_mapping.canonical_name
      ) then
        raise exception 'models contains both % and %. Review the mapping before migrating.',
          field_mapping.legacy_name, field_mapping.canonical_name;
      end if;
      execute format('alter table public.models rename column %I to %I',
        field_mapping.legacy_name, field_mapping.canonical_name);
    end if;
  end loop;
end
$migration$;

alter table public.models
  add column if not exists name text,
  add column if not exists description text default '',
  add column if not exists category text,
  add column if not exists format text,
  add column if not exists polygons bigint default 0,
  add column if not exists "imageUrl" text,
  add column if not exists file_size bigint default 0,
  add column if not exists created_at timestamptz default now(),
  add column if not exists owner_id uuid references auth.users(id),
  add column if not exists storage_path text;

do $migration$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'models'
      and column_name = 'original_name'
  ) then
    execute $backfill$
      update public.models
      set name = coalesce(nullif(btrim(name), ''), nullif(btrim(original_name), ''))
    $backfill$;
  end if;
end
$migration$;

update public.models
set
  name = coalesce(nullif(btrim(name), ''), nullif(regexp_replace(storage_path, '^.*/', ''), ''), 'Без названия'),
  description = coalesce(description, ''),
  category = coalesce(nullif(btrim(category), ''), 'Без категории'),
  format = coalesce(nullif(upper(btrim(format)), ''), nullif(upper(substring(storage_path from '\.([^.\/]+)$')), ''), '3D'),
  polygons = coalesce(polygons, 0),
  file_size = coalesce(file_size, 0),
  created_at = coalesce(created_at, now());

alter table public.models
  alter column name set not null,
  alter column description set default '',
  alter column description set not null,
  alter column category set default 'Без категории',
  alter column category set not null,
  alter column format set not null,
  alter column polygons set default 0,
  alter column polygons set not null,
  alter column file_size set default 0,
  alter column file_size set not null,
  alter column created_at set default now(),
  alter column created_at set not null;

create index if not exists models_created_at_idx on public.models (created_at desc);
create index if not exists models_category_idx on public.models (category);
create index if not exists models_owner_id_idx on public.models (owner_id);

alter table public.models enable row level security;
revoke all on public.models from anon, authenticated;
grant select on public.models to anon, authenticated;
grant all on public.models to service_role;

drop policy if exists "Public catalog read" on public.models;
create policy "Public catalog read" on public.models
  for select to anon, authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit)
values ('models', 'models', false, 26214400)
on conflict (id) do nothing;

commit;
