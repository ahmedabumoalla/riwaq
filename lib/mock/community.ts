/**
 * منشورات المجتمع — هيكل قريب من جداول مستقبلية (posts, comments, reactions).
 */

export type AuthorKind = "customer" | "cafe";

export type PostKind =
  | "experience"
  | "photo"
  | "video"
  | "tip"
  | "recipe"
  | "table_experience"
  | "product_experience"
  | "cafe_review"
  | "product_suggestion"
  | "visit_story";

export type ReviewStatus = "pending" | "approved" | "rejected" | "flagged" | "featured";

export type CommunityComment = {
  id: string;
  author: string;
  authorKind: AuthorKind;
  text: string;
  createdAt: string;
  isVip?: boolean;
  replies?: { id: string; author: string; text: string }[];
};

export type CommunityPost = {
  id: string;
  authorName: string;
  authorKind: AuthorKind;
  authorAvatarInitials: string;
  cafeId: string;
  cafeName: string;
  productName?: string;
  tableLabel?: string;
  postKind: PostKind;
  mediaType: "image" | "video" | "none";
  mediaPlaceholderLabel: string;
  body: string;
  hashtags: string[];
  likes: number;
  comments: CommunityComment[];
  shares: number;
  saves: number;
  views: number;
  reviewStatus: ReviewStatus;
  reportsCount: number;
  rewardEligible: boolean;
  rewardPointsPreview: number;
  cafeApproved?: boolean;
  engagementBadge?: "trending" | "top_creator";
};

export const postKindLabelsAr: Record<PostKind, string> = {
  experience: "تجربة",
  photo: "صورة",
  video: "فيديو",
  tip: "نصيحة",
  recipe: "وصفة",
  table_experience: "تجربة طاولة",
  product_experience: "تجربة منتج",
  cafe_review: "تقييم كوفي",
  product_suggestion: "اقتراح منتج",
  visit_story: "تجربة زيارة",
};

export const reviewStatusLabelsAr: Record<ReviewStatus, string> = {
  pending: "بانتظار المراجعة",
  approved: "مقبول",
  rejected: "مرفوض",
  flagged: "مبلغ عنه",
  featured: "مميز",
};

export const communityPosts: CommunityPost[] = [
  {
    id: "cp-1",
    authorName: "نورة العتيبي",
    authorKind: "customer",
    authorAvatarInitials: "نع",
    cafeId: "mc-1",
    cafeName: "رِواق — برج المملكة",
    productName: "فلات وايت",
    tableLabel: "رووف ١",
    postKind: "visit_story",
    mediaType: "image",
    mediaPlaceholderLabel: "صورة غروب من الرووف",
    body: "جلسة مسائية لا تُنسى — الإضاءة والقهوة متناغمين. أنصح بالحجز المسبع للرووف.",
    hashtags: ["#رواق", "#الرياض", "#قهوة_مختصة"],
    likes: 842,
    comments: [
      {
        id: "cm-1",
        author: "لمى",
        authorKind: "customer",
        text: "أنا حجزت نفس الطاولة الأسبوع الجاي 😍",
        createdAt: "2026-05-11T10:00:00+03:00",
        isVip: true,
        replies: [{ id: "r1", author: "نورة العتيبي", text: "بالتوفيق! اطلبي الغروب." }],
      },
      {
        id: "cm-2",
        author: "رِواق",
        authorKind: "cafe",
        text: "شكرًا لكِ — نتطلع لزيارتك القادمة.",
        createdAt: "2026-05-11T11:20:00+03:00",
      },
    ],
    shares: 120,
    saves: 64,
    views: 124_000,
    reviewStatus: "approved",
    reportsCount: 0,
    rewardEligible: true,
    rewardPointsPreview: 320,
    cafeApproved: true,
    engagementBadge: "trending",
  },
  {
    id: "cp-2",
    authorName: "سعد المالكي",
    authorKind: "customer",
    authorAvatarInitials: "سم",
    cafeId: "mc-3",
    cafeName: "ركن السّادة — الكورنيش",
    postKind: "photo",
    mediaType: "image",
    mediaPlaceholderLabel: "صورة كورنيش مع المشروب",
    body: "أجواء بحرية مع موكا مثلجة — #رواق_الكورنيش",
    hashtags: ["#جدة", "#كورنيش"],
    likes: 410,
    comments: [
      {
        id: "cm-3",
        author: "هند",
        authorKind: "customer",
        text: "الإضاءة للتصوير ممتازة.",
        createdAt: "2026-05-10T09:00:00+03:00",
      },
    ],
    shares: 55,
    saves: 22,
    views: 48_200,
    reviewStatus: "pending",
    reportsCount: 0,
    rewardEligible: true,
    rewardPointsPreview: 180,
    engagementBadge: "top_creator",
  },
  {
    id: "cp-3",
    authorName: "رِواق — برج المملكة",
    authorKind: "cafe",
    authorAvatarInitials: "رق",
    cafeId: "mc-1",
    cafeName: "رِواق — برج المملكة",
    postKind: "tip",
    mediaType: "none",
    mediaPlaceholderLabel: "",
    body: "نصيحة اليوم: جرّب الإسبريسو المزدوج مع كرواسون الفستق قبل ١١ ص — الطازج يصل يوميًا.",
    hashtags: ["#نصيحة_بارستا"],
    likes: 210,
    comments: [],
    shares: 34,
    saves: 88,
    views: 12_400,
    reviewStatus: "approved",
    reportsCount: 0,
    rewardEligible: false,
    rewardPointsPreview: 0,
  },
  {
    id: "cp-4",
    authorName: "ماجد القحطاني",
    authorKind: "customer",
    authorAvatarInitials: "مق",
    cafeId: "mc-2",
    cafeName: "حبّ القهوة — حي النرجس",
    postKind: "product_suggestion",
    mediaType: "none",
    mediaPlaceholderLabel: "",
    body: "اقتراح: إضافة مشروب سيزونال بالرمان مع إسبريسو — راح يجنن في الشتاء.",
    hashtags: ["#اقتراح"],
    likes: 92,
    comments: [],
    shares: 12,
    saves: 9,
    views: 5_600,
    reviewStatus: "flagged",
    reportsCount: 2,
    rewardEligible: false,
    rewardPointsPreview: 0,
  },
  {
    id: "cp-5",
    authorName: "لينا الشهري",
    authorKind: "customer",
    authorAvatarInitials: "لش",
    cafeId: "mc-1",
    cafeName: "رِواق — برج المملكة",
    postKind: "recipe",
    mediaType: "image",
    mediaPlaceholderLabel: "صورة الخطوات",
    body: "وصفة مقترحة: آيس لاتيه بالورد — إسبريسو بارد، حليب شوفان، سيروب ورد خفيف، وزينة بتلات وردية.",
    hashtags: ["#وصفة", "#آيس_لاتيه"],
    likes: 156,
    comments: [],
    shares: 20,
    saves: 44,
    views: 9_200,
    reviewStatus: "approved",
    reportsCount: 0,
    rewardEligible: true,
    rewardPointsPreview: 90,
  },
];

export function postsByCafeId(cafeId: string): CommunityPost[] {
  return communityPosts.filter((p) => p.cafeId === cafeId);
}

export function postsForDashboardCafe(): CommunityPost[] {
  /* كوفي تجريبي واحد — نفس فروع العرض */
  return communityPosts.filter((p) => p.cafeId === "mc-1" || p.authorKind === "cafe");
}

/** لتوافق الشيفرة القديمة مع `community-view` */
export const communitySidebarMeta = {
  polls: [{ q: "ما أفضل وقت للزيارة؟", options: ["بعد الظهر", "مساءً", "وقت الغروب"], votes: 420 }],
  cafeAnnouncement: "تحدي الأسبوع: صوّر قهوتك مع هاشتاق #رواق_الواجهة واربح نقاطًا إضافية.",
  challenges: ["صور قهوتك", "أفضل طاولة لديك", "تجربة الأسبوع"],
};
