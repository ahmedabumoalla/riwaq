import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "رِواق — نظام تشغيل ذكي للكافيهات",
  description:
    "منصة تجمع المنيو والطلبات والحجوزات والولاء والتسويق وإدارة الموظفين في تجربة واحدة للكافيهات.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} h-full antialiased`}
    >
      <body className="min-h-0 min-h-full min-w-0 flex flex-col overflow-x-clip font-medium text-riwaq-brown bg-riwaq-cream">
        {children}
      </body>
    </html>
  );
}
