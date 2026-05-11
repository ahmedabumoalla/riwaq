import type { Metadata } from "next";
import { PlatformAdminShell } from "@/components/platform-admin/platform-admin-shell";

export const metadata: Metadata = {
  title: {
    template: "%s | إدارة المنصة — رِواق",
    default: "إدارة المنصة",
  },
  description: "لوحة تنفيذية لمسؤول المنصة — كافيهات، اشتراكات، إيرادات، ومحتوى.",
};

export default function PlatformAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PlatformAdminShell>{children}</PlatformAdminShell>;
}
