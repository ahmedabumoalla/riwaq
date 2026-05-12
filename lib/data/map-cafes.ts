import "server-only";

type OpeningWindow = { open?: string; close?: string; enabled?: boolean };

const DAY_KEYS: Record<number, string[]> = {
  0: ["sunday", "sun", "الاحد", "الأحد"],
  1: ["monday", "mon", "الاثنين"],
  2: ["tuesday", "tue", "الثلاثاء"],
  3: ["wednesday", "wed", "الاربعاء", "الأربعاء"],
  4: ["thursday", "thu", "الخميس"],
  5: ["friday", "fri", "الجمعة"],
  6: ["saturday", "sat", "السبت"],
};

function normalizeOpeningHours(input: unknown): Record<string, OpeningWindow> {
  if (!input) return {};
  if (typeof input === "object") return input as Record<string, OpeningWindow>;
  if (typeof input !== "string") return {};
  try {
    const parsed = JSON.parse(input) as unknown;
    if (parsed && typeof parsed === "object") return parsed as Record<string, OpeningWindow>;
  } catch {
    return {};
  }
  return {};
}

function parseHm(value: string | undefined): number | null {
  if (!value) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(min) || h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
}

export function isCafeOpenNow(openingHours: unknown, now = new Date()): boolean {
  const normalized = normalizeOpeningHours(openingHours);
  const keys = DAY_KEYS[now.getDay()] ?? [];
  const day = keys.map((k) => normalized[k]).find(Boolean);
  if (!day) return true;
  if (day.enabled === false) return false;

  const open = parseHm(day.open);
  const close = parseHm(day.close);
  if (open == null || close == null) return true;

  const minutes = now.getHours() * 60 + now.getMinutes();
  if (close < open) return minutes >= open || minutes <= close;
  return minutes >= open && minutes <= close;
}

export function toHoursLabel(openingHours: unknown): string {
  const normalized = normalizeOpeningHours(openingHours);
  const values = Object.values(normalized);
  const first = values.find((v) => v?.open && v?.close && v.enabled !== false);
  if (!first?.open || !first?.close) return "غير محدد";
  return `${first.open} — ${first.close}`;
}

export function buildDirectionsUrl(googleMapsUrl: string | null | undefined, lat: number, lng: number): string {
  if (googleMapsUrl && googleMapsUrl.trim()) return googleMapsUrl.trim();
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
