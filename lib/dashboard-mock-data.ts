/** بيانات وهمية للوحة التحكم — جاهزة للاستبدال لاحقًا بـ API */

export const dashboardStats = {
  ordersToday: 186,
  reservationsToday: 42,
  salesTotal: 12480,
  loyaltyCustomers: 892,
  topProduct: "لاتيه البندق",
  topProductUnits: 156,
} as const;

export type MockOrder = {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: "جديد" | "قيد التجهيز" | "جاهز";
  time: string;
};

export const mockRecentOrders: MockOrder[] = [
  {
    id: "ORD-1042",
    customer: "نورة العجمي",
    items: "لاتيه كبير ×٢، كرواسون",
    total: 52,
    status: "قيد التجهيز",
    time: "منذ ٤ دقائق",
  },
  {
    id: "ORD-1041",
    customer: "فيصل الدوسري",
    items: "إسبresso مزدوج",
    total: 18,
    status: "جاهز",
    time: "منذ ١٢ دقيقة",
  },
  {
    id: "ORD-1040",
    customer: "لينا الشمري",
    items: "كيك الجزر، شاي كرك",
    total: 41,
    status: "جديد",
    time: "منذ ١٨ دقيقة",
  },
  {
    id: "ORD-1039",
    customer: "خالد القحطاني",
    items: "آيس سبانيش ×٣",
    total: 63,
    status: "جاهز",
    time: "منذ ٢٥ دقيقة",
  },
];

export type MockReservation = {
  id: string;
  name: string;
  guests: number;
  table: string;
  time: string;
  status: "مؤكد" | "في الانتظار";
};

export const mockRecentReservations: MockReservation[] = [
  {
    id: "RSV-208",
    name: "عائلة الحربي",
    guests: 6,
    table: "طاولة ٥ — جناح",
    time: "٨:٠٠ م",
    status: "مؤكد",
  },
  {
    id: "RSV-207",
    name: "سارة المطيري",
    guests: 2,
    table: "طاولة ٢ — واجهة",
    time: "٧:٣٠ م",
    status: "مؤكد",
  },
  {
    id: "RSV-206",
    name: "مجموعة عمل — أرامكو",
    guests: 10,
    table: "قاعة صغيرة",
    time: "٩:٠٠ م",
    status: "في الانتظار",
  },
];
