export type LoyaltyIntelTierId = "جديد" | "فضي" | "ذهبي" | "نخبة" | "سفير المكان";

export type LoyaltyIntelCustomer = {
  id: string;
  name: string;
  phone: string;
  initials: string;
  tier: LoyaltyIntelTierId;
  pointsCurrent: number;
  pointsRedeemed: number;
  lastVisit: string;
  topProduct: string;
  topTable: string;
  docPosts: number;
  totalViews: number;
  pendingRewards: string;
  inactiveDays: number;
  documented: boolean;
};

export type TierDefinition = {
  id: LoyaltyIntelTierId;
  pointsRequired: number;
  discountPercent: number;
  benefits: string[];
  specialRewards: string[];
};

export type RewardProgramType =
  | "خصم"
  | "مشروب مجاني"
  | "منتج مجاني"
  | "ترقية طاولة"
  | "نقاط إضافية"
  | "مكافأة مالية"
  | "دعوة لتجربة منتج جديد";

export type DocumentationRule = {
  id: string;
  titleAr: string;
  rewardAr: string;
};

export const tierDefinitions: TierDefinition[] = [
  {
    id: "جديد",
    pointsRequired: 0,
    discountPercent: 0,
    benefits: ["ترحيب رقمي باسم الكوفي", "تذكير بلائحة الحساسية"],
    specialRewards: ["كوب ترحيب بعد أول زيارة موثقة"],
  },
  {
    id: "فضي",
    pointsRequired: 800,
    discountPercent: 5,
    benefits: ["أولوية في قائمة الانتظار الخفيفة", "عروض صباح الخميس"],
    specialRewards: ["مشروب بارد مجاني شهريًا"],
  },
  {
    id: "ذهبي",
    pointsRequired: 2500,
    discountPercent: 10,
    benefits: ["حجز طاولة مميزة عند التوفر", "إشعارات مبكرة بالحملات"],
    specialRewards: ["صحن حلويات موسمي"], 
  },
  {
    id: "نخبة",
    pointsRequired: 6000,
    discountPercent: 12,
    benefits: ["مساحة هادئة للتصوير المعتمد", "خصم شركاء العلامة"],
    specialRewards: ["جلسة تقييم مع مدير الفرع"],
  },
  {
    id: "سفير المكان",
    pointsRequired: 12000,
    discountPercent: 15,
    benefits: ["دعوات حصرية للتجارب الجديدة", "ظهور اسم العميل كسفير موسمي"],
    specialRewards: ["مكافأة نقدية رمزية فصلية + هدايا محدودة"],
  },
];

export const documentationRules: DocumentationRule[] = [
  { id: "d1", titleAr: "نشر تجربة مع هاشتاق رِواق", rewardAr: "+٥٠ نقطة" },
  { id: "d2", titleAr: "تجاوز ٥٠٠ مشاهدة على المنشور المعتمد", rewardAr: "+١٠٠ نقطة" },
  { id: "d3", titleAr: "تجاوز ١٠٠٠ مشاهدة", rewardAr: "مشروب مجاني من قائمة مختارة" },
  { id: "d4", titleAr: "تجاوز ٥٠٠٠ مشاهدة", rewardAr: "مكافأة خاصة من الإدارة" },
  { id: "d5", titleAr: "أعلى منشور أداء خلال الشهر", rewardAr: "مكافأة نقدية رمزية" },
];

export const rewardProgramTypes: RewardProgramType[] = [
  "خصم",
  "مشروب مجاني",
  "منتج مجاني",
  "ترقية طاولة",
  "نقاط إضافية",
  "مكافأة مالية",
  "دعوة لتجربة منتج جديد",
];

export const loyaltyIntelCustomers: LoyaltyIntelCustomer[] = [
  {
    id: "li1",
    name: "نورة العجمي",
    phone: "+966551023344",
    initials: "نع",
    tier: "ذهبي",
    pointsCurrent: 4280,
    pointsRedeemed: 920,
    lastVisit: "١٠ مايو ٢٠٢٦",
    topProduct: "موكا باردة",
    topTable: "طاولة ٢ — وسط الصالة",
    docPosts: 14,
    totalViews: 48200,
    pendingRewards: "مشروب مجاني + ترقية طاولة عند الحجز القادم",
    inactiveDays: 0,
    documented: true,
  },
  {
    id: "li2",
    name: "فيصل الدوسري",
    phone: "+966508871209",
    initials: "فد",
    tier: "فضي",
    pointsCurrent: 1120,
    pointsRedeemed: 340,
    lastVisit: "٩ مايو ٢٠٢٦",
    topProduct: "لاتيه بندق",
    topTable: "جلسة باحة — طاولة ٣",
    docPosts: 5,
    totalViews: 6200,
    pendingRewards: "—",
    inactiveDays: 1,
    documented: true,
  },
  {
    id: "li3",
    name: "لمى الزهراني",
    phone: "+966558887766",
    initials: "لز",
    tier: "نخبة",
    pointsCurrent: 7840,
    pointsRedeemed: 2100,
    lastVisit: "١٠ مايو ٢٠٢٦",
    topProduct: "شاي كرك",
    topTable: "١١ — رووف",
    docPosts: 28,
    totalViews: 128900,
    pendingRewards: "مكافأة أعلى منشور — قيد المراجعة",
    inactiveDays: 0,
    documented: true,
  },
  {
    id: "li4",
    name: "أحمد البقمي",
    phone: "+966554009911",
    initials: "أب",
    tier: "جديد",
    pointsCurrent: 180,
    pointsRedeemed: 0,
    lastVisit: "٣ مايو ٢٠٢٦",
    topProduct: "أمريكانو مثلج",
    topTable: "طاولة ١",
    docPosts: 0,
    totalViews: 0,
    pendingRewards: "كوب ترحيب بعد أول توثيق",
    inactiveDays: 7,
    documented: false,
  },
  {
    id: "li5",
    name: "سارة الحربي",
    phone: "+966559332211",
    initials: "سح",
    tier: "سفير المكان",
    pointsCurrent: 15420,
    pointsRedeemed: 4100,
    lastVisit: "١٠ مايو ٢٠٢٦",
    topProduct: "كيك الجزر",
    topTable: "جناح VIP — ٤",
    docPosts: 41,
    totalViews: 310400,
    pendingRewards: "دعوة تجربة منتج جديد + نقاط إضافية",
    inactiveDays: 0,
    documented: true,
  },
];

export type LoyaltyIntelStats = {
  totalMembers: number;
  pointsIssued: number;
  pointsUsed: number;
  rewardsRedeemed: number;
  topCustomerName: string;
  topCustomerPoints: number;
  inactiveMembers: number;
  avgVisitFrequencyDays: number;
};

export function computeLoyaltyStats(customers: LoyaltyIntelCustomer[]): LoyaltyIntelStats {
  const pointsIssued = customers.reduce((s, c) => s + c.pointsCurrent + c.pointsRedeemed, 0);
  const pointsUsed = customers.reduce((s, c) => s + c.pointsRedeemed, 0);
  const top = [...customers].sort((a, b) => b.pointsCurrent - a.pointsCurrent)[0];
  const inactiveMembers = customers.filter((c) => c.inactiveDays >= 14).length;
  return {
    totalMembers: customers.length,
    pointsIssued,
    pointsUsed,
    rewardsRedeemed: Math.round(pointsUsed / 80),
    topCustomerName: top?.name ?? "—",
    topCustomerPoints: top?.pointsCurrent ?? 0,
    inactiveMembers,
    avgVisitFrequencyDays: 11,
  };
}
