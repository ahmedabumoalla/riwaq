import { Settings } from "lucide-react";
import type { Metadata } from "next";
import { DashboardPlaceholder } from "@/components/dashboard/dashboard-placeholder";

export const metadata: Metadata = {
  title: "الإعدادات",
};

export default function DashboardSettingsPage() {
  return (
    <DashboardPlaceholder
      icon={Settings}
      title="إعدادات المتجر"
      description="اسم العلامة، الفروع، وساعات العمل والربط الخارجي ستُضبط من هذه الصفحة لاحقًا."
      bullets={[
        "معلومات العلامة ولغة الواجهة",
        "إدارة فروع متعددة",
        "تفضيلات الإشعارات والخصوصية",
      ]}
    />
  );
}
