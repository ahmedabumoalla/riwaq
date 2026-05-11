import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "إنشاء حساب",
};

export default function RegisterPage() {
  return (
    <div className="rounded-[1.75rem] border border-white/90 bg-white/90 p-6 shadow-2xl shadow-riwaq-brown/10 ring-1 ring-riwaq-beige/90 backdrop-blur-md sm:p-8">
      <h1 className="text-center font-extrabold text-2xl text-riwaq-brown">
        إنشاء حساب
      </h1>

      <p className="mt-2 text-center text-sm font-bold text-riwaq-muted">
        اختر نوع الحساب وابدأ مباشرة.
      </p>

      <RegisterForm />

      <p className="mt-6 text-center text-sm font-bold text-riwaq-muted">
        لديك حساب؟{" "}
        <Link
          href="/auth/login"
          className="font-extrabold text-riwaq-caramel underline-offset-2 hover:underline"
        >
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}