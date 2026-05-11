/**
 * مفتاح Mapbox العام (للمتصفح فقط).
 * استخدم أحد المتغيرين في `.env.local`:
 * - NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN (الاسم الموصى به في وثائق Mapbox)
 * - NEXT_PUBLIC_MAPBOX_TOKEN (بديل للتوافق)
 */
export function getMapboxPublicToken(): string {
  return (
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim() ||
    ""
  );
}
