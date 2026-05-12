import type { Metadata } from "next";
import { PlatformAdminCommunityModerationClient } from "@/components/platform-admin/community-moderation-client";

export const metadata: Metadata = {
  title: "مراقبة المجتمع",
};

export default function PlatformAdminCommunityModerationPage() {
  return <PlatformAdminCommunityModerationClient />;
}
