-- رِواق: جداول النطاق التشغيلي (قائمة، طلبات، مجتمع، …)
-- نفّذ في Supabase SQL Editor أو عبر supabase db push.
-- يفترض وجود public.profiles و public.cafes و public.branches (كما في التسجيل)؛ يضيف أعمدة ناقصة وجداول جديدة.

-- ——— توسيع cafés / الفروع ———
DO $$
BEGIN
  IF to_regclass('public.cafes') IS NOT NULL THEN
    ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS slug text;
    ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS region text;
    ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS city text;
    ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS lat double precision;
    ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS lng double precision;
    ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 4.5;
    ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;
    ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS map_extras jsonb DEFAULT '{}'::jsonb;
    ALTER TABLE public.cafes ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
  END IF;

  IF to_regclass('public.branches') IS NOT NULL THEN
    ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS city text;
    ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS lat double precision;
    ALTER TABLE public.branches ADD COLUMN IF NOT EXISTS lng double precision;
  END IF;
END $$;

-- ——— اشتراكات الكافيهات ———
CREATE TABLE IF NOT EXISTS public.cafe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid REFERENCES public.cafes (id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'starter',
  monthly_price numeric NOT NULL DEFAULT 0,
  starts_at date,
  ends_at date,
  lifecycle text NOT NULL DEFAULT 'active',
  payment_status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cafe_subscriptions_cafe_id_idx ON public.cafe_subscriptions (cafe_id);

-- ——— المنيو ———
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid REFERENCES public.cafes (id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches (id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  calories integer,
  ingredients text,
  promo_label text,
  loyalty_points integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS menu_items_cafe_id_idx ON public.menu_items (cafe_id);

-- ——— الطاولات ———
CREATE TABLE IF NOT EXISTS public.cafe_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid NOT NULL REFERENCES public.branches (id) ON DELETE CASCADE,
  label text NOT NULL,
  capacity integer DEFAULT 4,
  floor_label text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cafe_tables_branch_id_idx ON public.cafe_tables (branch_id);

-- ——— الطلبات ———
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES public.branches (id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  total numeric NOT NULL DEFAULT 0,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_branch_id_idx ON public.orders (branch_id);
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON public.orders (customer_id);

-- ——— الحجوزات ———
CREATE TABLE IF NOT EXISTS public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id uuid REFERENCES public.branches (id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  party_size integer NOT NULL DEFAULT 2,
  starts_at timestamptz,
  table_label text,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reservations_branch_id_idx ON public.reservations (branch_id);

-- ——— منشورات المجتمع ———
CREATE TABLE IF NOT EXISTS public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  cafe_id uuid REFERENCES public.cafes (id) ON DELETE SET NULL,
  post_kind text NOT NULL DEFAULT 'experience',
  media_type text NOT NULL DEFAULT 'none',
  media_placeholder text,
  body text NOT NULL DEFAULT '',
  hashtags text[] DEFAULT '{}',
  likes_count integer NOT NULL DEFAULT 0,
  shares_count integer NOT NULL DEFAULT 0,
  saves_count integer NOT NULL DEFAULT 0,
  views_count integer NOT NULL DEFAULT 0,
  review_status text NOT NULL DEFAULT 'pending',
  reports_count integer NOT NULL DEFAULT 0,
  reward_eligible boolean NOT NULL DEFAULT false,
  reward_points_preview integer NOT NULL DEFAULT 0,
  product_name text,
  table_label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_posts_cafe_id_idx ON public.community_posts (cafe_id);
CREATE INDEX IF NOT EXISTS community_posts_author_id_idx ON public.community_posts (author_id);

CREATE TABLE IF NOT EXISTS public.community_post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts (id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS community_post_comments_post_id_idx ON public.community_post_comments (post_id);

CREATE TABLE IF NOT EXISTS public.community_post_likes (
  post_id uuid NOT NULL REFERENCES public.community_posts (id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- ——— سجل النشاط ———
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  cafe_id uuid REFERENCES public.cafes (id) ON DELETE SET NULL,
  branch_id uuid REFERENCES public.branches (id) ON DELETE SET NULL,
  activity_type text NOT NULL,
  before_json jsonb,
  after_json jsonb,
  ip text,
  device text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx ON public.activity_logs (created_at DESC);

-- زيادة الإعجابات (للمصادقين) — يتجاوز قيود تحديث عامة
CREATE OR REPLACE FUNCTION public.increment_community_post_like(p_post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.community_posts
  SET likes_count = likes_count + 1, updated_at = now()
  WHERE id = p_post_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_community_post_like(uuid) TO authenticated;

-- تفعيل RLS على cafés إن لم يكن مفعّلًا (سياسة قراءة للمصادقين)
ALTER TABLE public.cafes ENABLE ROW LEVEL SECURITY;

-- ——— RLS أولية (يمكن تشديدها لاحقًا) ———
ALTER TABLE public.cafe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- قراءة عامة للكافيهات النشطة (للخريطة والاستكشاف) — للمصادقين فقط
DROP POLICY IF EXISTS "cafes_select_active_public" ON public.cafes;
CREATE POLICY "cafes_select_active_public"
ON public.cafes FOR SELECT TO authenticated
USING (coalesce(is_active, true) = true);

-- مالك الكوفي يرى فرعه وقائمته (مبسّط: أي authenticated يقرأ branches — عطّل في الإنتاج واستبدل بسياسة membership)
DROP POLICY IF EXISTS "branches_select_auth" ON public.branches;
CREATE POLICY "branches_select_auth"
ON public.branches FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "menu_items_select_auth" ON public.menu_items;
CREATE POLICY "menu_items_select_auth"
ON public.menu_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "community_posts_select_auth" ON public.community_posts;
CREATE POLICY "community_posts_select_auth"
ON public.community_posts FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "community_posts_insert_own" ON public.community_posts;
CREATE POLICY "community_posts_insert_own"
ON public.community_posts FOR INSERT TO authenticated
WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "community_comments_select" ON public.community_post_comments;
CREATE POLICY "community_comments_select"
ON public.community_post_comments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "community_comments_insert" ON public.community_post_comments;
CREATE POLICY "community_comments_insert"
ON public.community_post_comments FOR INSERT TO authenticated
WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "community_likes_own" ON public.community_post_likes;
CREATE POLICY "community_likes_own"
ON public.community_post_likes FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- اشتراكات/طاولات/طلبات: قراءة للمصدّق (مؤقتًا) — service_role يتجاوز RLS للأدمن
DROP POLICY IF EXISTS "cafe_subscriptions_select_auth" ON public.cafe_subscriptions;
CREATE POLICY "cafe_subscriptions_select_auth"
ON public.cafe_subscriptions FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "cafe_tables_select_auth" ON public.cafe_tables;
CREATE POLICY "cafe_tables_select_auth"
ON public.cafe_tables FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "orders_select_own_or_branch" ON public.orders;
CREATE POLICY "orders_select_own_or_branch"
ON public.orders FOR SELECT TO authenticated USING (customer_id = auth.uid() OR customer_id IS NULL);

DROP POLICY IF EXISTS "reservations_select_own" ON public.reservations;
CREATE POLICY "reservations_select_own"
ON public.reservations FOR SELECT TO authenticated USING (customer_id = auth.uid() OR customer_id IS NULL);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_logs_select_own" ON public.activity_logs;
CREATE POLICY "activity_logs_select_own"
ON public.activity_logs FOR SELECT TO authenticated
USING (actor_id = auth.uid());
