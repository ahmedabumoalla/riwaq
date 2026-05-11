"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

type SignOutButtonProps = {
  className?: string;
  label?: string;
  variant?: "dark" | "light";
};

export function SignOutButton({
  className = "",
  label = "خروج",
  variant = "dark",
}: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function onSignOut() {
    setLoading(true);
    try {
      window.location.href = "/api/auth/logout";
    } finally {
      setLoading(false);
    }
  }

  const base =
    variant === "light"
      ? "border border-riwaq-beige bg-white/90 text-riwaq-brown hover:bg-riwaq-cream/80"
      : "bg-riwaq-brown/10 text-riwaq-brown hover:bg-riwaq-brown/15";

  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-xs font-extrabold transition disabled:opacity-50 ${base} ${className}`}
    >
      <LogOut className="h-4 w-4" aria-hidden />
      {loading ? "…" : label}
    </button>
  );
}
