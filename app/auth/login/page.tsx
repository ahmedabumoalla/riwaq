import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
};

export default function LoginPage() {
  return (
    <div className="rounded-[1.75rem] border border-white/90 bg-white/90 p-6 shadow-2xl shadow-riwaq-brown/10 ring-1 ring-riwaq-beige/90 backdrop-blur-md sm:p-8">
      <h1 className="text-center font-extrabold text-2xl text-riwaq-brown">تسجيل الدخول</h1>
      <p className="mt-2 text-center text-sm font-bold text-riwaq-muted">أدخل بياناتك للوصول إلى لوحة الإدارة أو تجربة العميل</p>
      <LoginForm />
      <p className="mt-6 text-center text-sm font-bold text-riwaq-muted">
        ليس لديك حساب؟{" "}
        <Link href="/auth/register" className="font-extrabold text-riwaq-caramel underline-offset-2 hover:underline">
          إنشاء حساب
        </Link>
      </p>
    </div>
  );
}
