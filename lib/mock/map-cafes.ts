/**
 * كافيهات وهمية للخريطة — جاهزة لاحقًا لربط Mapbox بنفس الحقول.
 * الإحداثيات: WGS84
 */

export type PriceTier = "budget" | "mid" | "premium";
export type CrowdLevel = "low" | "medium" | "high";
export type CoffeeStyle = "specialty" | "commercial" | "mixed";
export type ViewType = "interior" | "outdoor" | "roof" | "mountain" | "sea" | "garden";
export type ProductTag = "specialty_coffee" | "desserts" | "cold_drinks" | "breakfast" | "sandwich";

export type MapCafe = {
  id: string;
  name: string;
  slug: string;
  region: string;
  city: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  hoursLabel: string;
  crowd: CrowdLevel;
  coffeeStyle: CoffeeStyle;
  productTags: ProductTag[];
  viewTypes: ViewType[];
  priceTier: PriceTier;
  tablesAvailableNow: boolean;
  hasPartition: boolean;
  hasHeater: boolean;
  hasScreen: boolean;
  activeOffers: boolean;
  loyaltyPointsHigh: boolean;
  workStudyFriendly: boolean;
  familyFriendly: boolean;
  heroImage: string;
  tagline: string;
  address: string;
  menuHighlights: string[];
  tableLabels: string[];
  promos: string[];
  loyaltySnippet: string;
  communityPreview: { author: string; excerpt: string }[];
  reviews: { author: string; text: string; rating: number }[];
  googleMapsUrl?: string | null;
  isOpenNow?: boolean;
};

/** مراكز مناطق يدوية عند رفض الموقع */
export const manualRegionCenters: { id: string; label: string; lat: number; lng: number }[] = [
  { id: "riyadh", label: "الرياض — العليا", lat: 24.7115, lng: 46.6753 },
  { id: "jeddah", label: "جدة — الواجهة", lat: 21.5433, lng: 39.1728 },
  { id: "dammam", label: "الدمام — الكورنيش", lat: 26.4207, lng: 50.0888 },
  { id: "makkah", label: "مكة — العزيزية", lat: 21.4225, lng: 39.8262 },
];

export const mapCafes: MapCafe[] = [
  {
    id: "mc-1",
    name: "رِواق — برج المملكة",
    slug: "riwaq-kingdom",
    region: "الرياض",
    city: "الرياض",
    lat: 24.7114,
    lng: 46.6743,
    rating: 4.9,
    reviewCount: 1820,
    hoursLabel: "٧ ص — ١٢ م",
    crowd: "high",
    coffeeStyle: "specialty",
    productTags: ["specialty_coffee", "desserts", "cold_drinks", "breakfast"],
    viewTypes: ["roof", "interior"],
    priceTier: "premium",
    tablesAvailableNow: false,
    hasPartition: true,
    hasHeater: true,
    hasScreen: true,
    activeOffers: true,
    loyaltyPointsHigh: true,
    workStudyFriendly: true,
    familyFriendly: true,
    heroImage: "/og-image.png",
    tagline: "إطلالة حضرية فوق المدينة",
    address: "برج المملكة — الطابق الميزانين",
    menuHighlights: ["إسبريسو مزدوج", "كرواسون بالفستق", "موكا باردة"],
    tableLabels: ["رووف ١", "جناح هادئ", "بار طويل"],
    promos: ["نقاط مضاعفة ٤–٧ م", "خصم طلاب ١٠٪"],
    loyaltySnippet: "٤٬٢٨٠ نقطة للعميل المتوسط شهريًا",
    communityPreview: [
      { author: "نورة", excerpt: "أفضل غروب مع فلات وايت…" },
      { author: "سعد", excerpt: "بار الهدوء مثالي للعمل…" },
    ],
    reviews: [
      { author: "لينا", text: "خدمة سريعة وتنظيم ممتاز للطاولات.", rating: 5 },
      { author: "فهد", text: "مزدحم أحيانًا لكن الجودة تستحق.", rating: 4 },
    ],
  },
  {
    id: "mc-2",
    name: "حبّ القهوة — حي النرجس",
    slug: "hub-narjis",
    region: "الرياض",
    city: "الرياض",
    lat: 24.8231,
    lng: 46.7022,
    rating: 4.7,
    reviewCount: 640,
    hoursLabel: "٦ ص — ١١ م",
    crowd: "medium",
    coffeeStyle: "specialty",
    productTags: ["specialty_coffee", "sandwich", "cold_drinks"],
    viewTypes: ["interior", "garden"],
    priceTier: "mid",
    tablesAvailableNow: true,
    hasPartition: true,
    hasHeater: true,
    hasScreen: false,
    activeOffers: false,
    loyaltyPointsHigh: false,
    workStudyFriendly: true,
    familyFriendly: true,
    heroImage: "/og-image.png",
    tagline: "جلسات هادئة وحديقة داخلية",
    address: "حي النرجس — طريق الملك عبدالعزيز",
    menuHighlights: ["V60 كينيا", "ساندويتش تركي", "آيس لاتيه"],
    tableLabels: ["بار النافذة", "طاولة ٤ أشخاص", "باحة"],
    promos: [],
    loyaltySnippet: "مستوى ولاء متنامٍ",
    communityPreview: [{ author: "دانة", excerpt: "الحديقة رائعة للعائلة…" }],
    reviews: [{ author: "ماجد", text: "قهوة مختصة بمستوى عالٍ.", rating: 5 }],
  },
  {
    id: "mc-3",
    name: "ركن السّادة — الكورنيش",
    slug: "rukn-corniche",
    region: "جدة",
    city: "جدة",
    lat: 21.6021,
    lng: 39.1045,
    rating: 4.8,
    reviewCount: 2100,
    hoursLabel: "٨ ص — ٢ ص",
    crowd: "high",
    coffeeStyle: "mixed",
    productTags: ["desserts", "cold_drinks", "breakfast", "sandwich"],
    viewTypes: ["sea", "outdoor", "roof"],
    priceTier: "mid",
    tablesAvailableNow: true,
    hasPartition: false,
    hasHeater: false,
    hasScreen: true,
    activeOffers: true,
    loyaltyPointsHigh: true,
    workStudyFriendly: false,
    familyFriendly: true,
    heroImage: "/og-image.png",
    tagline: "نسيم البحر مع غروب الشمس",
    address: "جدة — الكورنيش الشمالي",
    menuHighlights: ["موكا مثلجة", "وفل بالتوفي", "فطور إنجليزي"],
    tableLabels: ["طاولة بحرية", "رووف غروب", "داخل مكيف"],
    promos: ["Happy Hour ٥–٨ م"],
    loyaltySnippet: "حملة مشاهدات أسبوعية",
    communityPreview: [{ author: "هند", excerpt: "أفضل كورنيش للتصوير…" }],
    reviews: [{ author: "خالد", text: "إطلالة لا تُنسى.", rating: 5 }],
  },
  {
    id: "mc-4",
    name: "مقهى النخيل — الشاطئ",
    slug: "nakhil-beach",
    region: "الدمام",
    city: "الدمام",
    lat: 26.485,
    lng: 50.075,
    rating: 4.5,
    reviewCount: 312,
    hoursLabel: "٧ ص — ١١ م",
    crowd: "low",
    coffeeStyle: "commercial",
    productTags: ["cold_drinks", "sandwich", "breakfast"],
    viewTypes: ["interior"],
    priceTier: "budget",
    tablesAvailableNow: true,
    hasPartition: false,
    hasHeater: false,
    hasScreen: false,
    activeOffers: false,
    loyaltyPointsHigh: false,
    workStudyFriendly: true,
    familyFriendly: false,
    heroImage: "/og-image.png",
    tagline: "جلسة عمل سريعة بسعر لطيف",
    address: "الدمام — حي الشاطئ",
    menuHighlights: ["شاي كرك", "ساندويتش جبن", "موهيتو قهوة"],
    tableLabels: ["طاولة فردية", "زاوية USB"],
    promos: [],
    loyaltySnippet: "بداية برنامج ولاء",
    communityPreview: [],
    reviews: [{ author: "ريم", text: "هادئ ومناسب للابتوب.", rating: 4 }],
  },
  {
    id: "mc-5",
    name: "بيت الإسبريسو — العزيزية",
    slug: "bayt-espresso",
    region: "مكة",
    city: "مكة",
    lat: 21.4047,
    lng: 39.8579,
    rating: 4.6,
    reviewCount: 890,
    hoursLabel: "٦ ص — ١٢ م",
    crowd: "medium",
    coffeeStyle: "specialty",
    productTags: ["specialty_coffee", "desserts"],
    viewTypes: ["mountain", "interior"],
    priceTier: "premium",
    tablesAvailableNow: false,
    hasPartition: true,
    hasHeater: true,
    hasScreen: false,
    activeOffers: true,
    loyaltyPointsHigh: true,
    workStudyFriendly: true,
    familyFriendly: true,
    heroImage: "/og-image.png",
    tagline: "إطلالة جبلية مع قهوة يدوية",
    address: "مكة — العزيزية",
    menuHighlights: ["إسبريسو مزدوج", "تشيز كيك ياباني"],
    tableLabels: ["بار يدوي", "طاولة جبلية"],
    promos: ["مكافأة منشورات المشاهدات"],
    loyaltySnippet: "نقاط عالية للمبدعين",
    communityPreview: [{ author: "عبدالله", excerpt: "أفضل إسبريسو في مكة…" }],
    reviews: [{ author: "نورة", text: "جودة ثابتة.", rating: 5 }],
  },
];

export function getMapCafeById(id: string): MapCafe | undefined {
  return mapCafes.find((c) => c.id === id);
}

export const mapCafeIds = mapCafes.map((c) => c.id);
