-- رِواق: دوال مساعدة + جداول إضافية + RLS (منصة، كوفي، عميل)
-- نفّذ بعد 20260513000001_riwaq_domain_tables.sql

-- ——— دوال SECURITY DEFINER (تتجنب تكرار RLS على profiles) ———
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'platform_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_cafe(cafe_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cafes c
    WHERE c.id = cafe_uuid AND c.owner_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.owns_branch(branch_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.branches b
    JOIN public.cafes c ON c.id = b.cafe_id
    WHERE b.id = branch_uuid AND c.owner_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.owns_cafe(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.owns_branch(uuid) TO authenticated;

-- ——— مواقع الخريطة ———
CREATE TABLE IF NOT EXISTS public.cafe_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES public.cafes (id) ON DELETE CASCADE,
  branch_id uuid REFERENCES public.branches (id) ON DELETE SET NULL,
  label text,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cafe_locations_cafe_id_idx ON public.cafe_locations (cafe_id);

-- ——— فواتير الاشتراك ———
CREATE TABLE IF NOT EXISTS public.subscription_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES public.cafe_subscriptions (id) ON DELETE SET NULL,
  cafe_id uuid NOT NULL REFERENCES public.cafes (id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  issued_at timestamptz NOT NULL DEFAULT now(),
  period_label text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS subscription_invoices_cafe_id_idx ON public.subscription_invoices (cafe_id);

-- ——— بنود الطلب ———
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  name text NOT NULL,
  qty integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  line_total numeric NOT NULL DEFAULT 0,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items (order_id);

-- ——— إعادة تسمية سجل النشاط إلى platform_activity_logs ———
DO $$
BEGIN
  IF to_regclass('public.activity_logs') IS NOT NULL AND to_regclass('public.platform_activity_logs') IS NULL THEN
    ALTER TABLE public.activity_logs RENAME TO platform_activity_logs;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.platform_activity_logs (
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

CREATE INDEX IF NOT EXISTS platform_activity_logs_created_at_idx ON public.platform_activity_logs (created_at DESC);

-- ——— RLS: إيقاف السياسات العريضة القديمة ———
DROP POLICY IF EXISTS "cafes_select_active_public" ON public.cafes;
DROP POLICY IF EXISTS "branches_select_auth" ON public.branches;
DROP POLICY IF EXISTS "menu_items_select_auth" ON public.menu_items;
DROP POLICY IF EXISTS "community_posts_select_auth" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts_insert_own" ON public.community_posts;
DROP POLICY IF EXISTS "community_comments_select" ON public.community_post_comments;
DROP POLICY IF EXISTS "community_comments_insert" ON public.community_post_comments;
DROP POLICY IF EXISTS "community_likes_own" ON public.community_post_likes;
DROP POLICY IF EXISTS "cafe_subscriptions_select_auth" ON public.cafe_subscriptions;
DROP POLICY IF EXISTS "cafe_tables_select_auth" ON public.cafe_tables;
DROP POLICY IF EXISTS "orders_select_own_or_branch" ON public.orders;
DROP POLICY IF EXISTS "reservations_select_own" ON public.reservations;
DROP POLICY IF EXISTS "activity_logs_select_own" ON public.platform_activity_logs;

-- ——— profiles ———
DROP POLICY IF EXISTS "profiles_select_platform_admin" ON public.profiles;
CREATE POLICY "profiles_select_platform_admin"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_platform_admin());

-- (السياسة الحالية profiles_select_own من ملف أقدم — لا نحذفها هنا إن وُجدت)

-- ——— cafés ———
DROP POLICY IF EXISTS "cafes_select_scoped" ON public.cafes;
CREATE POLICY "cafes_select_scoped"
ON public.cafes FOR SELECT TO authenticated
USING (
  public.is_platform_admin()
  OR owner_id = auth.uid()
  OR coalesce(is_active, true) = true
);

DROP POLICY IF EXISTS "cafes_update_owner" ON public.cafes;
CREATE POLICY "cafes_update_owner"
ON public.cafes FOR UPDATE TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- ——— branches ———
DROP POLICY IF EXISTS "branches_select_scoped" ON public.branches;
CREATE POLICY "branches_select_scoped"
ON public.branches FOR SELECT TO authenticated
USING (
  public.is_platform_admin()
  OR public.owns_cafe(cafe_id)
  OR EXISTS (
    SELECT 1 FROM public.cafes c
    WHERE c.id = cafe_id AND coalesce(c.is_active, true) = true
  )
);

-- ——— cafe_locations ———
ALTER TABLE public.cafe_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cafe_locations_select" ON public.cafe_locations;
CREATE POLICY "cafe_locations_select"
ON public.cafe_locations FOR SELECT TO authenticated
USING (
  public.is_platform_admin()
  OR public.owns_cafe(cafe_id)
  OR EXISTS (
    SELECT 1 FROM public.cafes c
    WHERE c.id = cafe_id AND coalesce(c.is_active, true) = true
  )
);

-- ——— menu_items ———
DROP POLICY IF EXISTS "menu_items_select" ON public.menu_items;
CREATE POLICY "menu_items_select"
ON public.menu_items FOR SELECT TO authenticated
USING (
  public.is_platform_admin()
  OR public.owns_cafe(cafe_id)
  OR (
    coalesce(is_active, true) = true
    AND EXISTS (
      SELECT 1 FROM public.cafes c
      WHERE c.id = cafe_id AND coalesce(c.is_active, true) = true
    )
  )
);

DROP POLICY IF EXISTS "menu_items_mutate_owner" ON public.menu_items;
CREATE POLICY "menu_items_mutate_owner"
ON public.menu_items FOR ALL TO authenticated
USING (public.owns_cafe(cafe_id))
WITH CHECK (public.owns_cafe(cafe_id));

-- ——— cafe_tables ———
DROP POLICY IF EXISTS "cafe_tables_select" ON public.cafe_tables;
CREATE POLICY "cafe_tables_select"
ON public.cafe_tables FOR SELECT TO authenticated
USING (public.is_platform_admin() OR public.owns_branch(branch_id));

DROP POLICY IF EXISTS "cafe_tables_mutate_owner" ON public.cafe_tables;
CREATE POLICY "cafe_tables_mutate_owner"
ON public.cafe_tables FOR ALL TO authenticated
USING (public.owns_branch(branch_id))
WITH CHECK (public.owns_branch(branch_id));

-- ——— orders ———
DROP POLICY IF EXISTS "orders_select" ON public.orders;
CREATE POLICY "orders_select"
ON public.orders FOR SELECT TO authenticated
USING (
  public.is_platform_admin()
  OR customer_id = auth.uid()
  OR (branch_id IS NOT NULL AND public.owns_branch(branch_id))
);

DROP POLICY IF EXISTS "orders_insert_staff" ON public.orders;
CREATE POLICY "orders_insert_staff"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (
  (branch_id IS NOT NULL AND public.owns_branch(branch_id))
  OR customer_id = auth.uid()
);

DROP POLICY IF EXISTS "orders_update_staff" ON public.orders;
CREATE POLICY "orders_update_staff"
ON public.orders FOR UPDATE TO authenticated
USING (
  public.is_platform_admin()
  OR (branch_id IS NOT NULL AND public.owns_branch(branch_id))
)
WITH CHECK (
  public.is_platform_admin()
  OR (branch_id IS NOT NULL AND public.owns_branch(branch_id))
);

-- ——— order_items ———
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_select" ON public.order_items;
CREATE POLICY "order_items_select"
ON public.order_items FOR SELECT TO authenticated
USING (
  public.is_platform_admin()
  OR EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id AND (
      o.customer_id = auth.uid()
      OR (o.branch_id IS NOT NULL AND public.owns_branch(o.branch_id))
    )
  )
);

DROP POLICY IF EXISTS "order_items_mutate_staff" ON public.order_items;
CREATE POLICY "order_items_mutate_staff"
ON public.order_items FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id
      AND o.branch_id IS NOT NULL
      AND public.owns_branch(o.branch_id)
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id
      AND o.branch_id IS NOT NULL
      AND public.owns_branch(o.branch_id)
  )
);

-- ——— reservations ———
DROP POLICY IF EXISTS "reservations_select" ON public.reservations;
CREATE POLICY "reservations_select"
ON public.reservations FOR SELECT TO authenticated
USING (
  public.is_platform_admin()
  OR customer_id = auth.uid()
  OR (branch_id IS NOT NULL AND public.owns_branch(branch_id))
);

DROP POLICY IF EXISTS "reservations_insert" ON public.reservations;
CREATE POLICY "reservations_insert"
ON public.reservations FOR INSERT TO authenticated
WITH CHECK (
  customer_id = auth.uid()
  OR (branch_id IS NOT NULL AND public.owns_branch(branch_id))
);

DROP POLICY IF EXISTS "reservations_update_staff" ON public.reservations;
CREATE POLICY "reservations_update_staff"
ON public.reservations FOR UPDATE TO authenticated
USING (
  public.is_platform_admin()
  OR (branch_id IS NOT NULL AND public.owns_branch(branch_id))
)
WITH CHECK (
  public.is_platform_admin()
  OR (branch_id IS NOT NULL AND public.owns_branch(branch_id))
);

-- ——— cafe_subscriptions ———
DROP POLICY IF EXISTS "cafe_subscriptions_select" ON public.cafe_subscriptions;
CREATE POLICY "cafe_subscriptions_select"
ON public.cafe_subscriptions FOR SELECT TO authenticated
USING (public.is_platform_admin() OR public.owns_cafe(cafe_id));

-- ——— subscription_invoices ———
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subscription_invoices_select" ON public.subscription_invoices;
CREATE POLICY "subscription_invoices_select"
ON public.subscription_invoices FOR SELECT TO authenticated
USING (public.is_platform_admin() OR public.owns_cafe(cafe_id));

-- ——— community_posts ———
DROP POLICY IF EXISTS "community_posts_select_scoped" ON public.community_posts;
CREATE POLICY "community_posts_select_scoped"
ON public.community_posts FOR SELECT TO authenticated
USING (
  public.is_platform_admin()
  OR author_id = auth.uid()
  OR review_status = 'approved'
  OR (cafe_id IS NOT NULL AND public.owns_cafe(cafe_id))
);

DROP POLICY IF EXISTS "community_posts_insert_customer" ON public.community_posts;
CREATE POLICY "community_posts_insert_customer"
ON public.community_posts FOR INSERT TO authenticated
WITH CHECK (
  author_id = auth.uid()
  AND review_status = 'pending'
);

DROP POLICY IF EXISTS "community_posts_update_admin" ON public.community_posts;
CREATE POLICY "community_posts_update_admin"
ON public.community_posts FOR UPDATE TO authenticated
USING (public.is_platform_admin())
WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "community_posts_update_owner_cafe" ON public.community_posts;
CREATE POLICY "community_posts_update_owner_cafe"
ON public.community_posts FOR UPDATE TO authenticated
USING (cafe_id IS NOT NULL AND public.owns_cafe(cafe_id))
WITH CHECK (cafe_id IS NOT NULL AND public.owns_cafe(cafe_id));

-- ——— comments ———
DROP POLICY IF EXISTS "community_comments_select_scoped" ON public.community_post_comments;
CREATE POLICY "community_comments_select_scoped"
ON public.community_post_comments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.community_posts p
    WHERE p.id = post_id AND (
      public.is_platform_admin()
      OR p.author_id = auth.uid()
      OR p.review_status = 'approved'
      OR (p.cafe_id IS NOT NULL AND public.owns_cafe(p.cafe_id))
    )
  )
);

DROP POLICY IF EXISTS "community_comments_insert" ON public.community_post_comments;
CREATE POLICY "community_comments_insert"
ON public.community_post_comments FOR INSERT TO authenticated
WITH CHECK (author_id = auth.uid());

-- ——— likes ———
DROP POLICY IF EXISTS "community_likes_own" ON public.community_post_likes;
CREATE POLICY "community_likes_own"
ON public.community_post_likes FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ——— platform_activity_logs ———
ALTER TABLE public.platform_activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "platform_activity_logs_admin" ON public.platform_activity_logs;
CREATE POLICY "platform_activity_logs_admin"
ON public.platform_activity_logs FOR SELECT TO authenticated
USING (public.is_platform_admin());

DROP POLICY IF EXISTS "platform_activity_logs_actor" ON public.platform_activity_logs;
CREATE POLICY "platform_activity_logs_actor"
ON public.platform_activity_logs FOR SELECT TO authenticated
USING (actor_id = auth.uid());

DROP POLICY IF EXISTS "platform_activity_logs_insert_admin" ON public.platform_activity_logs;
CREATE POLICY "platform_activity_logs_insert_admin"
ON public.platform_activity_logs FOR INSERT TO authenticated
WITH CHECK (public.is_platform_admin());
