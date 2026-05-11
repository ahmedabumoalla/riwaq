/** عملاء — مركز الذكاء التشغيلي */

export type CafeCustomerRow = {
  id: string;
  name: string;
  phone: string;
  initials: string;
  tier: "ذهبي" | "فضي" | "نخبة" | "جديد";
  points: number;
  ordersTotal: number;
  reservationsTotal: number;
  spendTotal: number;
  lastVisit: string;
  topProduct: string;
  topTable: string;
  posts: number;
  views: number;
  rewardsEarned: number;
};

export type CustomerDetailMock = {
  notes: string[];
  orders: { id: string; total: number; date: string }[];
  reservations: { id: string; table: string; date: string }[];
  loyaltyLedger: { label: string; pts: number; date: string }[];
  rewards: string[];
  posts: { title: string; platform: string; views: number }[];
};

export const cafeCustomersMock: CafeCustomerRow[] = [
  {
    id: "c1",
    name: "نورة العجمي",
    phone: "+966551023344",
    initials: "نع",
    tier: "ذهبي",
    points: 4280,
    ordersTotal: 156,
    reservationsTotal: 42,
    spendTotal: 18420,
    lastVisit: "١٠ مايو ٢٠٢٦",
    topProduct: "موكا باردة",
    topTable: "٢ — وسط الصالة",
    posts: 14,
    views: 48200,
    rewardsEarned: 920,
  },
  {
    id: "c2",
    name: "فيصل الدوسري",
    phone: "+966508871209",
    initials: "فد",
    tier: "فضي",
    points: 1120,
    ordersTotal: 62,
    reservationsTotal: 18,
    spendTotal: 7420,
    lastVisit: "٩ مايو ٢٠٢٦",
    topProduct: "لاتيه بندق",
    topTable: "٣ — باحة",
    posts: 5,
    views: 6200,
    rewardsEarned: 210,
  },
  {
    id: "c3",
    name: "سارة الحربي",
    phone: "+966559332211",
    initials: "سح",
    tier: "نخبة",
    points: 15420,
    ordersTotal: 420,
    reservationsTotal: 110,
    spendTotal: 68200,
    lastVisit: "١٠ مايو ٢٠٢٦",
    topProduct: "كيك الجزر",
    topTable: "١١ — رووف",
    posts: 41,
    views: 310400,
    rewardsEarned: 4100,
  },
];

export function customerDetailMock(id: string): CustomerDetailMock | null {
  const base = cafeCustomersMock.find((c) => c.id === id);
  if (!base) return null;
  return {
    notes: ["يفضل طاولات هادئة", "حساسية من المكسرات — محدث في الملف"],
    orders: [
      { id: "ORD-2091", total: 84, date: "٩ مايو" },
      { id: "ORD-2078", total: 52, date: "٧ مايو" },
    ],
    reservations: [
      { id: "RSV-612", table: "رووف", date: "١٢ مايو ٨ م" },
      { id: "RSV-598", table: "جناح VIP", date: "٣ مايو" },
    ],
    loyaltyLedger: [
      { label: "شراء طلب", pts: 120, date: "٩ مايو" },
      { label: "توثيق تجربة معتمد", pts: 200, date: "٨ مايو" },
      { label: "استبدال مكافأة", pts: -300, date: "١ مايو" },
    ],
    rewards: ["مشروب مجاني متاح", "ترقية طاولة — عطلة نهاية الأسبوع"],
    posts: [
      { title: "جلسة غروب في رِواق", platform: "Instagram", views: 12400 },
      { title: "فيديو تحضير الموكا", platform: "TikTok", views: 89000 },
    ],
  };
}

export const customerIntelSummary = {
  total: 8420,
  active: 6210,
  vip: 840,
  inactive: 620,
  avgValue: 186,
  topVisitName: "سارة الحربي",
  topDocName: "لمى الزهراني",
};
