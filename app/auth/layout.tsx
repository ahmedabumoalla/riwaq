import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الحساب — رِواق",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-riwaq-cream via-white to-riwaq-beige/40 px-4 py-10">
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  );
}
