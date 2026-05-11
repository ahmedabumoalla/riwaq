export type ReservationRowStatus = "في الانتظار" | "مؤكد" | "مرفوض" | "وقت بديل مقترح";

export type ReservationRow = {
  id: string;
  customer: string;
  guests: number;
  time: string;
  tableNumber: string;
  status: ReservationRowStatus;
  suggestedTime?: string;
};

export const initialReservationRows: ReservationRow[] = [
  {
    id: "RSV-441",
    customer: "عائلة الحربي",
    guests: 6,
    time: "٨:٠٠ م",
    tableNumber: "٥",
    status: "في الانتظار",
  },
  {
    id: "RSV-440",
    customer: "سارة المطيري",
    guests: 2,
    time: "٧:٣٠ م",
    tableNumber: "٢",
    status: "مؤكد",
  },
  {
    id: "RSV-439",
    customer: "مجموعة عمل — أرامكو",
    guests: 10,
    time: "٩:٠٠ م",
    tableNumber: "قاعة صغيرة",
    status: "في الانتظار",
  },
  {
    id: "RSV-438",
    customer: "عبدالله الشهري",
    guests: 4,
    time: "٦:١٥ م",
    tableNumber: "٧",
    status: "وقت بديل مقترح",
    suggestedTime: "٦:٤٥ م",
  },
];
