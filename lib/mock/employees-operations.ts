export type EmployeeDuty =
  | "كاشير"
  | "تجهيز الطلبات"
  | "استقبال"
  | "تنظيف"
  | "استراحة"
  | "خارج النطاق";

export type GeoAttendanceState =
  | "داخل النطاق"
  | "خارج النطاق"
  | "مستأذن"
  | "متوقف جزئيًا عن العمل";

export type CareerLevelId = "متدرب" | "باريستا" | "كاشير" | "مشرف شفت" | "مدير فرع";

export type HandoffRole = "كاشير" | "تجهيز الطلبات" | "استقبال" | "تنظيف";

export type HandoffShift = {
  id: string;
  role: HandoffRole;
  employeeName: string;
  startLabel: string;
  durationLabel: string;
  status: "نشط" | "قيد التسليم";
};

export type CareerLevel = {
  id: CareerLevelId;
  permissions: string[];
  tasks: string[];
  promotionNeeds: string[];
};

export type AdminNoteKind =
  | "مكافأة أداء"
  | "شكر إداري"
  | "تنبيه"
  | "ملاحظة"
  | "مخالفة تأخير"
  | "خروج من النطاق"
  | "عدم استلام مهمة";

export type EmployeeOpsRow = {
  id: string;
  name: string;
  initials: string;
  employeeNumber: string;
  role: string;
  branch: string;
  duty: EmployeeDuty;
  shiftStartLabel: string;
  currentWorkDurationLabel: string;
  tasks: string[];
  ordersHandledToday: number;
  performanceRating: number;
  rewardsBalance: number;
  adminNotePreview: string;
  geoState: GeoAttendanceState;
};

export const handoffSeed: HandoffShift[] = [
  {
    id: "h1",
    role: "كاشير",
    employeeName: "محمد العتيبي",
    startLabel: "٤:٠٠ م",
    durationLabel: "٢ س ١٠ د",
    status: "نشط",
  },
  {
    id: "h2",
    role: "تجهيز الطلبات",
    employeeName: "خالد الشهري",
    startLabel: "٣:٣٠ م",
    durationLabel: "٢ س ٤٠ د",
    status: "نشط",
  },
  {
    id: "h3",
    role: "استقبال",
    employeeName: "نورة السبيعي",
    startLabel: "٥:٠٠ م",
    durationLabel: "١ س ٢٠ د",
    status: "قيد التسليم",
  },
  {
    id: "h4",
    role: "تنظيف",
    employeeName: "أحمد الزهراني",
    startLabel: "٢:٠٠ م",
    durationLabel: "٤ س ٠ د",
    status: "نشط",
  },
];

export const careerLadder: CareerLevel[] = [
  {
    id: "متدرب",
    permissions: ["تصفح لوحة المهام", "تسجيل حضور وهمي"],
    tasks: ["مرافقة باريستا", "تعبئة مستلزمات"],
    promotionNeeds: ["٤٠ ساعة تدريب", "اختبار صحة عمل"],
  },
  {
    id: "باريستا",
    permissions: ["تحضير المشروبات الأساسية", "استلام أوامر البار"],
    tasks: ["تحضير وفق المعايير", "تنظيف محطة القهوة"],
    promotionNeeds: ["تقييم جودة فوق ٤.٥ لمدة شهرين"],
  },
  {
    id: "كاشير",
    permissions: ["إتمام عمليات البيع", "تطبيق العروض المعتمدة"],
    tasks: ["استقبال الطلبات", "إغلاق الصندوق اليومي وهميًا"],
    promotionNeeds: ["صفر مخالفات نقدية لمدة ٣٠ يومًا"],
  },
  {
    id: "مشرف شفت",
    permissions: ["توزيع المهام اللحظية", "مراجعة تقارير الطاولات"],
    tasks: ["تنسيق الفريق", "تحديث لوحة التشغيل"],
    promotionNeeds: ["اجتياز ورشة الإدارة المصغرة"],
  },
  {
    id: "مدير فرع",
    permissions: ["اعتماد الجداول", "إيقاف العروض الطارئة"],
    tasks: ["متابعة تجربة الضيف", "تحسين الأداء الأسبوعي"],
    promotionNeeds: ["خطة تحسين فرع معتمدة"],
  },
];

export const adminNoteKinds: AdminNoteKind[] = [
  "مكافأة أداء",
  "شكر إداري",
  "تنبيه",
  "ملاحظة",
  "مخالفة تأخير",
  "خروج من النطاق",
  "عدم استلام مهمة",
];

export const employeesOpsSeed: EmployeeOpsRow[] = [
  {
    id: "eo1",
    name: "محمد العتيبي",
    initials: "مع",
    employeeNumber: "RWQ-1024",
    role: "مدير فرع",
    branch: "الرياض — الواجهة",
    duty: "استقبال",
    shiftStartLabel: "٨:٠٠ ص",
    currentWorkDurationLabel: "٩ س ٢٠ د",
    tasks: ["جولة الصالة", "مراجعة تقرير الحجوزات", "متابعة الشكاوى"],
    ordersHandledToday: 32,
    performanceRating: 4.9,
    rewardsBalance: 420,
    adminNotePreview: "شكر إداري — توازن ممتاز خلال الذروة.",
    geoState: "داخل النطاق",
  },
  {
    id: "eo2",
    name: "ريم السبيعي",
    initials: "رس",
    employeeNumber: "RWQ-1041",
    role: "كاشير",
    branch: "الرياض — الواجهة",
    duty: "كاشير",
    shiftStartLabel: "٣:٠٠ م",
    currentWorkDurationLabel: "٥ س ٠ د",
    tasks: ["معالجة الطلبات السريعة", "إغلاق دفعة منتصف اليوم"],
    ordersHandledToday: 118,
    performanceRating: 4.6,
    rewardsBalance: 210,
    adminNotePreview: "تنبيه — تأخير استراحة ١٢ دقيقة أمس.",
    geoState: "داخل النطاق",
  },
  {
    id: "eo3",
    name: "خالد الشهري",
    initials: "خش",
    employeeNumber: "RWQ-1098",
    role: "بارستا",
    branch: "الرياض — الواجهة",
    duty: "تجهيز الطلبات",
    shiftStartLabel: "٢:٣٠ م",
    currentWorkDurationLabel: "٥ س ٣٠ د",
    tasks: ["طابور بار الذروة", "جلسة تنظيف معدات"],
    ordersHandledToday: 156,
    performanceRating: 4.7,
    rewardsBalance: 340,
    adminNotePreview: "مكافأة أداء — سرعة تجهيز فوق المعدل.",
    geoState: "داخل النطاق",
  },
  {
    id: "eo4",
    name: "دانة القحطاني",
    initials: "دق",
    employeeNumber: "RWQ-1072",
    role: "استقبال",
    branch: "الرياض — الواجهة",
    duty: "استراحة",
    shiftStartLabel: "٤:٠٠ م",
    currentWorkDurationLabel: "٤ س ٠ د",
    tasks: ["استكمال استراحة مسموحة"],
    ordersHandledToday: 44,
    performanceRating: 4.3,
    rewardsBalance: 90,
    adminNotePreview: "ملاحظة — متابعة تنظيم قائمة الانتظار.",
    geoState: "خارج النطاق",
  },
  {
    id: "eo5",
    name: "أحمد الزهراني",
    initials: "أز",
    employeeNumber: "RWQ-1110",
    role: "خدمات مساندة",
    branch: "الرياض — الواجهة",
    duty: "تنظيف",
    shiftStartLabel: "١:٠٠ م",
    currentWorkDurationLabel: "٧ س ٠ د",
    tasks: ["تعقيم الطاولات الدورية", "إعادة ترتيج منطقة الأطفال"],
    ordersHandledToday: 0,
    performanceRating: 4.5,
    rewardsBalance: 120,
    adminNotePreview: "—",
    geoState: "داخل النطاق",
  },
];

export type EmployeeDayPerf = { label: string; score: number };
export type EmployeeMonthPerf = { label: string; score: number };

export function employeeDetailExtended(id: string) {
  return {
    shiftWeek: ["الأحد ٨–٤", "الثلاثاء ٨–٤", "الخميس إجازة"],
    tasksQueue: ["تحضير عينات الحملة X", "مراجعة قائمة الحساسية"],
    handoffsLog: ["استلام كاشير — ٥ مايو", "تسليم بار — ٦ مايو"],
    rewardsLog: ["+٥٠ نقاط — سرعة", "+٢٠ — حضور مبكر"],
    notesLog: ["شكر إداري — ١ مايو", "تنبيه استراحة — ٧ مايو"],
    dailyPerf: [
      { label: "السرعة", score: 4.7 },
      { label: "الدقة", score: 4.6 },
      { label: "التعامل", score: 4.8 },
    ] as EmployeeDayPerf[],
    monthlyPerf: [
      { label: "الالتزام بالنطاق", score: 96 },
      { label: "إنجاز المهام", score: 92 },
      { label: "رضا الفريق", score: 88 },
    ] as EmployeeMonthPerf[],
  };
}
