export type EmployeeRole = "مدير فرع" | "كاشير" | "بارستا" | "استقبال";

export type EmployeeActivity = "كاشير" | "تجهيز طلبات" | "استقبال" | "استراحة";

export type AttendanceStatus = "حاضر" | "خارج النطاق";

export type EmployeeRow = {
  id: string;
  name: string;
  initials: string;
  employeeNumber: string;
  role: EmployeeRole;
  activity: EmployeeActivity;
  attendance: AttendanceStatus;
  performanceRating: number;
};

export const initialEmployees: EmployeeRow[] = [
  {
    id: "e1",
    name: "محمد العتيبي",
    initials: "مع",
    employeeNumber: "RWQ-1024",
    role: "مدير فرع",
    activity: "استقبال",
    attendance: "حاضر",
    performanceRating: 4.8,
  },
  {
    id: "e2",
    name: "ريم السبيعي",
    initials: "رس",
    employeeNumber: "RWQ-1041",
    role: "كاشير",
    activity: "كاشير",
    attendance: "حاضر",
    performanceRating: 4.5,
  },
  {
    id: "e3",
    name: "سالم الغامدي",
    initials: "سغ",
    employeeNumber: "RWQ-1056",
    role: "بارستا",
    activity: "تجهيز طلبات",
    attendance: "حاضر",
    performanceRating: 4.6,
  },
  {
    id: "e4",
    name: "دانة القحطاني",
    initials: "دق",
    employeeNumber: "RWQ-1072",
    role: "استقبال",
    activity: "استراحة",
    attendance: "خارج النطاق",
    performanceRating: 4.2,
  },
];
