/**
 * نموذج بيانات المنيو — جاهز لاستبدال `fetch`/Supabase لاحقًا دون تغيير واجهة المكوّنات.
 * استخدم دوال التحويل إلى DTO عند الربط بالخادم.
 */

export type MenuCategory = "قهوة" | "حلويات" | "مشروبات باردة" | "مخبوزات";

export type PromoKind =
  | "خصم"
  | "واحد وواحد مجانًا"
  | "منتج مجاني مع الطلب"
  | "عرض مخصص";

/** عرض مرتبط بالمنتج — التواريخ بصيغة YYYY-MM-DD للتوافق مع حقول date */
export type ProductPromo = {
  kind: PromoKind;
  discountPercent?: number;
  freeProductId?: string;
  customText?: string;
  startDate: string;
  endDate: string;
};

export type MenuImageVariant = "latte" | "cold" | "cake" | "bakery" | "tea";

export type MenuProduct = {
  id: string;
  name: string;
  category: MenuCategory;
  description: string;
  /** خلفية مصورة محلية عند رفع وهمي؛ إن وُجدت تُعرض بدل التدرج */
  imageDataUrl?: string | null;
  /** تمثيل لوني عند عدم وجود صورة مرفوعة */
  imageVariant: MenuImageVariant;
  price: number;
  calories: number;
  loyaltyPoints: number;
  ingredients: string[];
  available: boolean;
  promo?: ProductPromo | null;
};

export const MENU_CATEGORIES: MenuCategory[] = ["قهوة", "حلويات", "مشروبات باردة", "مخبوزات"];

export const PROMO_KINDS: PromoKind[] = [
  "خصم",
  "واحد وواحد مجانًا",
  "منتج مجاني مع الطلب",
  "عرض مخصص",
];

/** تبويبات العرض — القيم الداخلية للفلترة */
export type MenuTabId = "all" | "coffee" | "desserts" | "cold" | "offers";

export const MENU_TABS: { id: MenuTabId; label: string }[] = [
  { id: "all", label: "كل المنتجات" },
  { id: "coffee", label: "القهوة" },
  { id: "desserts", label: "الحلويات" },
  { id: "cold", label: "المشروبات الباردة" },
  { id: "offers", label: "العروض" },
];

export function isPromoActive(promo: ProductPromo | null | undefined, refDate = new Date()): boolean {
  if (!promo?.startDate || !promo?.endDate) return false;
  const start = new Date(promo.startDate);
  const end = new Date(promo.endDate);
  end.setHours(23, 59, 59, 999);
  return refDate >= start && refDate <= end;
}

export function promoBadgeText(promo: ProductPromo): string {
  switch (promo.kind) {
    case "خصم":
      return promo.discountPercent != null ? `خصم ${promo.discountPercent}%` : "خصم";
    case "واحد وواحد مجانًا":
      return "١ + ١ مجانًا";
    case "منتج مجاني مع الطلب":
      return "منتج مجاني";
    case "عرض مخصص":
      return promo.customText?.slice(0, 24) ? `${promo.customText.slice(0, 24)}…` : "عرض مخصص";
    default:
      return "عرض";
  }
}

export const initialMenuProducts: MenuProduct[] = [
  {
    id: "p1",
    name: "لاتيه البندق",
    category: "قهوة",
    description: "اسبريسو غني مع حليب مخفوق ورائحة بندق دافئة، طبقة حريرية وهادئة.",
    imageVariant: "latte",
    price: 22,
    calories: 210,
    loyaltyPoints: 22,
    ingredients: ["إسبريسو", "حليب", "سيروب بندق"],
    available: true,
    promo: {
      kind: "خصم",
      discountPercent: 15,
      startDate: "2026-05-01",
      endDate: "2026-05-31",
    },
  },
  {
    id: "p2",
    name: "سبانيش لاتيه",
    category: "قهوة",
    description: "توازن بين مرارة الإسبريسو وحلاوة الحليب المكثّف المظلل.",
    imageVariant: "latte",
    price: 24,
    calories: 240,
    loyaltyPoints: 24,
    ingredients: ["إسبريسو", "حليب", "حليب مكثّف"],
    available: true,
    promo: null,
  },
  {
    id: "p3",
    name: "كيك الجزر بالجوز",
    category: "حلويات",
    description: "طبقات رطبة مع جوز محمّص وكريمة خفيفة غير مبالغ فيها.",
    imageVariant: "cake",
    price: 28,
    calories: 380,
    loyaltyPoints: 28,
    ingredients: ["جزر", "دقيق", "جوز", "بهارات"],
    available: false,
    promo: null,
  },
  {
    id: "p4",
    name: "آيس سبانيش",
    category: "مشروبات باردة",
    description: "نسخة باردة من السبانيش مع ثلج مدور ولمسة كراميل.",
    imageVariant: "cold",
    price: 26,
    calories: 290,
    loyaltyPoints: 26,
    ingredients: ["إسبريسو", "حليب", "ثلج", "كراميل"],
    available: true,
    promo: {
      kind: "واحد وواحد مجانًا",
      startDate: "2026-05-08",
      endDate: "2026-05-15",
    },
  },
  {
    id: "p5",
    name: "كرواسون زبد فرنسي",
    category: "مخبوزات",
    description: "طبقات زبد هشّة، مناسبة مع أي مشروب صباحي أو مسائي.",
    imageVariant: "bakery",
    price: 14,
    calories: 320,
    loyaltyPoints: 14,
    ingredients: ["زبد", "دقيق", "خميرة"],
    available: true,
    promo: null,
  },
  {
    id: "p6",
    name: "شاي كرك بالهيل",
    category: "قهوة",
    description: "مزيج تقليدي دافئ من الشاي والبهارات والحليب.",
    imageVariant: "tea",
    price: 12,
    calories: 120,
    loyaltyPoints: 12,
    ingredients: ["شاي", "حليب", "هيل", "سكر"],
    available: true,
    promo: null,
  },
  {
    id: "p7",
    name: "موكا بارد بالدارك",
    category: "مشروبات باردة",
    description: "شوكولاتة داركن مع إسبريسو بارد وحليب شوفان.",
    imageVariant: "cold",
    price: 27,
    calories: 310,
    loyaltyPoints: 27,
    ingredients: ["إسبريسو", "شوكولاتة", "حليب شوفان", "ثلج"],
    available: true,
    promo: {
      kind: "منتج مجاني مع الطلب",
      freeProductId: "p5",
      startDate: "2026-05-10",
      endDate: "2026-06-10",
    },
  },
  {
    id: "p8",
    name: "تشيز كيك التوت البري",
    category: "حلويات",
    description: "قاعدة بسكويت وزينة توت حامض يوازن الحلاوة.",
    imageVariant: "cake",
    price: 32,
    calories: 410,
    loyaltyPoints: 38,
    ingredients: ["جبنة كريمية", "توت بري", "بسكويت"],
    available: true,
    promo: {
      kind: "عرض مخصص",
      customText: "قطعة ثانية بنصف السعر بعد الساعة ٨ مساءً",
      startDate: "2026-05-01",
      endDate: "2026-05-20",
    },
  },
];
