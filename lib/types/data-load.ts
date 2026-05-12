/** نتيجة تحميل بيانات من Supabase — بدون الاعتماد على mock كمصدر أساسي */
export type DataLoad<T> =
  | { status: "ok"; data: T }
  | { status: "empty" }
  | { status: "error"; message: string };

export function mapSupabaseError(e: unknown): string {
  if (e && typeof e === "object" && "message" in e && typeof (e as { message: string }).message === "string") {
    return (e as { message: string }).message;
  }
  return "تعذر الاتصال بقاعدة البيانات.";
}
