/**
 * مركز إدارة الحجوزات — بيانات وهمية قابلة للاستبدال بـ API.
 */

export type ReservationStatus =
  | "new"
  | "pending_review"
  | "confirmed"
  | "awaiting_guest"
  | "guest_arrived"
  | "session_active"
  | "session_ended"
  | "late"
  | "cancelled"
  | "rejected";

export type ArrivalStatus = "not_arrived" | "arrived" | "late";

export type TableCategory =
  | "inside"
  | "outside"
  | "vip"
  | "individuals"
  | "meetings"
  | "family"
  | "scenic";

export type TableOperationalStatus =
  | "available"
  | "reserved"
  | "busy"
  | "cleaning"
  | "out_of_service"
  | "active_now";

export type TableServiceId =
  | "screen"
  | "pool"
  | "view"
  | "heater"
  | "partition"
  | "charger"
  | "outdoor_session"
  | "special_light";

export type TableOfferKind =
  | "booking_discount"
  | "bonus_points"
  | "free_product"
  | "photo_doc"
  | "custom";

export type TableOffer = {
  active: boolean;
  kind: TableOfferKind;
  titleAr: string;
  durationAr: string;
  termsAr: string;
};

export type ManagedTableLoyalty = {
  baseBooking: number;
  documentationBonus: number;
  publishBonus: number;
  viewsThreshold: number;
  viewsBonus: number;
};

export type QRBadge = "unused" | "scanned" | "expired";

export type LineVariant = "latte" | "cold" | "cake" | "bakery";

export type LinkedOrderLine = {
  id: string;
  name: string;
  qty: number;
  imageVariant: LineVariant;
};

export type LinkedMenuOrder = {
  lines: LinkedOrderLine[];
  prepEtaMinutes: number;
  orderWorkflowStatus: string;
  total: number;
  paymentStatus: string;
  promosSummary: string;
};

export type TimelineStep =
  | "created"
  | "reviewed"
  | "confirmed"
  | "arrived"
  | "session_started"
  | "session_ended";

export type ReservationTimelineEntry = {
  step: TimelineStep;
  labelAr: string;
  atISO?: string;
};

export type LinkedDecision =
  | "pending"
  | "accepted_rsv_only"
  | "accepted_order_only"
  | "accepted_both"
  | "rejected_order"
  | "rejected_rsv"
  | "cancelled_both";

export type ReservationLoyaltyPreview = {
  linked: boolean;
  summaryAr: string;
  estimatedPoints: number;
  documentationBonus?: number;
  publishBonus?: number;
  viewsMilestoneBonus?: number;
};

export type ReservationRecord = {
  id: string;
  customerName: string;
  initials: string;
  phone: string;
  guests: number;
  /** وقت بداية الحجز */
  startISO: string;
  sessionMinutes: number;
  status: ReservationStatus;
  arrivalStatus: ArrivalStatus;
  tableId: string;
  tableLabel: string;
  tableCategory: TableCategory;
  customerNotes?: string;
  isVip: boolean;
  priorVisits: number;
  qrStatus: QRBadge;
  linkedOrder?: LinkedMenuOrder | null;
  linkedDecision?: LinkedDecision;
  rejectReason?: string;
  suggestedAlternative?: string;
  timeline: ReservationTimelineEntry[];
  /** طلب بارتيشن للجلسة */
  partitionRequested?: boolean;
  /** خدمات إضافية طلبها العميل */
  requestedServices?: TableServiceId[];
  /** ولاء مرتبط بالحجز / الطاولة */
  loyaltyPreview?: ReservationLoyaltyPreview | null;
};

export type CafeTable = {
  id: string;
  label: string;
  capacity: number;
  category: TableCategory;
  status: TableOperationalStatus;
  nextAvailableISO?: string;
};

export type ManagedTable = CafeTable & {
  displayName: string;
  description: string;
  imagePlaceholderClass: string;
  videoPlaceholderClass: string;
  defaultBookingMinutes: number;
  minOrderSar?: number;
  hasBuiltInPartition: boolean;
  servicesAvailable: TableServiceId[];
  offer: TableOffer | null;
  loyalty: ManagedTableLoyalty;
  bookingPaused: boolean;
  /** للعرض في لوحة الطاولات */
  rating?: number;
  bookingCount?: number;
};

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  new: "جديد",
  pending_review: "بانتظار المراجعة",
  confirmed: "مؤكد",
  awaiting_guest: "بانتظار وصول العميل",
  guest_arrived: "العميل وصل",
  session_active: "الجلسة نشطة",
  session_ended: "انتهت الجلسة",
  late: "متأخر",
  cancelled: "ملغي",
  rejected: "مرفوض",
};

export const TABLE_CATEGORY_LABELS: Record<TableCategory, string> = {
  inside: "داخلية",
  outside: "خارجية",
  vip: "VIP",
  individuals: "أفراد",
  meetings: "اجتماعات",
  family: "عائلية",
  scenic: "مطلة",
};

export const TABLE_OPS_LABELS: Record<TableOperationalStatus, string> = {
  available: "متاحة",
  reserved: "محجوزة",
  busy: "مشغولة",
  cleaning: "قيد التنظيف",
  out_of_service: "خارج الخدمة",
  active_now: "نشطة الآن",
};

export const TABLE_SERVICE_LABELS: Record<TableServiceId, string> = {
  screen: "شاشة",
  pool: "مسبح",
  view: "إطلالة",
  heater: "دفاية",
  partition: "بارتيشن",
  charger: "شاحن",
  outdoor_session: "جلسة خارجية",
  special_light: "إضاءة خاصة",
};

export const OFFER_KIND_LABELS_AR: Record<TableOfferKind, string> = {
  booking_discount: "خصم على الحجز",
  bonus_points: "نقاط ولاء إضافية",
  free_product: "منتج مجاني مع الحجز",
  photo_doc: "عرض تصوير وتوثيق",
  custom: "عرض مخصص",
};

export const QR_BADGE_LABELS: Record<QRBadge, string> = {
  unused: "غير مستخدم",
  scanned: "تم المسح",
  expired: "منتهي",
};

export const ALL_TABLE_SERVICE_IDS: TableServiceId[] = [
  "screen",
  "pool",
  "view",
  "heater",
  "partition",
  "charger",
  "outdoor_session",
  "special_light",
];

export const REJECT_REASONS = [
  "لا توجد طاولات متاحة",
  "الوقت المطلوب غير متاح",
  "العدد أكبر من السعة",
  "الطاولة تحت الصيانة",
  "ضغط عالي على الحجوزات",
  "سبب آخر",
] as const;

function iso(now: Date, mins: number) {
  return new Date(now.getTime() + mins * 60_000).toISOString();
}

function tl(
  partial: Partial<Record<TimelineStep, number>>,
  base: Date,
): ReservationTimelineEntry[] {
  const steps: { step: TimelineStep; labelAr: string }[] = [
    { step: "created", labelAr: "تم إنشاء الحجز" },
    { step: "reviewed", labelAr: "تمت المراجعة" },
    { step: "confirmed", labelAr: "تم التأكيد" },
    { step: "arrived", labelAr: "العميل وصل" },
    { step: "session_started", labelAr: "بدأت الجلسة" },
    { step: "session_ended", labelAr: "انتهت الجلسة" },
  ];
  return steps.map((s) => ({
    ...s,
    atISO: partial[s.step] != null ? iso(base, partial[s.step]!) : undefined,
  }));
}

/** وقت تسجيل وصول الضيف من الخط الزمني */
export function arrivalISOFromReservation(r: ReservationRecord): string | undefined {
  return r.timeline.find((x) => x.step === "arrived")?.atISO;
}

/** نهاية الجلسة المتوقعة من لحظة الوصول + مدة الجلسة */
export function expectedSessionEndISO(r: ReservationRecord): string | undefined {
  const a = arrivalISOFromReservation(r);
  if (!a) return undefined;
  return new Date(new Date(a).getTime() + r.sessionMinutes * 60_000).toISOString();
}

export function formatDurationHMS(ms: number): string {
  if (ms < 0) ms = 0;
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => n.toLocaleString("ar-SA", { minimumIntegerDigits: 2 });
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function seatingElapsedMs(r: ReservationRecord, now: number): number | null {
  if (!["guest_arrived", "session_active"].includes(r.status)) return null;
  const a = arrivalISOFromReservation(r);
  if (!a) return null;
  return now - new Date(a).getTime();
}

export function isSessionOverrun(r: ReservationRecord, now: number): boolean {
  const end = expectedSessionEndISO(r);
  if (!end) return false;
  if (!["guest_arrived", "session_active"].includes(r.status)) return false;
  return now > new Date(end).getTime();
}

export function seedManagedTables(now: Date): ManagedTable[] {
  const rows: ManagedTable[] = [
    {
      id: "t1",
      label: "١",
      displayName: "طاولة نافذة — زاوية هادئة",
      capacity: 2,
      category: "individuals",
      status: "available",
      nextAvailableISO: iso(now, 12),
      description: "مناسبة لجلسات عمل قصيرة أو قهوة صباحية بإضاءة طبيعية.",
      imagePlaceholderClass: "bg-linear-to-br from-amber-100 via-white to-riwaq-beige",
      videoPlaceholderClass: "bg-linear-to-tl from-sky-200/40 via-white to-riwaq-cream",
      defaultBookingMinutes: 75,
      minOrderSar: undefined,
      hasBuiltInPartition: false,
      servicesAvailable: ["charger", "special_light"],
      offer: {
        active: true,
        kind: "bonus_points",
        titleAr: "+٢٠ نقطة ولاء عند الحجز المسبق",
        durationAr: "حتى نهاية مايو ٢٠٢٦",
        termsAr: "يشترط إتمام الزيارة وتقييم التجربة.",
      },
      loyalty: {
        baseBooking: 25,
        documentationBonus: 40,
        publishBonus: 70,
        viewsThreshold: 800,
        viewsBonus: 90,
      },
      bookingPaused: false,
    },
    {
      id: "t2",
      label: "٢",
      displayName: "طاولة وسط الصالة",
      capacity: 4,
      category: "inside",
      status: "reserved",
      nextAvailableISO: iso(now, 55),
      description: "قريبة من البار، مريحة للعائلات الصغيرة.",
      imagePlaceholderClass: "bg-linear-to-br from-riwaq-beige via-white to-orange-100/50",
      videoPlaceholderClass: "bg-linear-to-bl from-riwaq-brown/10 via-white to-riwaq-cream",
      defaultBookingMinutes: 90,
      minOrderSar: 60,
      hasBuiltInPartition: false,
      servicesAvailable: ["partition", "charger", "heater"],
      offer: {
        active: true,
        kind: "booking_discount",
        titleAr: "خصم ١٥٪ على رسوم الحجز مساء الجمعة",
        durationAr: "٤ أسابيع",
        termsAr: "للحجوزات قبل ٤ مساءً على الأقل.",
      },
      loyalty: { baseBooking: 35, documentationBonus: 50, publishBonus: 80, viewsThreshold: 1000, viewsBonus: 110 },
      bookingPaused: false,
    },
    {
      id: "t3",
      label: "٣",
      displayName: "جلسة باحة داخلية",
      capacity: 4,
      category: "outside",
      status: "active_now",
      description: "جلوس مفتوح مع دفايات ومظلات قماشية أنيقة.",
      imagePlaceholderClass: "bg-linear-to-br from-emerald-100/80 via-white to-riwaq-beige",
      videoPlaceholderClass: "bg-linear-to-tr from-lime-200/30 via-white to-sky-100/40",
      defaultBookingMinutes: 90,
      minOrderSar: undefined,
      hasBuiltInPartition: false,
      servicesAvailable: ["heater", "outdoor_session", "view", "charger"],
      offer: null,
      loyalty: { baseBooking: 40, documentationBonus: 55, publishBonus: 85, viewsThreshold: 1200, viewsBonus: 130 },
      bookingPaused: false,
    },
    {
      id: "t4",
      label: "٤ — جناح",
      displayName: "جناح VIP خاص",
      capacity: 6,
      category: "vip",
      status: "reserved",
      nextAvailableISO: iso(now, 90),
      description: "خلوة فاخرة مع إضاءة خافتة وخدمة أولوية.",
      imagePlaceholderClass: "bg-linear-to-br from-riwaq-brown/25 via-riwaq-caramel/20 to-white",
      videoPlaceholderClass: "bg-linear-to-bl from-violet-200/40 via-white to-amber-50",
      defaultBookingMinutes: 120,
      minOrderSar: 200,
      hasBuiltInPartition: true,
      servicesAvailable: ["partition", "special_light", "charger", "screen"],
      offer: {
        active: true,
        kind: "free_product",
        titleAr: "صحن تمريّة مجاني مع الحجوزات أعلى من ٦ أشخاص",
        durationAr: "مستمر",
        termsAr: "يُقدَّم عند بداية الجلسة.",
      },
      loyalty: { baseBooking: 80, documentationBonus: 120, publishBonus: 200, viewsThreshold: 2500, viewsBonus: 260 },
      bookingPaused: false,
    },
    {
      id: "t5",
      label: "٥",
      displayName: "طاولة حديقة صغيرة",
      capacity: 2,
      category: "outside",
      status: "cleaning",
      nextAvailableISO: iso(now, 25),
      description: "مثالية للقراءة أو جلسة ثنائية هادئة.",
      imagePlaceholderClass: "bg-linear-to-br from-green-100/70 via-white to-riwaq-beige",
      videoPlaceholderClass: "bg-linear-to-t from-teal-100/50 to-white",
      defaultBookingMinutes: 60,
      minOrderSar: undefined,
      hasBuiltInPartition: false,
      servicesAvailable: ["view", "heater", "pool"],
      offer: {
        active: false,
        kind: "custom",
        titleAr: "بدون عرض حالي",
        durationAr: "—",
        termsAr: "يمكن تفعيل عرض موسمي من الإعدادات.",
      },
      loyalty: { baseBooking: 30, documentationBonus: 45, publishBonus: 70, viewsThreshold: 900, viewsBonus: 95 },
      bookingPaused: false,
    },
    {
      id: "t6",
      label: "٦",
      displayName: "غرفة اجتماعات زجاجية",
      capacity: 8,
      category: "meetings",
      status: "available",
      nextAvailableISO: iso(now, 10),
      description: "شاشة عرض، مقابس كثيرة، وصوت معزول عن الصالة.",
      imagePlaceholderClass: "bg-linear-to-br from-slate-200/60 via-white to-riwaq-beige",
      videoPlaceholderClass: "bg-linear-to-bl from-blue-200/40 via-white to-zinc-100",
      defaultBookingMinutes: 120,
      minOrderSar: 150,
      hasBuiltInPartition: true,
      servicesAvailable: ["screen", "charger", "special_light", "partition"],
      offer: {
        active: true,
        kind: "photo_doc",
        titleAr: "٥٠ نقطة إضافية عند توثيق اجتماعك على وسائل التواصل",
        durationAr: "حملة ربيع رِواق",
        termsAr: "ذكر اسم الفرع وهاشتاق الحملة الرسمي.",
      },
      loyalty: { baseBooking: 55, documentationBonus: 90, publishBonus: 140, viewsThreshold: 2000, viewsBonus: 180 },
      bookingPaused: false,
    },
    {
      id: "t7",
      label: "٧",
      displayName: "طاولة عائلية كبيرة",
      capacity: 4,
      category: "family",
      status: "out_of_service",
      description: "خارج الخدمة مؤقتًا لصيانة الأرضية.",
      imagePlaceholderClass: "bg-linear-to-br from-orange-100/60 via-white to-riwaq-beige",
      videoPlaceholderClass: "bg-linear-to-tr from-stone-200/50 to-white",
      defaultBookingMinutes: 90,
      minOrderSar: 80,
      hasBuiltInPartition: false,
      servicesAvailable: ["charger", "partition", "special_light"],
      offer: null,
      loyalty: { baseBooking: 45, documentationBonus: 60, publishBonus: 95, viewsThreshold: 1100, viewsBonus: 120 },
      bookingPaused: true,
    },
    {
      id: "t8",
      label: "٨",
      displayName: "كيان فردي — بار طويل",
      capacity: 3,
      category: "individuals",
      status: "available",
      nextAvailableISO: iso(now, 0),
      description: "جلوس عالي قرب الباريستا لتجربة عمل القهوة عن قرب.",
      imagePlaceholderClass: "bg-linear-to-br from-zinc-100 via-white to-amber-50",
      videoPlaceholderClass: "bg-linear-to-bl from-amber-200/40 to-white",
      defaultBookingMinutes: 45,
      minOrderSar: undefined,
      hasBuiltInPartition: false,
      servicesAvailable: ["charger"],
      offer: null,
      loyalty: { baseBooking: 20, documentationBonus: 35, publishBonus: 55, viewsThreshold: 700, viewsBonus: 75 },
      bookingPaused: false,
    },
    {
      id: "t9",
      label: "٩",
      displayName: "طاولة وسط — مشغولة",
      capacity: 5,
      category: "inside",
      status: "busy",
      nextAvailableISO: iso(now, 40),
      description: "مكتظة حاليًا بضيوف من حجز سابق؛ ستتحرر تلقائيًا في الواجهة الحقيقية.",
      imagePlaceholderClass: "bg-linear-to-br from-rose-100/70 via-white to-riwaq-beige",
      videoPlaceholderClass: "bg-linear-to-t from-orange-100/40 to-white",
      defaultBookingMinutes: 75,
      minOrderSar: 50,
      hasBuiltInPartition: false,
      servicesAvailable: ["heater", "charger", "partition"],
      offer: {
        active: true,
        kind: "bonus_points",
        titleAr: "ضِعف النقاط عند الحجز قبل ٣ أيام",
        durationAr: "١٠ أيام",
        termsAr: "يشترط الحضور في الموعد.",
      },
      loyalty: { baseBooking: 38, documentationBonus: 52, publishBonus: 88, viewsThreshold: 950, viewsBonus: 105 },
      bookingPaused: false,
    },
    {
      id: "t10",
      label: "١٠",
      displayName: "جناح ذهبي صغير",
      capacity: 2,
      category: "vip",
      status: "available",
      nextAvailableISO: iso(now, 15),
      description: "مساحة أنيقة لمناسبات خاصة صغيرة.",
      imagePlaceholderClass: "bg-linear-to-br from-yellow-100/80 via-white to-riwaq-caramel/15",
      videoPlaceholderClass: "bg-linear-to-bl from-fuchsia-100/30 to-white",
      defaultBookingMinutes: 60,
      minOrderSar: 120,
      hasBuiltInPartition: true,
      servicesAvailable: ["partition", "special_light", "charger"],
      offer: {
        active: true,
        kind: "custom",
        titleAr: "باقة تصوير احترافي مع الحجز (تنسيق داخلي)",
        durationAr: " أيام الجمعة فقط",
        termsAr: "بحسب توفر المصوّر المعتمد.",
      },
      loyalty: { baseBooking: 70, documentationBonus: 110, publishBonus: 170, viewsThreshold: 2200, viewsBonus: 220 },
      bookingPaused: false,
    },
    {
      id: "t11",
      label: "١١ — رووف",
      displayName: "رووف مطلّ على أفق المدينة",
      capacity: 6,
      category: "scenic",
      status: "active_now",
      description: "أفضل غروب في الفرع؛ جلسة خارجية مرتفعة.",
      imagePlaceholderClass: "bg-linear-to-br from-sky-300/50 via-white to-indigo-100/60",
      videoPlaceholderClass: "bg-linear-to-t from-orange-200/60 via-violet-200/30 to-sky-100",
      defaultBookingMinutes: 105,
      minOrderSar: 90,
      hasBuiltInPartition: false,
      servicesAvailable: ["view", "heater", "outdoor_session", "charger", "special_light"],
      offer: {
        active: true,
        kind: "photo_doc",
        titleAr: "١٠٠ نقطة عند نشر الرووف مع هاشتاق رِواق وتجاوز ١٠٠٠ مشاهدة",
        durationAr: "موسم الربيع",
        termsAr: "تطبيق الشروط على المنشور المعتمد من الإدارة.",
      },
      loyalty: { baseBooking: 60, documentationBonus: 100, publishBonus: 160, viewsThreshold: 1000, viewsBonus: 220 },
      bookingPaused: false,
    },
    {
      id: "t12",
      label: "١٢",
      displayName: "استوديو اجتماعات مرن",
      capacity: 4,
      category: "meetings",
      status: "reserved",
      nextAvailableISO: iso(now, 120),
      description: "طاولة قابلة لإعادة الترتيب للورش والعروض السريعة.",
      imagePlaceholderClass: "bg-linear-to-br from-cyan-100/60 via-white to-slate-100",
      videoPlaceholderClass: "bg-linear-to-bl from-neutral-200/50 to-white",
      defaultBookingMinutes: 90,
      minOrderSar: 100,
      hasBuiltInPartition: true,
      servicesAvailable: ["screen", "partition", "charger"],
      offer: null,
      loyalty: { baseBooking: 50, documentationBonus: 75, publishBonus: 115, viewsThreshold: 1500, viewsBonus: 140 },
      bookingPaused: false,
    },
  ];
  return rows.map((t, i) => ({
    ...t,
    rating: Number((4.2 + (i % 6) * 0.11).toFixed(1)),
    bookingCount: 72 + i * 41,
  }));
}

/** متوافق مع الكود السابق — يعيد طاولات إدارة كاملة */
export function seedTables(now: Date): ManagedTable[] {
  return seedManagedTables(now);
}

export function seedReservations(now: Date): ReservationRecord[] {
  return [
    {
      id: "RSV-5201",
      customerName: "نورة العجمي",
      initials: "نع",
      phone: "+966551023344",
      guests: 4,
      startISO: iso(now, 35),
      sessionMinutes: 90,
      status: "confirmed",
      arrivalStatus: "not_arrived",
      tableId: "t2",
      tableLabel: "٢",
      tableCategory: "inside",
      customerNotes: "ذكرى خطوبة — يفضلون إضاءة هادئة.",
      isVip: true,
      priorVisits: 14,
      qrStatus: "unused",
      partitionRequested: false,
      requestedServices: ["heater"],
      loyaltyPreview: {
        linked: true,
        summaryAr: "طاولة مرتبطة بعرض نقاط مضاعفة عند إتمام الحجز",
        estimatedPoints: 120,
        documentationBonus: 50,
        publishBonus: 80,
        viewsMilestoneBonus: 110,
      },
      linkedOrder: {
        lines: [
          { id: "x1", name: "موكا باردة", qty: 2, imageVariant: "cold" },
          { id: "x2", name: "كيك الجزر", qty: 1, imageVariant: "cake" },
        ],
        prepEtaMinutes: 12,
        orderWorkflowStatus: "قيد التجهيز",
        total: 78,
        paymentStatus: "مدفوع",
        promosSummary: "خصم ولاء ١٠٪",
      },
      timeline: tl({ created: -120, reviewed: -115, confirmed: -110 }, now),
    },
    {
      id: "RSV-5202",
      customerName: "فيصل الدوسري",
      initials: "فد",
      phone: "+966508871209",
      guests: 2,
      startISO: iso(now, -20),
      sessionMinutes: 75,
      status: "session_active",
      arrivalStatus: "arrived",
      tableId: "t3",
      tableLabel: "٣",
      tableCategory: "outside",
      customerNotes: "",
      isVip: false,
      priorVisits: 3,
      qrStatus: "scanned",
      partitionRequested: false,
      requestedServices: ["view", "heater"],
      loyaltyPreview: {
        linked: true,
        summaryAr: "نقاط أساسية للحجز + مكافأة توثيق إن نشر تجربة الجلسة الخارجية",
        estimatedPoints: 95,
        documentationBonus: 55,
      },
      linkedOrder: null,
      timeline: tl({ created: -200, reviewed: -190, confirmed: -185, arrived: -25, session_started: -20 }, now),
    },
    {
      id: "RSV-5203",
      customerName: "لينا الشمري",
      initials: "لس",
      phone: "+966542210098",
      guests: 6,
      startISO: iso(now, 18),
      sessionMinutes: 120,
      status: "pending_review",
      arrivalStatus: "not_arrived",
      tableId: "t6",
      tableLabel: "٦",
      tableCategory: "meetings",
      customerNotes: "عرض تقديمي — يحتاجون شاشة (إن وجدت).",
      isVip: false,
      priorVisits: 1,
      qrStatus: "unused",
      partitionRequested: false,
      requestedServices: ["screen"],
      loyaltyPreview: null,
      timeline: tl({ created: -30 }, now),
    },
    {
      id: "RSV-5204",
      customerName: "خالد القحطاني",
      initials: "خق",
      phone: "+966564007781",
      guests: 3,
      startISO: iso(now, -95),
      sessionMinutes: 60,
      status: "session_ended",
      arrivalStatus: "arrived",
      tableId: "t8",
      tableLabel: "٨",
      tableCategory: "individuals",
      isVip: false,
      priorVisits: 9,
      qrStatus: "expired",
      partitionRequested: false,
      requestedServices: [],
      loyaltyPreview: {
        linked: true,
        summaryAr: "تم احتساب نقاط الحجز في ولاء رِواق",
        estimatedPoints: 45,
      },
      linkedOrder: {
        lines: [{ id: "x3", name: "لاتيه بندق ×٢", qty: 2, imageVariant: "latte" }],
        prepEtaMinutes: 8,
        orderWorkflowStatus: "تم التسليم",
        total: 44,
        paymentStatus: "مدفوع",
        promosSummary: "١+١ على الحلويات",
      },
      timeline: tl(
        { created: -300, reviewed: -295, confirmed: -290, arrived: -120, session_started: -115, session_ended: -35 },
        now,
      ),
    },
    {
      id: "RSV-5205",
      customerName: "دانة المطيري",
      initials: "دم",
      phone: "+966559901122",
      guests: 4,
      startISO: iso(now, -8),
      sessionMinutes: 90,
      status: "late",
      arrivalStatus: "late",
      tableId: "t9",
      tableLabel: "٩",
      tableCategory: "inside",
      customerNotes: "طفل كرسي عالي إن توفر.",
      isVip: true,
      priorVisits: 22,
      qrStatus: "unused",
      partitionRequested: true,
      requestedServices: ["partition"],
      loyaltyPreview: {
        linked: true,
        summaryAr: "استحقاق نقاط VIP إضافية بعد تأكيد الحضور",
        estimatedPoints: 140,
      },
      timeline: tl({ created: -180, reviewed: -175, confirmed: -170 }, now),
    },
    {
      id: "RSV-5206",
      customerName: "سعود الغامدي",
      initials: "سغ",
      phone: "+966501447788",
      guests: 2,
      startISO: iso(now, 52),
      sessionMinutes: 60,
      status: "new",
      arrivalStatus: "not_arrived",
      tableId: "t10",
      tableLabel: "١٠",
      tableCategory: "vip",
      customerNotes: "",
      isVip: true,
      priorVisits: 7,
      qrStatus: "unused",
      partitionRequested: false,
      requestedServices: ["special_light"],
      loyaltyPreview: {
        linked: true,
        summaryAr: "عرض جناح ذهبي — نقاط ولاء مرتفعة عند التوثيق",
        estimatedPoints: 160,
        documentationBonus: 110,
      },
      timeline: tl({ created: -10 }, now),
    },
    {
      id: "RSV-5207",
      customerName: "هند العتيبي",
      initials: "هع",
      phone: "+966554332211",
      guests: 5,
      startISO: iso(now, 70),
      sessionMinutes: 75,
      status: "awaiting_guest",
      arrivalStatus: "not_arrived",
      tableId: "t4",
      tableLabel: "٤ — جناح",
      tableCategory: "vip",
      customerNotes: "حساسية من المكسرات.",
      isVip: false,
      priorVisits: 2,
      qrStatus: "unused",
      partitionRequested: false,
      requestedServices: [],
      loyaltyPreview: {
        linked: true,
        summaryAr: "ربط تلقائي مع نقاط الحجز في جناح VIP ومزايا العرض المجاني",
        estimatedPoints: 210,
        publishBonus: 200,
        viewsMilestoneBonus: 260,
      },
      linkedOrder: {
        lines: [
          { id: "x4", name: "شاي كرك", qty: 3, imageVariant: "latte" },
          { id: "x5", name: "معمول", qty: 6, imageVariant: "bakery" },
        ],
        prepEtaMinutes: 15,
        orderWorkflowStatus: "بانتظار القبول",
        total: 62,
        paymentStatus: "بانتظار الدفع",
        promosSummary: "—",
      },
      timeline: tl({ created: -95, reviewed: -90, confirmed: -88 }, now),
    },
    {
      id: "RSV-5208",
      customerName: "تركي الشهري",
      initials: "تش",
      phone: "+966507889900",
      guests: 8,
      startISO: iso(now, -240),
      sessionMinutes: 100,
      status: "cancelled",
      arrivalStatus: "not_arrived",
      tableId: "t12",
      tableLabel: "١٢",
      tableCategory: "meetings",
      customerNotes: "ملغى من العميل.",
      isVip: false,
      priorVisits: 0,
      qrStatus: "expired",
      rejectReason: "إلغاء من العميل",
      loyaltyPreview: null,
      timeline: tl({ created: -400, reviewed: -395 }, now),
    },
    {
      id: "RSV-5209",
      customerName: "لمى الزهراني",
      initials: "لز",
      phone: "+966558887766",
      guests: 2,
      startISO: iso(now, 12),
      sessionMinutes: 45,
      status: "guest_arrived",
      arrivalStatus: "arrived",
      tableId: "t11",
      tableLabel: "١١ — رووف",
      tableCategory: "scenic",
      customerNotes: "يريدون طاولة بإطلالة للتصوير.",
      isVip: false,
      priorVisits: 5,
      qrStatus: "scanned",
      partitionRequested: true,
      requestedServices: ["view", "partition", "heater"],
      loyaltyPreview: {
        linked: true,
        summaryAr: "هذه الطاولة تمنح ٦٠ نقطة أساسية + ١٠٠ عند توثيق التجربة + ٢٢٠ إذا تجاوز المنشور ١٠٠٠ مشاهدة",
        estimatedPoints: 60,
        documentationBonus: 100,
        viewsMilestoneBonus: 220,
      },
      timeline: tl({ created: -60, reviewed: -55, confirmed: -50, arrived: -5 }, now),
    },
  ];
}

export type InsightsBundle = {
  repeatGuests: { name: string; visits: number }[];
  topTables: { label: string; count: number }[];
  peakHours: string;
};

export function buildInsights(reservations: ReservationRecord[]): InsightsBundle {
  const repeatGuests = [...reservations]
    .sort((a, b) => b.priorVisits - a.priorVisits)
    .slice(0, 4)
    .map((r) => ({ name: r.customerName, visits: r.priorVisits }));
  const map = new Map<string, number>();
  reservations.forEach((r) => {
    map.set(r.tableLabel, (map.get(r.tableLabel) ?? 0) + 1);
  });
  const topTables = [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, count]) => ({ label, count }));
  return {
    repeatGuests,
    topTables,
    peakHours: "٤:٠٠ — ٧:٠٠ م (أعلى إشغال هذا الأسبوع)",
  };
}
