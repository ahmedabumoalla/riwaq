/**
 * بيانات مركز عمليات الطلبات — جاهزة للاستبدال بـ API لاحقًا.
 * استخدم دالة المصنع مع تاريخ مرجعي واحد عند التهيئة على العميل.
 */

export type PaymentMethod = "نقدي" | "بطاقة" | "Apple Pay" | "مدى";

export type PaymentStatus = "مدفوع" | "بانتظار الدفع" | "مسترجع";

export type PromoKindLine = "خصم" | "واحد وواحد مجانًا" | "منتج مجاني" | "عرض مخصص";

export type LineImageVariant = "latte" | "cold" | "cake" | "bakery";

export type OrderLineItem = {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  calories: number;
  ingredients: string[];
  customerNotes?: string;
  promo?: {
    kind: PromoKindLine;
    discountSar?: number;
    discountPercent?: number;
    label?: string;
  };
  imageVariant: LineImageVariant;
};

export type TableBookingStatus = "pending_staff" | "accepted" | "rejected";

export type TableBooking = {
  tableNumber: string;
  guests: number;
  reservationStartISO: string;
  sessionMinutes: number;
  status: TableBookingStatus;
  customerNotes?: string;
  rejectReason?: string;
  suggestedAlternativeTime?: string;
};

export type OrderWorkflowStatus =
  | "new"
  | "pending_review"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivered"
  | "rejected"
  | "cancelled";

export type TimelineStepId =
  | "created"
  | "reviewed"
  | "accepted"
  | "preparing"
  | "ready"
  | "delivered";

export type TimelineEntry = {
  step: TimelineStepId;
  labelAr: string;
  atISO?: string;
};

export type OpsOrder = {
  id: string;
  customerName: string;
  customerPhone: string;
  initials: string;
  createdAtISO: string;
  pickupRequestedISO: string;
  estimatedPrepMinutes: number;
  orderStatus: OrderWorkflowStatus;
  lines: OrderLineItem[];
  subtotalBeforeDiscount: number;
  discountTotal: number;
  taxAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  tableBooking?: TableBooking | null;
  rejectReasonOrder?: string;
  rejectReasonTable?: string;
  cancelBothReason?: string;
  staffNotes?: string;
  timeline: TimelineEntry[];
};

export function offsetISO(now: Date, minutes: number): string {
  return new Date(now.getTime() + minutes * 60_000).toISOString();
}

function tl(now: Date, partial: Partial<Record<TimelineStepId, number>>): TimelineEntry[] {
  const steps: { step: TimelineStepId; labelAr: string }[] = [
    { step: "created", labelAr: "تم إنشاء الطلب" },
    { step: "reviewed", labelAr: "تمت المراجعة" },
    { step: "accepted", labelAr: "تم قبول الطلب" },
    { step: "preparing", labelAr: "بدأ التجهيز" },
    { step: "ready", labelAr: "جاهز للاستلام" },
    { step: "delivered", labelAr: "تم التسليم" },
  ];
  return steps.map((s) => ({
    ...s,
    atISO:
      partial[s.step] != null ? offsetISO(now, partial[s.step]!) : undefined,
  }));
}

/** إنشاء دفعة طلبات واقعية حول وقت التشغيل */
export function createOrdersOperationsSeed(now: Date): OpsOrder[] {
  const base = now.getTime();

  const o1: OpsOrder = {
    id: "ORD-9101",
    customerName: "نورة العجمي",
    customerPhone: "+966551023344",
    initials: "نع",
    createdAtISO: new Date(base - 8 * 60_000).toISOString(),
    pickupRequestedISO: offsetISO(now, 18),
    estimatedPrepMinutes: 14,
    orderStatus: "new",
    paymentMethod: "بطاقة",
    paymentStatus: "مدفوع",
    subtotalBeforeDiscount: 68,
    discountTotal: 0,
    taxAmount: 10,
    total: 78,
    tableBooking: null,
    staffNotes: "",
    timeline: tl(now, { created: -8 }),
    lines: [
      {
        id: "l1",
        name: "لاتيه البندق — كبير",
        qty: 2,
        unitPrice: 22,
        calories: 210,
        ingredients: ["إسبريسو", "حليب كامل", "سيروب بندق"],
        customerNotes: "حليب قليل الرغوة، بدون سكر إضافي",
        imageVariant: "latte",
      },
      {
        id: "l2",
        name: "كرواسون زبد",
        qty: 1,
        unitPrice: 14,
        calories: 320,
        ingredients: ["زبد فرنسي", "دقيق"],
        imageVariant: "bakery",
      },
    ],
  };

  const o2: OpsOrder = {
    id: "ORD-9102",
    customerName: "فيصل الدوسري",
    customerPhone: "+966508871209",
    initials: "فد",
    createdAtISO: new Date(base - 62 * 60_000).toISOString(),
    pickupRequestedISO: offsetISO(now, -25),
    estimatedPrepMinutes: 12,
    orderStatus: "preparing",
    paymentMethod: "مدى",
    paymentStatus: "مدفوع",
    subtotalBeforeDiscount: 92,
    discountTotal: 18,
    taxAmount: 11,
    total: 85,
    tableBooking: null,
    staffNotes: "العميل يفضل كيس ورقي للطريق.",
    timeline: tl(now, { created: -62, reviewed: -55, accepted: -50, preparing: -40 }),
    lines: [
      {
        id: "l3",
        name: "موكا باردة",
        qty: 2,
        unitPrice: 26,
        calories: 290,
        ingredients: ["إسبريسو", "شوكولاتة", "حليب", "ثلج"],
        customerNotes: "ثلج قليل، بدون كريمة",
        promo: { kind: "خصم", discountPercent: 20, label: "خصم ولاء ٢٠٪" },
        imageVariant: "cold",
      },
      {
        id: "l4",
        name: "دونات بالشوكولاتة",
        qty: 1,
        unitPrice: 16,
        calories: 340,
        ingredients: ["عجينة", "شوكولاتة"],
        imageVariant: "cake",
      },
    ],
  };

  const o3: OpsOrder = {
    id: "ORD-9103",
    customerName: "لينا الشمري",
    customerPhone: "+966542210098",
    initials: "لس",
    createdAtISO: new Date(base - 35 * 60_000).toISOString(),
    pickupRequestedISO: offsetISO(now, 40),
    estimatedPrepMinutes: 18,
    orderStatus: "accepted",
    paymentMethod: "Apple Pay",
    paymentStatus: "مدفوع",
    subtotalBeforeDiscount: 124,
    discountTotal: 24,
    taxAmount: 15,
    total: 115,
    staffNotes: "",
    timeline: tl(now, { created: -35, reviewed: -30, accepted: -28 }),
    tableBooking: {
      tableNumber: "٧ — جناح الواجهة",
      guests: 4,
      reservationStartISO: offsetISO(now, 35),
      sessionMinutes: 120,
      status: "pending_staff",
      customerNotes: "مناسبة صغيرة، يفضّلون طاولة هادئة بعيدًا عن المكبر.",
    },
    lines: [
      {
        id: "l5",
        name: "آيس سبانيش × — توأم",
        qty: 2,
        unitPrice: 26,
        calories: 280,
        ingredients: ["إسبريسو", "حليب مكثّف", "ثلج"],
        promo: {
          kind: "واحد وواحد مجانًا",
          discountSar: 26,
          label: "١ + ١ على السبانيش",
        },
        imageVariant: "cold",
      },
      {
        id: "l6",
        name: "سلطة جرانولا يونانية",
        qty: 1,
        unitPrice: 32,
        calories: 280,
        ingredients: ["زبادي يوناني", "جرانولا", "عسل"],
        customerNotes: "بدون عسل — بديل سيروف قيقب",
        imageVariant: "cake",
      },
    ],
  };

  const o4: OpsOrder = {
    id: "ORD-9104",
    customerName: "خالد القحطاني",
    customerPhone: "+966564007781",
    initials: "خق",
    createdAtISO: new Date(base - 120 * 60_000).toISOString(),
    pickupRequestedISO: offsetISO(now, -8),
    estimatedPrepMinutes: 15,
    orderStatus: "pending_review",
    paymentMethod: "نقدي",
    paymentStatus: "بانتظار الدفع",
    subtotalBeforeDiscount: 48,
    discountTotal: 0,
    taxAmount: 7,
    total: 55,
    staffNotes: "",
    timeline: tl(now, { created: -120 }),
    tableBooking: {
      tableNumber: "١٢",
      guests: 6,
      reservationStartISO: offsetISO(now, 15),
      sessionMinutes: 90,
      status: "accepted",
      customerNotes: "ذكرى زواج — لوحة ترحيب بسيطة إن أمكن.",
    },
    lines: [
      {
        id: "l7",
        name: "قهوة تركية تقليدية — إبريق",
        qty: 2,
        unitPrice: 18,
        calories: 45,
        ingredients: ["قهوة ناعمة", "هيل", "سكر"],
        customerNotes: "إبريق واحد بدون سكر والآخر عادي",
        imageVariant: "latte",
      },
      {
        id: "l8",
        name: "تمر مجهّز بالمكسرات",
        qty: 1,
        unitPrice: 12,
        calories: 180,
        ingredients: ["تمر خلاص", "لوز"],
        promo: {
          kind: "منتج مجاني",
          discountSar: 12,
          label: "مع الطلب — ضيافة",
        },
        imageVariant: "bakery",
      },
    ],
  };

  const o5: OpsOrder = {
    id: "ORD-9105",
    customerName: "دانة المطيري",
    customerPhone: "+966559901122",
    initials: "دم",
    createdAtISO: new Date(base - 95 * 60_000).toISOString(),
    pickupRequestedISO: offsetISO(now, -50),
    estimatedPrepMinutes: 10,
    orderStatus: "ready",
    paymentMethod: "بطاقة",
    paymentStatus: "مدفوع",
    subtotalBeforeDiscount: 36,
    discountTotal: 6,
    taxAmount: 4,
    total: 34,
    tableBooking: null,
    timeline: tl(now, {
      created: -95,
      reviewed: -90,
      accepted: -88,
      preparing: -75,
      ready: -50,
    }),
    lines: [
      {
        id: "l9",
        name: "كابتشينو كلاسيك",
        qty: 2,
        unitPrice: 18,
        calories: 160,
        ingredients: ["إسبريسو", "حليب"],
        promo: { kind: "عرض مخصص", label: "خصم صندوق الغداء — ٦ ر.س", discountSar: 6 },
        imageVariant: "latte",
      },
    ],
  };

  const o6: OpsOrder = {
    id: "ORD-9106",
    customerName: "سعود الغامدي",
    customerPhone: "+966501447788",
    initials: "سغ",
    createdAtISO: new Date(base - 200 * 60_000).toISOString(),
    pickupRequestedISO: offsetISO(now, -180),
    estimatedPrepMinutes: 12,
    orderStatus: "rejected",
    paymentMethod: "مدى",
    paymentStatus: "مسترجع",
    subtotalBeforeDiscount: 54,
    discountTotal: 0,
    taxAmount: 0,
    total: 0,
    rejectReasonOrder: "الكمية المطلوبة غير متاحة",
    timeline: tl(now, { created: -200, reviewed: -195 }),
    lines: [
      {
        id: "l10",
        name: "موكا بيضاء — كبير ×٣",
        qty: 3,
        unitPrice: 27,
        calories: 300,
        ingredients: ["إسبريسو", "شوكولاتة بيضاء", "حليب"],
        imageVariant: "latte",
      },
    ],
  };

  const o7: OpsOrder = {
    id: "ORD-9107",
    customerName: "هند العتيبي",
    customerPhone: "+966554332211",
    initials: "هع",
    createdAtISO: new Date(base - 15 * 60_000).toISOString(),
    pickupRequestedISO: offsetISO(now, 22),
    estimatedPrepMinutes: 16,
    orderStatus: "new",
    paymentMethod: "Apple Pay",
    paymentStatus: "بانتظار الدفع",
    subtotalBeforeDiscount: 44,
    discountTotal: 8,
    taxAmount: 5,
    total: 41,
    tableBooking: null,
    timeline: tl(now, { created: -15 }),
    lines: [
      {
        id: "l11",
        name: "شاي كرك بالزعفران",
        qty: 2,
        unitPrice: 14,
        calories: 130,
        ingredients: ["شاي أسود", "حليب", "زعفران"],
        customerNotes: "حليب شوفان، زعفران خفيف",
        imageVariant: "latte",
      },
      {
        id: "l12",
        name: "معمول تمر",
        qty: 4,
        unitPrice: 4,
        calories: 120,
        ingredients: ["تمر", "سمن"],
        promo: { kind: "خصم", discountSar: 8, label: "عرض ٤ قطع" },
        imageVariant: "bakery",
      },
    ],
  };

  const o8: OpsOrder = {
    id: "ORD-9108",
    customerName: "تركي الشهري",
    customerPhone: "+966507889900",
    initials: "تش",
    createdAtISO: new Date(base - 48 * 60_000).toISOString(),
    pickupRequestedISO: offsetISO(now, -12),
    estimatedPrepMinutes: 20,
    orderStatus: "accepted",
    paymentMethod: "نقدي",
    paymentStatus: "مدفوع",
    subtotalBeforeDiscount: 88,
    discountTotal: 22,
    taxAmount: 10,
    total: 76,
    timeline: tl(now, { created: -48, reviewed: -45, accepted: -42 }),
    tableBooking: {
      tableNumber: "٣ — واجهة زجاجية",
      guests: 2,
      reservationStartISO: offsetISO(now, 10),
      sessionMinutes: 75,
      status: "accepted",
      customerNotes: "",
    },
    lines: [
      {
        id: "l13",
        name: "لاتيه افوكادو (سبيشلتي)",
        qty: 1,
        unitPrice: 32,
        calories: 240,
        ingredients: ["إسبريسو", "أفوكادو", "حليب لوز"],
        customerNotes: "ثلج استثنائي إن وجد",
        imageVariant: "latte",
      },
      {
        id: "l14",
        name: "براوني دارك",
        qty: 2,
        unitPrice: 22,
        calories: 380,
        ingredients: ["شوكولاتة دارك", "زبد"],
        promo: {
          kind: "واحد وواحد مجانًا",
          discountSar: 22,
          label: "١+١ على الحلويات",
        },
        imageVariant: "cake",
      },
    ],
  };

  return [o1, o2, o7, o3, o4, o5, o8, o6];
}

export const ORDER_STATUS_LABELS: Record<OrderWorkflowStatus, string> = {
  new: "جديد",
  pending_review: "قيد المراجعة",
  accepted: "مقبول",
  preparing: "قيد التجهيز",
  ready: "جاهز للاستلام",
  delivered: "تم التسليم",
  rejected: "مرفوض",
  cancelled: "ملغى",
};

export const TABLE_STATUS_LABELS: Record<TableBookingStatus, string> = {
  pending_staff: "قيد المراجعة",
  accepted: "مقبول",
  rejected: "مرفوض",
};

export function orderHasActivePromo(o: OpsOrder): boolean {
  if (o.discountTotal > 0) return true;
  return o.lines.some((l) => l.promo != null);
}

export function isOrderLate(o: OpsOrder, ref = new Date()): boolean {
  if (
    o.orderStatus === "delivered" ||
    o.orderStatus === "rejected" ||
    o.orderStatus === "cancelled"
  )
    return false;
  return new Date(o.pickupRequestedISO).getTime() < ref.getTime();
}

export const ORDER_REJECT_PRESETS = [
  "المنتج غير متوفر",
  "الوقت لا يكفي لتسليم المنتج",
  "ضغط عالي على الطلبات",
  "الكمية المطلوبة غير متاحة",
  "خارج وقت استقبال الطلبات",
  "سبب آخر",
] as const;

export const TABLE_REJECT_PRESETS = [
  "لا توجد طاولات متاحة",
  "الوقت المطلوب غير متاح",
  "العدد أكبر من سعة الطاولة",
  "الطاولة تحت الصيانة",
  "سبب آخر",
] as const;
