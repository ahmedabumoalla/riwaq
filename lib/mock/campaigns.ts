export type CampaignType = "عرض" | "كوبون" | "رسالة للعملاء" | "حملة محتوى";

export type CampaignStatus = "مسودة" | "مجدولة" | "نشطة" | "منتهية";

export type CampaignRow = {
  id: string;
  title: string;
  type: CampaignType;
  audience: string;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
};

export const initialCampaigns: CampaignRow[] = [
  {
    id: "cmp1",
    title: "خصم الجلسة المسائية",
    type: "عرض",
    audience: "عملاء الولاء الذهبيون",
    startDate: "٢٠٢٦-٠٥-٠١",
    endDate: "٢٠٢٦-٠٥-٣١",
    status: "نشطة",
  },
  {
    id: "cmp2",
    title: "كوبون ترحيب للزوار الجدد",
    type: "كوبون",
    audience: "تسجيل جديد — آخر ٣٠ يومًا",
    startDate: "٢٠٢٦-٠٥-٠٨",
    endDate: "٢٠٢٦-٠٦-٠٨",
    status: "مجدولة",
  },
  {
    id: "cmp3",
    title: "رسالة عيد الفطر",
    type: "رسالة للعملاء",
    audience: "جميع المشتركين في الإشعارات",
    startDate: "٢٠٢٦-٠٤-٢٨",
    endDate: "٢٠٢٦-٠٥-٠٣",
    status: "منتهية",
  },
];
