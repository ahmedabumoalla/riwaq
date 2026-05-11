/** تجربة العميل — بيانات وهمية موحّدة */

export const mockCustomerProfile = {
  name: "لمى الزهراني",
  initials: "لز",
  phone: "+966558887766",
  email: "lama.z@email.sa",
  tier: "ذهبي",
  points: 4280,
  nextTier: "نخبة",
  pointsToNext: 1720,
  ordersCount: 94,
  reservationsCount: 28,
  rewardsRedeemed: 12,
  postsCount: 18,
} as const;

export const mockCustomerHome = {
  greeting: "مساء الخير",
  nearestReward: "مشروب مجاني — يبقى ٤٢٠ نقطة",
  activeOrder: {
    id: "ORD-3188",
    status: "قيد التجهيز",
    etaMin: 9,
    items: "موكا باردة · كرواسون بالشوكولاتة",
  } as const,
  upcomingReservation: {
    id: "RSV-1204",
    table: "١١ — رووف",
    when: "الجمعة ٨:٠٠ م",
    guests: 4,
  } as const,
  offers: ["خصم ١٥٪ على الحلويات مساءً", "نقاط مضاعفة مع توثيق تجربتك"],
  favorites: ["موكا باردة", "كيك الجزر", "شاي كرك"],
  favTable: "رووف الغروب",
  branchName: "رِواق — الواجهة البحرية",
};

export const mockExploreCafe = {
  name: "رِواق — الواجهة البحرية",
  rating: 4.9,
  reviews: 1284,
  hours: "٨ ص — ٢ ص",
  location: "جدة · الواجهة البحرية · بوابة ٣",
  crowd: "مزدحم الآن — ذروة مسائية",
  popular: ["موكا باردة", "لاتيه البندق", "كيك الجزر"],
  featuredTables: ["رووف الغروب", "جناح VIP", "باحة داخلية"],
  promos: ["Happy Hour ٤–٧ م", "نقاط ولاء على الحجز المسبق"],
};

export type CustomerMenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  cal: number;
  ingredients: string;
  promo?: string;
  points: number;
  gradient: string;
};

export const mockMenuItems: CustomerMenuItem[] = [
  {
    id: "m1",
    name: "موكا باردة",
    desc: "إسبresso غني مع شوكولاتة بلجيكية وحليب كامل الدسم.",
    price: 26,
    cal: 280,
    ingredients: "قهوة، حليب، شوكولاتة، ثلج",
    promo: "+٥٠ نقطة إضافية",
    points: 35,
    gradient: "from-amber-100/80 via-white to-riwaq-beige",
  },
  {
    id: "m2",
    name: "لاتيه بندق",
    desc: "حريري مع نكهة بندق محمصة وفوم حريري.",
    price: 22,
    cal: 240,
    ingredients: "إسبresso، حليب، سيروب بندق",
    points: 28,
    gradient: "from-riwaq-caramel/25 via-white to-orange-50",
  },
  {
    id: "m3",
    name: "كيك الجزر بالجوز",
    desc: "طبقة كريم خفيفة، جوز محمص، بهارات دافئة.",
    price: 34,
    cal: 410,
    ingredients: "جزر، جوز، دقيق، بهارات",
    promo: "١+١ مع أي مشروب",
    points: 42,
    gradient: "from-orange-100/70 via-white to-amber-50",
  },
];

export const drinkModifiers = ["بدون سكر", "ثلج قليل", "حليب شوفان", "إضافة كراميل"] as const;

export type CustomerOrder = {
  id: string;
  status: string;
  total: number;
  etaMin?: number;
  items: { name: string; qty: number; price: number }[];
  promo?: string;
  timeline: { step: string; done: boolean }[];
};

export const mockCustomerOrders: CustomerOrder[] = [
  {
    id: "ORD-3188",
    status: "قيد التجهيز",
    total: 58,
    etaMin: 9,
    items: [
      { name: "موكا باردة", qty: 1, price: 26 },
      { name: "كرواسون شوكولاتة", qty: 1, price: 32 },
    ],
    promo: "خصم ولاء ١٠٪",
    timeline: [
      { step: "تم الإرسال", done: true },
      { step: "بانتظار موافقة الكوفي", done: true },
      { step: "تم القبول", done: true },
      { step: "قيد التجهيز", done: true },
      { step: "جاهز للاستلام", done: false },
      { step: "تم التسليم", done: false },
    ],
  },
  {
    id: "ORD-3140",
    status: "تم التسليم",
    total: 41,
    items: [{ name: "شاي كرك", qty: 2, price: 18 }],
    timeline: [
      { step: "تم الإرسال", done: true },
      { step: "بانتظار موافقة الكوفي", done: true },
      { step: "تم القبول", done: true },
      { step: "قيد التجهيز", done: true },
      { step: "جاهز للاستلام", done: true },
      { step: "تم التسليم", done: true },
    ],
  },
];

export type CustomerReservation = {
  id: string;
  table: string;
  when: string;
  guests: number;
  durationMin: number;
  partition: boolean;
  services: string[];
  status: "قادم" | "نشط" | "منتهي";
  gradient: string;
};

export const mockCustomerReservations: CustomerReservation[] = [
  {
    id: "RSV-1204",
    table: "١١ — رووف",
    when: "الجمعة ٨:٠٠ م",
    guests: 4,
    durationMin: 105,
    partition: true,
    services: ["إطلالة", "دفاية"],
    status: "قادم",
    gradient: "from-sky-200/50 via-white to-indigo-50",
  },
  {
    id: "RSV-1188",
    table: "جناح VIP",
    when: "٢ مايو ٢٠٢٦",
    guests: 6,
    durationMin: 120,
    partition: false,
    services: ["شاشة"],
    status: "منتهي",
    gradient: "from-riwaq-brown/20 via-white to-riwaq-caramel/15",
  },
];

export const loyaltyProgressMock = {
  currentTier: "ذهبي",
  nextTier: "نخبة",
  pct: 72,
  ledger: [
    { label: "طلبات هذا الشهر", pts: 620 },
    { label: "حجوزات مؤكدة", pts: 180 },
    { label: "توثيق تجربة معتمد", pts: 240 },
  ],
  rules: ["كل ١٠ ر.س = ١ نقطة", "الرووف يمنح نقاط إضافية عند التوثيق"],
};

export type RewardCard = {
  id: string;
  title: string;
  kind: string;
  cost: number;
  expires: string;
  qr: string;
};

export const mockRewards: RewardCard[] = [
  {
    id: "r1",
    title: "خصم ٢٠٪ على الحلويات",
    kind: "خصم",
    cost: 800,
    expires: "٣١ مايو ٢٠٢٦",
    qr: "RW-RWD-00921",
  },
  {
    id: "r2",
    title: "مشروب بارد مجاني",
    kind: "مشروب مجاني",
    cost: 450,
    expires: "٢٠ مايو ٢٠٢٦",
    qr: "RW-RWD-00922",
  },
  {
    id: "r3",
    title: "ترقية طاولة رووف",
    kind: "ترقية طاولة",
    cost: 2200,
    expires: "١٥ يونيو ٢٠٢٦",
    qr: "RW-RWD-00923",
  },
];

export type ShareSubmission = {
  id: string;
  platform: string;
  contentType: string;
  linked: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  rewardPreview: string;
  status: "بانتظار المراجعة" | "مقبول" | "مرفوض" | "تمت المكافأة";
};

export const mockShareSubmissions: ShareSubmission[] = [
  {
    id: "SH-001",
    platform: "Instagram",
    contentType: "Reel",
    linked: "حجز رووف",
    views: 12400,
    likes: 982,
    comments: 54,
    shares: 112,
    rewardPreview: "+٣٢٠ نقطة + مشروب مجاني",
    status: "تمت المكافأة",
  },
  {
    id: "SH-002",
    platform: "TikTok",
    contentType: "TikTok",
    linked: "طلب موكا باردة",
    views: 5600,
    likes: 410,
    comments: 28,
    shares: 67,
    rewardPreview: "+١٨٠ نقطة",
    status: "بانتظار المراجعة",
  },
];

export const shareLeaderboardMock = [
  { name: "سارة الحربي", views: "٣١٠ ألف", reward: "٢٬٦٥٠ نقطة", platform: "Instagram" },
  { name: "لمى الزهراني", views: "١٢٨ ألف", reward: "١٬٤٨٠ نقطة", platform: "TikTok" },
  { name: "نورة العجمي", views: "٤٨ ألف", reward: "٦٢٠ نقطة", platform: "Snapchat" },
];

/** @deprecated استخدم `@/lib/mock/community` */
export { communitySidebarMeta as communityMock } from "./community";
