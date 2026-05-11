/** بيانات وهمية — لوحة التشغيل التنفيذية للإدارة */

export type LiveOrderRow = {
  id: string;
  customer: string;
  items: string;
  status: "جديد" | "قيد التجهيز" | "جاهز للاستلام";
  etaMin: number;
  total: number;
};

export type ReservationTimelineRow = {
  id: string;
  name: string;
  table: string;
  time: string;
  guests: number;
};

export type TableOccupancyTile = {
  id: string;
  label: string;
  state: "متاحة" | "محجوزة" | "مشغولة" | "تنظيف" | "خارج الخدمة";
};

export type MarketingPerfRow = {
  campaign: string;
  posts: number;
  views: string;
  conversion: string;
};

export type StaffOpRow = {
  name: string;
  role: string;
  state: string;
  since: string;
};

export type AlertRow = {
  id: string;
  type: "تحذير" | "تنبيه" | "فرصة";
  message: string;
  time: string;
};

export const executiveKpis = {
  salesToday: 48200,
  ordersToday: 264,
  reservationsToday: 38,
  tableOccupancyPct: 78,
  activeCustomers: 642,
  loyaltyPointsUsed: 12840,
  activeCampaigns: 6,
  staffPresent: 28,
  avgPrepMin: 11,
  topProduct: "موكا باردة",
  topTable: "١١ — رووف",
  topLoyaltyCustomer: "سارة الحربي",
  topStaff: "ريم السبيعي",
} as const;

export const liveOrdersMock: LiveOrderRow[] = [
  {
    id: "ORD-2104",
    customer: "نورة العجمي",
    items: "لاتيه بندق ×٢ · كيك الجزر",
    status: "قيد التجهيز",
    etaMin: 6,
    total: 74,
  },
  {
    id: "ORD-2103",
    customer: "فيصل الدوسري",
    items: "إسبresso مزدوج · ماء",
    status: "جديد",
    etaMin: 14,
    total: 22,
  },
  {
    id: "ORD-2102",
    customer: "دانة القحطاني",
    items: "وجبة إفطار خفيفة · شاي كرك",
    status: "جاهز للاستلام",
    etaMin: 0,
    total: 56,
  },
];

export const reservationTimelineMock: ReservationTimelineRow[] = [
  { id: "RSV-881", name: "لمى الزهراني", table: "رووف الغروب", time: "٧:٣٠ م", guests: 4 },
  { id: "RSV-882", name: "تركي الشهري", table: "جناح VIP", time: "٨:٠٠ م", guests: 6 },
  { id: "RSV-883", name: "هند العتيبي", table: "طاولة ٦", time: "٨:٤٥ م", guests: 8 },
];

export const tableOccupancyMock: TableOccupancyTile[] = [
  { id: "t1", label: "١", state: "متاحة" },
  { id: "t2", label: "٢", state: "محجوزة" },
  { id: "t3", label: "٣", state: "مشغولة" },
  { id: "t4", label: "٤", state: "محجوزة" },
  { id: "t5", label: "٥", state: "تنظيف" },
  { id: "t6", label: "٦", state: "متاحة" },
  { id: "t7", label: "٧", state: "خارج الخدمة" },
  { id: "t8", label: "رووف", state: "مشغولة" },
];

export const marketingPerfMock: MarketingPerfRow[] = [
  { campaign: "توثيق تجربة — ربيع رِواق", posts: 234, views: "١٫٨ مليون", conversion: "٩٫٢٪" },
  { campaign: "خصم الجلسة المسائية", posts: 89, views: "٤٢٠ ألف", conversion: "٦٫٨٪" },
];

export const staffOpsMock: StaffOpRow[] = [
  { name: "محمد العتيبي", role: "استقبال", state: "نشط · استلام كاشير", since: "منذ ٢ س" },
  { name: "خالد الشهري", role: "بارستا", state: "طابور الذروة", since: "منذ ٣ س" },
  { name: "نورة السبيعي", role: "استقبال", state: "قيد تسليم المناوبة", since: "منذ ٤٠ د" },
];

export const alertsMock: AlertRow[] = [
  {
    id: "a1",
    type: "تحذير",
    message: "طلب ORD-2099 متأخر ٦ دقائق عن SLA التجهيز",
    time: "الآن",
  },
  {
    id: "a2",
    type: "تنبيه",
    message: "حجز RSV-880 يبدأ خلال ٢٥ دقيقة — طاولة رووف",
    time: "منذ ٤ د",
  },
  {
    id: "a3",
    type: "تنبيه",
    message: "طاولة ٥ تحتاج تنظيف بعد انتهاء الجلسة",
    time: "منذ ١٢ د",
  },
  {
    id: "a4",
    type: "تحذير",
    message: "موظف خارج النطاق — دانة القحطاني (استراحة مطولة)",
    time: "منذ ٢٠ د",
  },
  {
    id: "a5",
    type: "فرصة",
    message: "حملة «مسوّقي رِواق» تنتهي خلال ٤٨ ساعة — راجع الميزانية",
    time: "منذ ساعة",
  },
];
