/** تقارير وهمية — بطاقات ومؤشرات */

export type ReportTab =
  | "sales"
  | "products"
  | "reservations"
  | "tables"
  | "loyalty"
  | "campaigns"
  | "employees"
  | "customers";

export const reportTabs: { id: ReportTab; label: string }[] = [
  { id: "sales", label: "المبيعات" },
  { id: "products", label: "المنتجات" },
  { id: "reservations", label: "الحجوزات" },
  { id: "tables", label: "الطاولات" },
  { id: "loyalty", label: "الولاء" },
  { id: "campaigns", label: "الحملات" },
  { id: "employees", label: "الموظفون" },
  { id: "customers", label: "العملاء" },
];

export const reportKpis = {
  revenue: 482000,
  aov: 42,
  peakHour: "٥:٠٠ — ٨:٠٠ م",
  topSkus: ["موكا باردة", "لاتيه بندق", "شاي كرك"],
  topTables: ["١١ — رووف", "جناح VIP", "طاولة ٦"],
  orderAcceptRate: 96,
  reservationRejectRate: 4,
  avgPrepMin: 11,
  campaignRoi: "٤٫٢×",
  topCustomersValue: ["سارة الحربي", "لمى الزهراني", "نورة العجمي"],
} as const;
