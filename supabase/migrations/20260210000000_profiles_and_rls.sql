-- رِواق: ملفات تعريف المستخدمين + RLS
-- نفّذ هذا الملف في SQL Editor في Supabase أو عبر CLI بعد ربط المشروع.

-- الجدول
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'customer'
    check (
      role in (
        'platform_admin',
        'cafe_owner',
        'branch_manager',
        'cashier',
        'barista',
        'customer'
      )
    ),
  loyalty_points integer not null default 0,
  welcome_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

-- تحديث updated_at
create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tr_profiles_updated_at on public.profiles;
create trigger tr_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_profiles_updated_at();

-- ملاحظة: لا نضع trigger يمنع تغيير role لأنه يعيق الترقية عبر service_role.
-- الحماية: لا توجد سياسة UPDATE لـ authenticated على الجدول؛ التعديل الذاتي للاسم/الجوال عبر update_my_profile فقط.

-- إنشاء ملف عند تسجيل مستخدم جديد — الدور دائمًا customer (لا تثق بـ raw_user_meta_data للدور)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    'customer'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- لا نسمح بتحديث مباشر من العميل على الأعمدة الحساسة؛ استخدم الدالة أدناه
drop policy if exists "profiles_no_direct_update" on public.profiles;
-- عمدًا بدون سياسة update للجدول للمستخدمين المعرّفين (authenticated)

-- تحديث آمن للاسم والجوال فقط
create or replace function public.update_my_profile(p_full_name text, p_phone text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    full_name = nullif(trim(p_full_name), ''),
    phone = nullif(trim(p_phone), '')
  where id = auth.uid();
end;
$$;

grant execute on function public.update_my_profile(text, text) to authenticated;

-- ملاحظة: لترقية موظف إلى دور staff، نفّذ في SQL (بصلاحيات service role أو لوحة):
-- update public.profiles set role = 'branch_manager' where email = '...';
