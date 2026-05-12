import type { SupabaseClient } from "@supabase/supabase-js";
import type { DataLoad } from "@/lib/types/data-load";
import { mapSupabaseError } from "@/lib/types/data-load";
import type {
  ArrivalStatus,
  ReservationRecord,
  ReservationStatus,
  ReservationTimelineEntry,
  TimelineStep,
} from "@/lib/mock/reservations-center";

function mapDbReservationStatus(s: string): ReservationStatus {
  const m: Record<string, ReservationStatus> = {
    new: "new",
    pending: "pending_review",
    pending_review: "pending_review",
    confirmed: "confirmed",
    awaiting_guest: "awaiting_guest",
    guest_arrived: "guest_arrived",
    session_active: "session_active",
    session_ended: "session_ended",
    late: "late",
    cancelled: "cancelled",
    rejected: "rejected",
  };
  return m[s] ?? "pending_review";
}

function buildResTimeline(st: ReservationStatus, createdISO: string): ReservationTimelineEntry[] {
  const steps: { step: TimelineStep; labelAr: string }[] = [
    { step: "created", labelAr: "تم إنشاء الحجز" },
    { step: "reviewed", labelAr: "قيد المراجعة" },
    { step: "confirmed", labelAr: "تم التأكيد" },
    { step: "arrived", labelAr: "وصول الضيف" },
    { step: "session_started", labelAr: "بدأت الجلسة" },
    { step: "session_ended", labelAr: "انتهت الجلسة" },
  ];
  const order: ReservationStatus[] = ["new", "pending_review", "confirmed", "awaiting_guest", "guest_arrived", "session_active", "session_ended"];
  const idx = Math.max(0, order.indexOf(st));
  const cap = Math.min(idx, steps.length - 1);
  return steps.map((s, i) => ({
    step: s.step,
    labelAr: s.labelAr,
    atISO: i <= cap ? createdISO : undefined,
  }));
}

export async function loadDashboardReservations(
  supabase: SupabaseClient,
  branchIds: string[],
  tableLabelToId: Map<string, string>,
): Promise<DataLoad<ReservationRecord[]>> {
  if (!branchIds.length) return { status: "empty" };
  try {
    const { data: rows, error } = await supabase
      .from("reservations")
      .select("id, status, party_size, starts_at, table_label, meta, created_at, branch_id, customer_id")
      .in("branch_id", branchIds)
      .order("starts_at", { ascending: true })
      .limit(120);

    if (error) return { status: "error", message: error.message };
    if (!rows?.length) return { status: "empty" };

    const mapped: ReservationRecord[] = (rows as Record<string, unknown>[]).map((r) => {
      const meta = (r.meta as Record<string, unknown> | null) ?? {};
      const guestName = String(meta.guestName ?? "ضيف");
      const parts = guestName.trim().split(/\s+/).filter(Boolean);
      const initials = parts.length >= 2 ? `${parts[0]![0]}${parts[1]![0]}`.toUpperCase() : (parts[0]?.slice(0, 2) ?? "؟").toUpperCase();
      const startISO = r.starts_at ? new Date(String(r.starts_at)).toISOString() : new Date(String(r.created_at ?? Date.now())).toISOString();
      const createdISO = r.created_at ? new Date(String(r.created_at)).toISOString() : startISO;
      const tableLabel = String(r.table_label ?? "—");
      const tableId = tableLabelToId.get(`${r.branch_id}:${tableLabel}`) ?? String(r.id);

      const st = mapDbReservationStatus(String(r.status ?? "pending"));
      const arrival: ArrivalStatus = "not_arrived";

      return {
        id: String(r.id),
        customerName: guestName,
        initials,
        phone: String(meta.phone ?? "—"),
        guests: Number(r.party_size ?? 2),
        startISO,
        sessionMinutes: Number(meta.sessionMinutes ?? 90),
        status: st,
        arrivalStatus: arrival,
        tableId,
        tableLabel,
        tableCategory: "inside",
        customerNotes: meta.notes ? String(meta.notes) : undefined,
        isVip: Boolean(meta.isVip),
        priorVisits: Number(meta.priorVisits ?? 0),
        qrStatus: "unused",
        linkedOrder: null,
        timeline: buildResTimeline(st, createdISO),
      };
    });

    return { status: "ok", data: mapped };
  } catch (e) {
    return { status: "error", message: mapSupabaseError(e) };
  }
}
