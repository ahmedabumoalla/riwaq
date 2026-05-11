"use client";

import Link from "next/link";
import { CalendarPlus, Gift, Share2, ShoppingBasket } from "lucide-react";
import { FadeIn } from "@/components/customer/fade-in";
import { useCustomerSession } from "@/components/customer/customer-session-context";
import { mockCustomerHome } from "@/lib/mock/customer-app";

export function CustomerHomeView() {
  const h = mockCustomerHome;
  const { displayName, loyaltyPoints } = useCustomerSession();
  const firstName = displayName.trim().split(/\s+/)[0] ?? displayName;

  return (
    <div className="space-y-6">
      <FadeIn>
        <section className="overflow-hidden rounded-[1.75rem] bg-linear-to-bl from-riwaq-brown via-[#4a2e1c] to-riwaq-caramel p-6 text-white shadow-2xl shadow-riwaq-brown/25 ring-1 ring-white/10">
          <p className="text-sm font-bold text-white/80">{h.greeting}، {firstName}</p>
          <h1 className="mt-2 font-extrabold text-2xl leading-tight">رِواق بين يديك — جاهزين لزيارتك القادمة</h1>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md ring-1 ring-white/15">
              <p className="text-[11px] font-extrabold text-white/75">نقاطك الآن</p>
              <p className="mt-1 font-extrabold text-2xl tabular-nums">{loyaltyPoints.toLocaleString("ar-SA")}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md ring-1 ring-white/15">
              <p className="text-[11px] font-extrabold text-white/75">أقرب مكافأة</p>
              <p className="mt-1 text-sm font-bold leading-snug">{h.nearestReward}</p>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <section className="rounded-3xl border border-white/85 bg-white/80 p-5 shadow-lg ring-1 ring-riwaq-beige/90">
          <p className="text-xs font-extrabold text-riwaq-muted">{h.branchName}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-riwaq-cream/70 px-4 py-4 ring-1 ring-riwaq-beige">
              <p className="text-[11px] font-extrabold text-riwaq-muted">طلب نشط</p>
              <p className="mt-1 font-extrabold text-riwaq-brown">{h.activeOrder.id}</p>
              <p className="mt-2 text-sm font-bold text-riwaq-muted">{h.activeOrder.items}</p>
              <p className="mt-2 text-xs font-extrabold text-riwaq-caramel">
                {h.activeOrder.status} · متبقّي ~{h.activeOrder.etaMin.toLocaleString("ar-SA")} د
              </p>
            </div>
            <div className="rounded-2xl bg-riwaq-green/8 px-4 py-4 ring-1 ring-riwaq-green/20">
              <p className="text-[11px] font-extrabold text-riwaq-muted">حجز قادم</p>
              <p className="mt-1 font-extrabold text-riwaq-brown">{h.upcomingReservation.table}</p>
              <p className="mt-2 text-sm font-bold text-riwaq-muted">{h.upcomingReservation.when}</p>
              <p className="mt-2 text-xs font-bold text-riwaq-muted">
                {h.upcomingReservation.guests.toLocaleString("ar-SA")} ضيوف · {h.upcomingReservation.id}
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/customer/reservations", label: "احجز طاولة", icon: CalendarPlus },
            { href: "/customer/menu", label: "اطلب الآن", icon: ShoppingBasket },
            { href: "/customer/share", label: "شارك تجربتك", icon: Share2 },
            { href: "/customer/rewards", label: "استبدل مكافأة", icon: Gift },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-3xl border border-riwaq-beige bg-white/85 px-3 py-4 text-center shadow-md ring-1 ring-white/80 transition hover:border-riwaq-caramel/35"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-riwaq-caramel/15 text-riwaq-caramel">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="text-xs font-extrabold text-riwaq-brown">{label}</span>
            </Link>
          ))}
        </section>
      </FadeIn>

      <FadeIn delay={0.12}>
        <section className="rounded-3xl border border-white/85 bg-white/75 p-5 shadow-md ring-1 ring-riwaq-beige/90">
          <h2 className="font-extrabold text-lg text-riwaq-brown">عروض مخصصة لك</h2>
          <ul className="mt-4 space-y-2">
            {h.offers.map((o) => (
              <li key={o} className="rounded-2xl bg-riwaq-cream/60 px-4 py-3 text-sm font-bold text-riwaq-muted ring-1 ring-riwaq-beige">
                {o}
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>

      <FadeIn delay={0.14}>
        <section className="rounded-3xl border border-white/85 bg-white/75 p-5 shadow-md ring-1 ring-riwaq-beige/90">
          <h2 className="font-extrabold text-lg text-riwaq-brown">منتجاتك المفضلة</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {h.favorites.map((x) => (
              <span key={x} className="rounded-full bg-riwaq-brown px-4 py-2 text-xs font-extrabold text-white shadow-sm">
                {x}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold text-riwaq-muted">
            طاولتك المفضلة:{" "}
            <span className="font-extrabold text-riwaq-brown">{h.favTable}</span>
          </p>
        </section>
      </FadeIn>
    </div>
  );
}
