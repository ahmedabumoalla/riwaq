import type { SupabaseClient } from "@supabase/supabase-js";
import type { DataLoad } from "@/lib/types/data-load";
import { mapSupabaseError } from "@/lib/types/data-load";
import type {
  OpsOrder,
  OrderLineItem,
  OrderWorkflowStatus,
  TimelineEntry,
  TimelineStepId,
} from "@/lib/mock/orders-operations";

const STEP_DEFS: { step: TimelineStepId; labelAr: string }[] = [
  { step: "created", labelAr: "تم إنشاء الطلب" },
  { step: "reviewed", labelAr: "تمت المراجعة" },
  { step: "accepted", labelAr: "تم قبول الطلب" },
  { step: "preparing", labelAr: "بدأ التجهيز" },
  { step: "ready", labelAr: "جاهز للاستلام" },
  { step: "delivered", labelAr: "تم التسليم" },
];

function mapDbStatus(s: string): OrderWorkflowStatus {
  const m: Record<string, OrderWorkflowStatus> = {
    new: "new",
    pending: "pending_review",
    pending_review: "pending_review",
    accepted: "accepted",
    preparing: "preparing",
    ready: "ready",
    delivered: "delivered",
    rejected: "rejected",
    cancelled: "cancelled",
  };
  return m[s] ?? "pending_review";
}

function statusStepIndex(st: OrderWorkflowStatus): number {
  const order: OrderWorkflowStatus[] = [
    "new",
    "pending_review",
    "accepted",
    "preparing",
    "ready",
    "delivered",
  ];
  const i = order.indexOf(st);
  return i < 0 ? 0 : i;
}

function buildTimeline(st: OrderWorkflowStatus, createdISO: string): TimelineEntry[] {
  const idx = statusStepIndex(st);
  return STEP_DEFS.map((s, i) => ({
    step: s.step,
    labelAr: s.labelAr,
    atISO: i <= idx ? createdISO : undefined,
  }));
}

function initialsFromName(name: string): string {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length >= 2) return (p[0]![0] + p[1]![0]).toUpperCase();
  return (p[0]?.slice(0, 2) ?? "؟").toUpperCase();
}

export async function loadDashboardOrders(supabase: SupabaseClient, branchIds: string[]): Promise<DataLoad<OpsOrder[]>> {
  if (!branchIds.length) return { status: "empty" };
  try {
    const { data: orders, error: oErr } = await supabase
      .from("orders")
      .select("id, status, total, created_at, branch_id, customer_id, meta")
      .in("branch_id", branchIds)
      .order("created_at", { ascending: false })
      .limit(20);

    if (oErr) return { status: "error", message: oErr.message };
    if (!orders?.length) return { status: "empty" };

    const orderIds = orders.map((o: { id: string }) => o.id);
    const { data: items, error: iErr } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds)
      .limit(200);
    if (iErr) return { status: "error", message: iErr.message };

    const byOrder = new Map<string, Record<string, unknown>[]>();
    for (const it of items ?? []) {
      const row = it as Record<string, unknown>;
      const oid = String(row.order_id);
      const arr = byOrder.get(oid) ?? [];
      arr.push(row);
      byOrder.set(oid, arr);
    }

    const custIds = [...new Set(orders.map((o: { customer_id: string | null }) => o.customer_id).filter(Boolean))] as string[];
    const profMap = new Map<string, { full_name: string | null; phone: string | null }>();
    if (custIds.length) {
      const { data: profs, error: pErr } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .in("id", custIds)
        .limit(20);
      if (pErr) return { status: "error", message: pErr.message };
      for (const p of profs ?? []) {
        const row = p as { id: string; full_name: string | null; phone: string | null };
        profMap.set(row.id, { full_name: row.full_name, phone: row.phone });
      }
    }

    const mapped: OpsOrder[] = (orders as Record<string, unknown>[]).map((o) => {
      const id = String(o.id);
      const createdISO = o.created_at ? new Date(String(o.created_at)).toISOString() : new Date().toISOString();
      const st = mapDbStatus(String(o.status ?? "pending"));
      const meta = (o.meta as Record<string, unknown> | null) ?? {};
      const custId = o.customer_id ? String(o.customer_id) : null;
      const prof = custId ? profMap.get(custId) : undefined;
      const customerName = String(meta.customerName ?? prof?.full_name ?? "ضيف");
      const customerPhone = String(meta.customerPhone ?? prof?.phone ?? "—");

      const rawLines = byOrder.get(id) ?? [];
      const lines: OrderLineItem[] = rawLines.map((it) => {
        const m = (it.meta as Record<string, unknown> | null) ?? {};
        const ing = m.ingredients;
        return {
          id: String(it.id),
          name: String(it.name),
          qty: Number(it.qty ?? 1),
          unitPrice: Number(it.unit_price ?? 0),
          calories: Number(m.calories ?? 0),
          ingredients: Array.isArray(ing) ? (ing as string[]) : typeof ing === "string" ? [ing] : ["—"],
          customerNotes: m.customerNotes ? String(m.customerNotes) : undefined,
          imageVariant: (m.imageVariant as OrderLineItem["imageVariant"]) ?? "latte",
        };
      });

      const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
      const total = Number(o.total ?? subtotal);

      return {
        id,
        customerName,
        customerPhone,
        initials: initialsFromName(customerName),
        createdAtISO: createdISO,
        pickupRequestedISO: String(meta.pickupRequestedISO ?? createdISO),
        estimatedPrepMinutes: Number(meta.estimatedPrepMinutes ?? 15),
        orderStatus: st,
        lines: lines.length
          ? lines
          : [
              {
                id: `${id}-line`,
                name: "—",
                qty: 1,
                unitPrice: total,
                calories: 0,
                ingredients: ["—"],
                imageVariant: "latte",
              },
            ],
        subtotalBeforeDiscount: subtotal || total,
        discountTotal: Number(meta.discountTotal ?? 0),
        taxAmount: Number(meta.taxAmount ?? 0),
        total,
        paymentMethod: (meta.paymentMethod as OpsOrder["paymentMethod"]) ?? "بطاقة",
        paymentStatus: (meta.paymentStatus as OpsOrder["paymentStatus"]) ?? "مدفوع",
        tableBooking: null,
        staffNotes: meta.staffNotes ? String(meta.staffNotes) : "",
        timeline: buildTimeline(st, createdISO),
      };
    });

    return { status: "ok", data: mapped };
  } catch (e) {
    return { status: "error", message: mapSupabaseError(e) };
  }
}
