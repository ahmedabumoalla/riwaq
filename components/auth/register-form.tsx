"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AccountType = "customer" | "cafe_owner";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
      setError("صيغة البريد الإلكتروني غير صحيحة.");
      return;
    }
    if (!phone.trim()) {
      setError("الجوال مطلوب.");
      return;
    }
    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
      return;
    }
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          password,
          account_type: accountType,
        }),
      });

      const payload = (await response.json()) as {
        success: boolean;
        message?: string;
        redirectTo?: string;
      };

      if (!response.ok || !payload.success) {
        setError(payload.message ?? "تعذر إنشاء الحساب.");
        return;
      }

      setSuccess("تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.");
      router.push(`/auth/login?next=${encodeURIComponent(payload.redirectTo ?? "/customer")}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-xs font-extrabold text-riwaq-muted">الاسم الكامل</span>
        <input
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/25 focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="text-xs font-extrabold text-riwaq-muted">البريد الإلكتروني</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/25 focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="text-xs font-extrabold text-riwaq-muted">الجوال</span>
        <input
          type="tel"
          autoComplete="tel"
          required
          placeholder="+9665xxxxxxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/25 focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="text-xs font-extrabold text-riwaq-muted">كلمة المرور</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/25 focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="text-xs font-extrabold text-riwaq-muted">تأكيد كلمة المرور</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/25 focus:ring-2"
        />
      </label>

      <div>
        <p className="text-xs font-extrabold text-riwaq-muted">نوع الحساب</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAccountType("customer")}
            className={`rounded-2xl px-4 py-3 text-sm font-extrabold ring-1 ${
              accountType === "customer"
                ? "bg-riwaq-brown text-white ring-riwaq-brown"
                : "bg-white text-riwaq-brown ring-riwaq-beige"
            }`}
          >
            عميل
          </button>
          <button
            type="button"
            onClick={() => setAccountType("cafe_owner")}
            className={`rounded-2xl px-4 py-3 text-sm font-extrabold ring-1 ${
              accountType === "cafe_owner"
                ? "bg-riwaq-brown text-white ring-riwaq-brown"
                : "bg-white text-riwaq-brown ring-riwaq-beige"
            }`}
          >
            كوفي
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-800 ring-1 ring-red-100">{error}</p>
      ) : null}
      {success ? (
        <p className="rounded-2xl bg-riwaq-green/10 px-4 py-3 text-sm font-bold text-riwaq-green ring-1 ring-riwaq-green/30">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-riwaq-green py-3.5 text-sm font-extrabold text-white shadow-lg shadow-riwaq-green/20 transition hover:brightness-105 disabled:opacity-60"
      >
        {loading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
      </button>
    </form>
  );
}

