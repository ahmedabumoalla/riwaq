/**
 * بيانات وهمية لإدارة المنصة — الهيكل قريب من الجداول المستقبلية في Supabase.
 */

export type SubscriptionPlan = "starter" | "professional" | "enterprise";

export type SubscriptionLifecycle =
  | "active"
  | "expired"
  | "expires_7d"
  | "past_due"
  | "trial"
  | "paused";

export type CafeOperationalStatus =
  | "active"
  | "suspended"
  | "review"
  | "payment_late";

export type PaymentStatus = "paid" | "pending" | "failed";

export type SocialPlatform = "tiktok" | "instagram" | "snapchat" | "x";

export type PostReviewStatus = "pending" | "approved" | "rejected" | "featured";

export type CustomerIntelStatus =
  | "active"
  | "high_impact"
  | "needs_review"
  | "banned";

export type ActivityType =
  | "cafe_created"
  | "product_updated"
  | "order_created"
  | "order_rejected"
  | "reservation_accepted"
  | "table_added"
  | "campaign_created"
  | "reward_paid"
  | "payment_recorded"
  | "subscription_changed"
  | "staff_login"
  | "staff_logout";

export interface PlatformAdminOverview {
  totalCafes: number;
  activeCafes: number;
  activeMonthlySubscriptions: number;
  expiredSubscriptions: number;
  mrr: number;
  gmv: number;
  totalOrders: number;
  totalReservations: number;
  totalCustomers: number;
  totalCustomerPosts: number;
  totalViews: number;
  totalEngagement: number;
  contentCommissionRevenue: number;
  monthlyGrowthRate: number;
}

export interface TopCafeRow {
  id: string;
  name: string;
  sales: number;
  orders: number;
  views: number;
  rank: number;
}

export interface SubscriptionHealthCounts {
  active: number;
  expiringSoon: number;
  pastDue: number;
  paused: number;
  trial: number;
}

export interface PlatformRevenueSeriesPoint {
  month: string;
  subscriptions: number;
  content: number;
  fees: number;
}

export interface SocialTopCustomer {
  id: string;
  name: string;
  views: number;
  engagement: number;
  rewardsEarned: number;
}

export type AlertSeverity = "info" | "warning" | "critical";

export interface OperationalAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  body: string;
  cafeId?: string;
  customerId?: string;
}

export interface PlatformCafeBranch {
  id: string;
  name: string;
  city: string;
}

export interface PlatformCafe {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  branchCount: number;
  subscriptionLifecycle: SubscriptionLifecycle;
  subscriptionStart: string;
  subscriptionEnd: string;
  plan: SubscriptionPlan;
  monthlyPrice: number;
  totalSales: number;
  ordersCount: number;
  reservationsCount: number;
  productsCount: number;
  tablesCount: number;
  employeesCount: number;
  customersCount: number;
  campaignsCount: number;
  customerPostsCount: number;
  viewsTotal: number;
  engagementTotal: number;
  lastActivityAt: string;
  cafeStatus: CafeOperationalStatus;
  internalNotes: string;
  branches: PlatformCafeBranch[];
}

export interface PlatformCustomerRow {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  registeredAt: string;
  cafesVisited: number;
  ordersCount: number;
  reservationsCount: number;
  totalSpend: number;
  loyaltyPoints: number;
  postsCount: number;
  viewsTotal: number;
  likesTotal: number;
  commentsTotal: number;
  sharesTotal: number;
  rewardsDue: number;
  rewardsPaid: number;
  status: CustomerIntelStatus;
}

export interface PlatformSubscriptionRow {
  id: string;
  cafeId: string;
  cafeName: string;
  plan: SubscriptionPlan;
  monthlyPrice: number;
  startDate: string;
  endDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  lastInvoiceId: string;
  totalPaid: number;
  daysRemaining: number;
  lifecycle: SubscriptionLifecycle;
  notes: string;
}

export interface SubscriptionInvoiceRow {
  id: string;
  cafeName: string;
  amount: number;
  issuedAt: string;
  status: PaymentStatus;
}

export interface ManualPaymentRow {
  id: string;
  cafeName: string;
  amount: number;
  recordedAt: string;
  reference: string;
}

export interface ContentRevenueRow {
  id: string;
  postId: string;
  cafeName: string;
  platformShare: number;
  period: string;
}

export interface CustomerRewardPayoutRow {
  id: string;
  customerName: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
}

export interface SocialPostRow {
  id: string;
  cafeId: string;
  cafeName: string;
  customerId: string;
  customerName: string;
  platform: SocialPlatform;
  url: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  rewardCalculated: number;
  reviewStatus: PostReviewStatus;
  rewardPaid: boolean;
  platformRevenueFromPost: number;
}

export interface ActivityLogRow {
  id: string;
  actorName: string;
  actorRole: string;
  cafeName: string | null;
  branchName: string | null;
  activityType: ActivityType;
  beforeJson: string | null;
  afterJson: string | null;
  occurredAt: string;
  ip: string;
  device: string;
}

export const PLAN_LABELS_AR: Record<SubscriptionPlan, string> = {
  starter: "Starter",
  professional: "Professional",
  enterprise: "Enterprise",
};

export const SUBSCRIPTION_LIFECYCLE_LABELS_AR: Record<SubscriptionLifecycle, string> = {
  active: "نشط",
  expired: "منتهي",
  expires_7d: "ينتهي خلال 7 أيام",
  past_due: "متأخر بالدفع",
  trial: "تجريبي",
  paused: "موقوف",
};

export const CAFE_STATUS_LABELS_AR: Record<CafeOperationalStatus, string> = {
  active: "نشط",
  suspended: "موقوف",
  review: "تحت المراجعة",
  payment_late: "متأخر بالدفع",
};

export const CUSTOMER_STATUS_LABELS_AR: Record<CustomerIntelStatus, string> = {
  active: "نشط",
  high_impact: "عالي التأثير",
  needs_review: "يحتاج مراجعة",
  banned: "محظور",
};

export const SOCIAL_PLATFORM_LABELS_AR: Record<SocialPlatform, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  snapchat: "Snapchat",
  x: "X",
};

export const ACTIVITY_TYPE_LABELS_AR: Record<ActivityType, string> = {
  cafe_created: "إنشاء كوفي",
  product_updated: "تعديل منتج",
  order_created: "إنشاء طلب",
  order_rejected: "رفض طلب",
  reservation_accepted: "قبول حجز",
  table_added: "إضافة طاولة",
  campaign_created: "إنشاء حملة",
  reward_paid: "صرف مكافأة",
  payment_recorded: "تسجيل دفعة",
  subscription_changed: "تغيير اشتراك",
  staff_login: "دخول موظف",
  staff_logout: "خروج موظف",
};

export const overview: PlatformAdminOverview = {
  totalCafes: 128,
  activeCafes: 104,
  activeMonthlySubscriptions: 96,
  expiredSubscriptions: 14,
  mrr: 487_500,
  gmv: 12_400_000,
  totalOrders: 892_400,
  totalReservations: 156_200,
  totalCustomers: 1_240_000,
  totalCustomerPosts: 48_900,
  totalViews: 920_000_000,
  totalEngagement: 42_000_000,
  contentCommissionRevenue: 1_850_000,
  monthlyGrowthRate: 12.4,
};

export const subscriptionHealth: SubscriptionHealthCounts = {
  active: 96,
  expiringSoon: 18,
  pastDue: 7,
  paused: 5,
  trial: 12,
};

export const topCafes: TopCafeRow[] = [
  { id: "c1", name: "حبّ القهوة — الرياض", sales: 1_240_000, orders: 42_100, views: 12_400_000, rank: 1 },
  { id: "c2", name: "ركن السّادة — جدة", sales: 980_000, orders: 31_200, views: 9_800_000, rank: 2 },
  { id: "c3", name: "مقهى النخيل — الدمام", sales: 720_000, orders: 24_500, views: 6_200_000, rank: 3 },
  { id: "c4", name: "بيت الإسبريسو — مكة", sales: 610_000, orders: 19_800, views: 5_100_000, rank: 4 },
  { id: "c5", name: "خطّ القهوة — الخبر", sales: 540_000, orders: 17_200, views: 4_400_000, rank: 5 },
];

export const revenueSeries: PlatformRevenueSeriesPoint[] = [
  { month: "يناير", subscriptions: 320_000, content: 95_000, fees: 28_000 },
  { month: "فبراير", subscriptions: 335_000, content: 102_000, fees: 31_000 },
  { month: "مارس", subscriptions: 352_000, content: 118_000, fees: 34_000 },
  { month: "أبريل", subscriptions: 368_000, content: 125_000, fees: 36_000 },
  { month: "مايو", subscriptions: 382_000, content: 132_000, fees: 38_000 },
  { month: "يونيو", subscriptions: 401_000, content: 140_000, fees: 41_000 },
];

export const socialTopCustomers: SocialTopCustomer[] = [
  { id: "u1", name: "نورة العتيبي", views: 8_200_000, engagement: 620_000, rewardsEarned: 12_400 },
  { id: "u2", name: "سعد المالكي", views: 6_100_000, engagement: 410_000, rewardsEarned: 9_800 },
  { id: "u3", name: "لينا الشهري", views: 5_400_000, engagement: 380_000, rewardsEarned: 8_200 },
  { id: "u4", name: "فهد القحطاني", views: 4_900_000, engagement: 290_000, rewardsEarned: 7_100 },
];

export const operationalAlerts: OperationalAlert[] = [
  {
    id: "a1",
    severity: "warning",
    title: "اشتراك ينتهي خلال 5 أيام",
    body: "كوفي «حبّ القهوة — فرع الشمال» — باقة Professional",
    cafeId: "c1",
  },
  {
    id: "a2",
    severity: "critical",
    title: "مبيعات نازلة أسبوعيًا",
    body: "انخفاض 18٪ مقارنة بالأسبوع السابق — ركن السّادة جدة",
    cafeId: "c2",
  },
  {
    id: "a3",
    severity: "warning",
    title: "طلبات مرفوضة مرتفعة",
    body: "نسبة الرفض 9.2٪ — فرع الكورنيش",
    cafeId: "c3",
  },
  {
    id: "a4",
    severity: "info",
    title: "عميل حقق مشاهدات عالية",
    body: "نورة العتيبي — 2.1M مشاهدة خلال 48 ساعة",
    customerId: "u1",
  },
  {
    id: "a5",
    severity: "warning",
    title: "مكافآت تحتاج مراجعة",
    body: "12 طلب صرف معلّق بسبب اختلاف نسب التفاعل",
  },
];

const branchTemplate = (prefix: string): PlatformCafeBranch[] => [
  { id: `${prefix}b1`, name: "الفرع الرئيسي", city: "الرياض" },
  { id: `${prefix}b2`, name: "فرع المطار", city: "الرياض" },
  { id: `${prefix}b3`, name: "فرع الكورنيش", city: "جدة" },
];

export const platformCafes: PlatformCafe[] = [
  {
    id: "c1",
    name: "حبّ القهوة",
    ownerName: "عبدالله المطيري",
    ownerEmail: "abdullah@habcoffee.sa",
    ownerPhone: "+966501112233",
    branchCount: 3,
    subscriptionLifecycle: "active",
    subscriptionStart: "2024-06-01",
    subscriptionEnd: "2026-08-01",
    plan: "enterprise",
    monthlyPrice: 2_499,
    totalSales: 4_200_000,
    ordersCount: 142_000,
    reservationsCount: 28_400,
    productsCount: 186,
    tablesCount: 94,
    employeesCount: 42,
    customersCount: 89_000,
    campaignsCount: 24,
    customerPostsCount: 3_400,
    viewsTotal: 42_000_000,
    engagementTotal: 1_800_000,
    lastActivityAt: "2026-05-12T08:40:00+03:00",
    cafeStatus: "active",
    internalNotes: "عميل استراتيجي — أولوية دعم فني.",
    branches: branchTemplate("c1"),
  },
  {
    id: "c2",
    name: "ركن السّادة",
    ownerName: "هند العمري",
    ownerEmail: "hind@rukn.sa",
    ownerPhone: "+966504445566",
    branchCount: 2,
    subscriptionLifecycle: "expires_7d",
    subscriptionStart: "2025-01-10",
    subscriptionEnd: "2026-05-18",
    plan: "professional",
    monthlyPrice: 1_299,
    totalSales: 2_100_000,
    ordersCount: 71_200,
    reservationsCount: 12_100,
    productsCount: 98,
    tablesCount: 48,
    employeesCount: 22,
    customersCount: 41_200,
    campaignsCount: 11,
    customerPostsCount: 1_820,
    viewsTotal: 18_200_000,
    engagementTotal: 920_000,
    lastActivityAt: "2026-05-11T22:15:00+03:00",
    cafeStatus: "payment_late",
    internalNotes: "متابعة تحصيل — اتصال 15 مايو.",
    branches: [
      { id: "c2b1", name: "جدة — البلد", city: "جدة" },
      { id: "c2b2", name: "جدة — الحمراء", city: "جدة" },
    ],
  },
  {
    id: "c3",
    name: "مقهى النخيل",
    ownerName: "خالد الدوسري",
    ownerEmail: "khalid@nakhil.cafe",
    ownerPhone: "+966507778899",
    branchCount: 1,
    subscriptionLifecycle: "trial",
    subscriptionStart: "2026-04-20",
    subscriptionEnd: "2026-05-20",
    plan: "starter",
    monthlyPrice: 499,
    totalSales: 120_000,
    ordersCount: 4_200,
    reservationsCount: 900,
    productsCount: 42,
    tablesCount: 18,
    employeesCount: 8,
    customersCount: 5_400,
    campaignsCount: 2,
    customerPostsCount: 210,
    viewsTotal: 1_100_000,
    engagementTotal: 48_000,
    lastActivityAt: "2026-05-12T06:00:00+03:00",
    cafeStatus: "review",
    internalNotes: "تجربة — مراجعة جودة المحتوى قبل التفعيل الكامل.",
    branches: [{ id: "c3b1", name: "الدمام — الشاطئ", city: "الدمام" }],
  },
  {
    id: "c4",
    name: "بيت الإسبريسو",
    ownerName: "ريم الغامدي",
    ownerEmail: "reem@baytespresso.com",
    ownerPhone: "+966509990011",
    branchCount: 4,
    subscriptionLifecycle: "past_due",
    subscriptionStart: "2023-11-01",
    subscriptionEnd: "2026-04-30",
    plan: "professional",
    monthlyPrice: 1_299,
    totalSales: 3_800_000,
    ordersCount: 128_000,
    reservationsCount: 21_000,
    productsCount: 154,
    tablesCount: 76,
    employeesCount: 36,
    customersCount: 72_000,
    campaignsCount: 18,
    customerPostsCount: 2_900,
    viewsTotal: 31_000_000,
    engagementTotal: 1_400_000,
    lastActivityAt: "2026-05-10T14:20:00+03:00",
    cafeStatus: "suspended",
    internalNotes: "موقوف مؤقتًا لحين سداد الفاتورة #INV-88421.",
    branches: branchTemplate("c4"),
  },
];

export const platformCustomers: PlatformCustomerRow[] = [
  {
    id: "u1",
    fullName: "نورة العتيبي",
    email: "noura@example.com",
    phone: "+966501234567",
    registeredAt: "2024-02-14",
    cafesVisited: 28,
    ordersCount: 412,
    reservationsCount: 64,
    totalSpend: 18_400,
    loyaltyPoints: 12_800,
    postsCount: 86,
    viewsTotal: 8_200_000,
    likesTotal: 420_000,
    commentsTotal: 38_000,
    sharesTotal: 12_400,
    rewardsDue: 2_100,
    rewardsPaid: 10_300,
    status: "high_impact",
  },
  {
    id: "u2",
    fullName: "سعد المالكي",
    email: "saad@example.com",
    phone: "+966502222333",
    registeredAt: "2025-08-01",
    cafesVisited: 12,
    ordersCount: 98,
    reservationsCount: 12,
    totalSpend: 4_200,
    loyaltyPoints: 3_100,
    postsCount: 22,
    viewsTotal: 1_200_000,
    likesTotal: 62_000,
    commentsTotal: 4_200,
    sharesTotal: 1_800,
    rewardsDue: 400,
    rewardsPaid: 1_900,
    status: "active",
  },
  {
    id: "u3",
    fullName: "ماجد القحطاني",
    email: "majed@example.com",
    phone: "+966503333444",
    registeredAt: "2023-11-20",
    cafesVisited: 6,
    ordersCount: 34,
    reservationsCount: 4,
    totalSpend: 1_100,
    loyaltyPoints: 400,
    postsCount: 8,
    viewsTotal: 180_000,
    likesTotal: 9_000,
    commentsTotal: 2_400,
    sharesTotal: 600,
    rewardsDue: 0,
    rewardsPaid: 200,
    status: "needs_review",
  },
];

export const platformSubscriptions: PlatformSubscriptionRow[] = [
  ...platformCafes.map((c, i) => ({
    id: `sub-${c.id}`,
    cafeId: c.id,
    cafeName: c.name,
    plan: c.plan,
    monthlyPrice: c.monthlyPrice,
    startDate: c.subscriptionStart,
    endDate: c.subscriptionEnd,
    paymentStatus: (i === 1 ? "pending" : i === 3 ? "failed" : "paid") as PaymentStatus,
    paymentMethod: i % 2 === 0 ? "مدى — تلقائي" : "تحويل بنكي",
    lastInvoiceId: `INV-${88000 + i}`,
    totalPaid: c.monthlyPrice * (10 + i * 2),
    daysRemaining: Math.max(0, 40 - i * 12),
    lifecycle: c.subscriptionLifecycle,
    notes: i === 3 ? "متأخر 12 يومًا" : "—",
  })),
  {
    id: "sub-x1",
    cafeId: "cx",
    cafeName: "كوفي قديم — مغلق",
    plan: "starter",
    monthlyPrice: 499,
    startDate: "2023-01-01",
    endDate: "2025-12-31",
    paymentStatus: "failed",
    paymentMethod: "بطاقة",
    lastInvoiceId: "INV-77001",
    totalPaid: 4_990,
    daysRemaining: 0,
    lifecycle: "expired",
    notes: "أرشيف",
  },
  {
    id: "sub-x2",
    cafeId: "cy",
    cafeName: "مقهى الواحة",
    plan: "professional",
    monthlyPrice: 1_299,
    startDate: "2025-06-01",
    endDate: "2026-12-01",
    paymentStatus: "pending",
    paymentMethod: "تحويل",
    lastInvoiceId: "INV-77002",
    totalPaid: 5_000,
    daysRemaining: 200,
    lifecycle: "paused",
    notes: "إيقاف بناءً على طلب المالك",
  },
];

export const subscriptionInvoices: SubscriptionInvoiceRow[] = [
  { id: "INV-88001", cafeName: "حبّ القهوة", amount: 2_499, issuedAt: "2026-05-01", status: "paid" },
  { id: "INV-88002", cafeName: "ركن السّادة", amount: 1_299, issuedAt: "2026-05-01", status: "pending" },
  { id: "INV-88003", cafeName: "مقهى النخيل", amount: 499, issuedAt: "2026-04-20", status: "paid" },
];

export const manualPayments: ManualPaymentRow[] = [
  { id: "mp1", cafeName: "حبّ القهوة", amount: 2_499, recordedAt: "2026-05-02", reference: "TRF-992831" },
  { id: "mp2", cafeName: "بيت الإسبريسو", amount: 3_897, recordedAt: "2026-04-28", reference: "TRF-772100" },
];

export const contentRevenueRows: ContentRevenueRow[] = [
  { id: "cr1", postId: "p1", cafeName: "حبّ القهوة", platformShare: 4_200, period: "2026-04" },
  { id: "cr2", postId: "p2", cafeName: "ركن السّادة", platformShare: 2_800, period: "2026-04" },
];

export const customerRewardPayouts: CustomerRewardPayoutRow[] = [
  { id: "rw1", customerName: "نورة العتيبي", amount: 800, status: "pending", createdAt: "2026-05-11" },
  { id: "rw2", customerName: "سعد المالكي", amount: 350, status: "paid", createdAt: "2026-05-08" },
];

export const socialPosts: SocialPostRow[] = [
  {
    id: "p1",
    cafeId: "c1",
    cafeName: "حبّ القهوة",
    customerId: "u1",
    customerName: "نورة العتيبي",
    platform: "tiktok",
    url: "https://tiktok.com/@example/video/1",
    views: 1_240_000,
    likes: 82_000,
    comments: 4_200,
    shares: 2_100,
    engagementRate: 7.1,
    rewardCalculated: 620,
    reviewStatus: "pending",
    rewardPaid: false,
    platformRevenueFromPost: 1_240,
  },
  {
    id: "p2",
    cafeId: "c2",
    cafeName: "ركن السّادة",
    customerId: "u2",
    customerName: "سعد المالكي",
    platform: "instagram",
    url: "https://instagram.com/p/xyz",
    views: 420_000,
    likes: 28_000,
    comments: 1_900,
    shares: 800,
    engagementRate: 7.8,
    rewardCalculated: 280,
    reviewStatus: "approved",
    rewardPaid: true,
    platformRevenueFromPost: 890,
  },
  {
    id: "p3",
    cafeId: "c1",
    cafeName: "حبّ القهوة",
    customerId: "u3",
    customerName: "ماجد القحطاني",
    platform: "snapchat",
    url: "https://snapchat.com/add/example",
    views: 95_000,
    likes: 4_200,
    comments: 620,
    shares: 310,
    engagementRate: 5.4,
    rewardCalculated: 95,
    reviewStatus: "rejected",
    rewardPaid: false,
    platformRevenueFromPost: 0,
  },
];

export const activityLog: ActivityLogRow[] = [
  {
    id: "log1",
    actorName: "عبدالله المطيري",
    actorRole: "cafe_owner",
    cafeName: "حبّ القهوة",
    branchName: "الفرع الرئيسي",
    activityType: "product_updated",
    beforeJson: '{"price":12}',
    afterJson: '{"price":14}',
    occurredAt: "2026-05-12T09:12:00+03:00",
    ip: "185.12.xx.xx",
    device: "Chrome · Windows",
  },
  {
    id: "log2",
    actorName: "نورة العتيبي",
    actorRole: "customer",
    cafeName: "ركن السّادة",
    branchName: "جدة — البلد",
    activityType: "order_created",
    beforeJson: null,
    afterJson: '{"total":46.5}',
    occurredAt: "2026-05-12T09:05:00+03:00",
    ip: "188.44.xx.xx",
    device: "Safari · iOS",
  },
  {
    id: "log3",
    actorName: "هند العمري",
    actorRole: "branch_manager",
    cafeName: "ركن السّادة",
    branchName: "جدة — الحمراء",
    activityType: "order_rejected",
    beforeJson: '{"status":"pending"}',
    afterJson: '{"status":"rejected"}',
    occurredAt: "2026-05-12T08:58:00+03:00",
    ip: "185.12.xx.xx",
    device: "Chrome · macOS",
  },
  {
    id: "log4",
    actorName: "خالد الدوسري",
    actorRole: "cafe_owner",
    cafeName: "مقهى النخيل",
    branchName: "الدمام — الشاطئ",
    activityType: "campaign_created",
    beforeJson: null,
    afterJson: '{"name":"صيف النخيل"}',
    occurredAt: "2026-05-12T08:40:00+03:00",
    ip: "176.22.xx.xx",
    device: "Edge · Windows",
  },
  {
    id: "log5",
    actorName: "مسؤول المنصة",
    actorRole: "platform_admin",
    cafeName: "بيت الإسبريسو",
    branchName: null,
    activityType: "subscription_changed",
    beforeJson: '{"plan":"professional"}',
    afterJson: '{"plan":"professional","paused":true}',
    occurredAt: "2026-05-11T16:30:00+03:00",
    ip: "10.0.xx.xx",
    device: "Chrome · Linux",
  },
  {
    id: "log6",
    actorName: "فهد الكاشير",
    actorRole: "cashier",
    cafeName: "حبّ القهوة",
    branchName: "فرع المطار",
    activityType: "staff_login",
    beforeJson: null,
    afterJson: '{"session":true}',
    occurredAt: "2026-05-11T07:55:00+03:00",
    ip: "185.55.xx.xx",
    device: "Chrome · Android",
  },
];

export const revenueKpis = {
  mrr: overview.mrr,
  arr: overview.mrr * 12,
  totalPayments: 5_820_000,
  totalArrears: 186_000,
  avgSubscriptionValue: overview.mrr / Math.max(1, overview.activeMonthlySubscriptions),
  bestSellingPlan: "professional" as SubscriptionPlan,
  topPayingCafe: "حبّ القهوة",
  topContentCampaign: "صيف النخيل — الدمام",
};
