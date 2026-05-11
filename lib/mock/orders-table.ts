export type OrderRowStatus = "جديد" | "مقبول" | "مرفوض" | "جاهز للاستلام";

export type OrderRow = {
  id: string;
  customer: string;
  products: string;
  pickupTime: string;
  status: OrderRowStatus;
  price: number;
  rejectReason?: string;
};

export const initialOrderRows: OrderRow[] = [
  {
    id: "ORD-2108",
    customer: "نورة العجمي",
    products: "لاتيه كبير ×٢، كرواسون",
    pickupTime: "٦:٢٠ م",
    status: "جديد",
    price: 52,
  },
  {
    id: "ORD-2107",
    customer: "فيصل الدوسري",
    products: "إسبresso مزدوج، ماء",
    pickupTime: "٦:٠٥ م",
    status: "مقبول",
    price: 20,
  },
  {
    id: "ORD-2106",
    customer: "لينا الشمري",
    products: "كيك الجزر، شاي كرك",
    pickupTime: "٥:٥٥ م",
    status: "جاهز للاستلام",
    price: 41,
  },
  {
    id: "ORD-2105",
    customer: "خالد القحطاني",
    products: "آيس سبانيش ×٣",
    pickupTime: "٥:٤٠ م",
    status: "مقبول",
    price: 63,
  },
];

export const rejectReasonPresets = [
  "نفاد المخزون",
  "إيقاف الطلبات مؤقتًا",
  "طلب العميل الإلغاء",
  "تعذر التجهيز في الوقت المطلوب",
] as const;
