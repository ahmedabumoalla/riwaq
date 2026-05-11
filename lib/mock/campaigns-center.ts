export type CampaignCenterStatus = "مسودة" | "مجدولة" | "نشطة" | "متوقفة" | "منتهية";

export type CampaignCenterType =
  | "خصم"
  | "كوبون"
  | "رسالة للعملاء"
  | "حملة توثيق تجربة"
  | "حملة مؤثرين"
  | "حملة طاولة مميزة"
  | "حملة منتج جديد"
  | "حملة وقت الركود";

export type SocialPlatform = "TikTok" | "Instagram" | "Snapchat" | "X";

export type CampaignCenterRow = {
  id: string;
  title: string;
  type: CampaignCenterType;
  audience: string;
  startDate: string;
  endDate: string;
  status: CampaignCenterStatus;
  budgetSar: number;
  participants: number;
  posts: number;
  views: number;
  rewardsSummary: string;
  conversionRate: number;
  platforms?: SocialPlatform[];
};

export type CreatorLeader = {
  id: string;
  name: string;
  posts: number;
  views: number;
  engagement: number;
  rewardsEarned: number;
  topPlatform: SocialPlatform;
};

export const campaignCenterSeed: CampaignCenterRow[] = [
  {
    id: "cc1",
    title: "شتاء البندق — خصم انتقائي",
    type: "خصم",
    audience: "عملاء الولاء الذهبي + الزوار المتكررين",
    startDate: "٢٠٢٦-٠٥-٠١",
    endDate: "٢٠٢٦-٠٥-٣١",
    status: "نشطة",
    budgetSar: 18000,
    participants: 4200,
    posts: 890,
    views: 920000,
    rewardsSummary: "شرائح خصم ١٠–٢٠٪ + نقاط إضافية",
    conversionRate: 6.8,
    platforms: ["Instagram", "Snapchat"],
  },
  {
    id: "cc2",
    title: "روّق وجهك — توثيق تجربة",
    type: "حملة توثيق تجربة",
    audience: "من زار الفرع آخر ٢١ يومًا",
    startDate: "٢٠٢٦-٠٥-٠٨",
    endDate: "٢٠٢٦-٠٦-٠٨",
    status: "نشطة",
    budgetSar: 24000,
    participants: 6100,
    posts: 2340,
    views: 1840000,
    rewardsSummary: "نقاط ولاء + مشروبات مجانية حسب الأداء",
    conversionRate: 9.2,
    platforms: ["TikTok", "Instagram"],
  },
  {
    id: "cc3",
    title: "طاولة الغروب المميزة",
    type: "حملة طاولة مميزة",
    audience: "قائمة انتظار الحجز المسبق",
    startDate: "٢٠٢٦-٠٤-٢٠",
    endDate: "٢٠٢٦-٠٥-٢٠",
    status: "متوقفة",
    budgetSar: 9000,
    participants: 980,
    posts: 420,
    views: 310000,
    rewardsSummary: "ترقية طاولة + تصوير معتمد",
    conversionRate: 4.1,
    platforms: ["Instagram"],
  },
  {
    id: "cc4",
    title: "إطلالة الإسبوع — منتج جديد",
    type: "حملة منتج جديد",
    audience: "المشتركون في الإشعارات",
    startDate: "٢٠٢٦-٠٥-١٢",
    endDate: "٢٠٢٦-٠٦-٠٢",
    status: "مجدولة",
    budgetSar: 12000,
    participants: 0,
    posts: 0,
    views: 0,
    rewardsSummary: "عينات مجانية + كوبونات",
    conversionRate: 0,
    platforms: ["TikTok", "X", "Instagram"],
  },
  {
    id: "cc5",
    title: "بعد الظهر الهادئ — وقت الركود",
    type: "حملة وقت الركود",
    audience: "عملاء محيط الفرع ٥ كم",
    startDate: "٢٠٢٦-٠٣-٠١",
    endDate: "٢٠٢٦-٠٤-١٥",
    status: "منتهية",
    budgetSar: 7500,
    participants: 5100,
    posts: 670,
    views: 402000,
    rewardsSummary: "كوبون مشروب ثاني بنصف السعر",
    conversionRate: 5.4,
    platforms: ["Snapchat"],
  },
];

export const creatorLeaderboard: CreatorLeader[] = [
  {
    id: "cr1",
    name: "سارة الحربي",
    posts: 41,
    views: 310400,
    engagement: 18400,
    rewardsEarned: 2650,
    topPlatform: "Instagram",
  },
  {
    id: "cr2",
    name: "لمى الزهراني",
    posts: 28,
    views: 128900,
    engagement: 9200,
    rewardsEarned: 1480,
    topPlatform: "TikTok",
  },
  {
    id: "cr3",
    name: "نورة العجمي",
    posts: 14,
    views: 48200,
    engagement: 4100,
    rewardsEarned: 620,
    topPlatform: "Snapchat",
  },
];

export function campaignAggregates(rows: CampaignCenterRow[]) {
  const active = rows.filter((r) => r.status === "نشطة").length;
  const targeted = rows.reduce((s, r) => s + r.participants, 0);
  const avgEngagement =
    rows.length === 0
      ? 0
      : rows.reduce((s, r) => s + r.conversionRate, 0) / rows.length;
  const couponsUsed = Math.round(targeted * (avgEngagement / 100));
  const posts = rows.reduce((s, r) => s + r.posts, 0);
  const views = rows.reduce((s, r) => s + r.views, 0);
  const best = [...rows].sort((a, b) => b.conversionRate - a.conversionRate)[0];
  return {
    activeCampaigns: active,
    targeted,
    avgEngagement: Number(avgEngagement.toFixed(1)),
    couponsUsed,
    posts,
    views,
    bestCampaignTitle: best?.title ?? "—",
    bestCampaignRate: best?.conversionRate ?? 0,
  };
}
