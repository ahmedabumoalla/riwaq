"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as {
        success: boolean;
        message?: string;
        role?: string;
        redirectTo?: string;
      };

      if (!response.ok || !payload.success) {
        setError(payload.message ?? "تعذر تسجيل الدخول.");
        return;
      }

      setSuccess("تم تسجيل الدخول بنجاح.");
      router.replace(payload.redirectTo ?? "/customer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
        <span className="text-xs font-extrabold text-riwaq-muted">كلمة المرور</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/25 focus:ring-2"
        />
      </label>
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
        className="w-full rounded-2xl bg-riwaq-brown py-3.5 text-sm font-extrabold text-white shadow-lg shadow-riwaq-brown/20 transition hover:brightness-105 disabled:opacity-60"
      >
        {loading ? "جاري الدخول…" : "دخول"}
      </button>
    </form>
  );
}
