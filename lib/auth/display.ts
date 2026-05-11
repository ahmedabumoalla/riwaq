/** أحرف عرض من الاسم الكامل (عربي / إنجليزي) */
export function initialsFromName(name: string): string {
  const t = name.trim();
  if (!t) return "ر";
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]!.slice(0, 1)}${parts[1]!.slice(0, 1)}`;
  }
  return t.slice(0, 2);
}
