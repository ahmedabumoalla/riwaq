"use client";

import { ShoppingBasket, X } from "lucide-react";
import { useMemo, useState } from "react";
import { drinkModifiers, mockMenuItems, type CustomerMenuItem } from "@/lib/mock/customer-app";
import { formatSar } from "@/lib/format";

type CartLine = {
  item: CustomerMenuItem;
  qty: number;
  note?: string;
};

export function CustomerMenuView() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [pickupAt, setPickupAt] = useState("خلال ٢٠ دقيقة");
  const [linkReservation, setLinkReservation] = useState(true);

  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.item.price * l.qty, 0), [cart]);
  const discount = subtotal > 80 ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal - discount);

  function addItem(item: CustomerMenuItem) {
    setCart((prev) => {
      const i = prev.findIndex((p) => p.item.id === item.id);
      if (i === -1) return [...prev, { item, qty: 1 }];
      const copy = [...prev];
      const cur = copy[i];
      if (!cur) return prev;
      copy[i] = { ...cur, qty: cur.qty + 1 };
      return copy;
    });
  }

  function setQty(id: string, qty: number) {
    setCart((prev) => prev.map((l) => (l.item.id === id ? { ...l, qty: Math.max(1, qty) } : l)));
  }

  return (
    <div className="space-y-6 pb-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-extrabold text-2xl text-riwaq-brown">المنيو</h1>
          <p className="mt-1 text-sm font-bold text-riwaq-muted">صُممت الكروت لتبدو جاهزة للتسويق — بيانات تجريبية</p>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative inline-flex items-center gap-2 rounded-2xl bg-riwaq-brown px-4 py-3 text-sm font-extrabold text-white shadow-lg"
        >
          <ShoppingBasket className="h-5 w-5" aria-hidden />
          السلة
          {cart.length ? (
            <span className="absolute -top-2 -left-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-riwaq-caramel px-1 text-[11px] font-extrabold text-white shadow">
              {cart.reduce((s, l) => s + l.qty, 0).toLocaleString("ar-SA")}
            </span>
          ) : null}
        </button>
      </header>

      <div className="space-y-5">
        {mockMenuItems.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/85 shadow-xl ring-1 ring-riwaq-beige/90"
          >
            <div className={`relative h-36 bg-linear-to-br ${item.gradient} ring-1 ring-white/70`}>
              <span className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-extrabold text-riwaq-brown shadow-sm ring-1 ring-riwaq-beige">
                {item.cal.toLocaleString("ar-SA")} سعرة
              </span>
            </div>
            <div className="space-y-3 p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-extrabold text-xl text-riwaq-brown">{item.name}</h2>
                <span className="font-extrabold tabular-nums text-riwaq-green">{formatSar(item.price)}</span>
              </div>
              <p className="text-sm font-bold leading-relaxed text-riwaq-muted">{item.desc}</p>
              <p className="text-xs font-bold text-riwaq-muted">
                المكونات: <span className="font-extrabold text-riwaq-brown">{item.ingredients}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {item.promo ? (
                  <span className="rounded-full bg-riwaq-caramel/15 px-3 py-1 text-[11px] font-extrabold text-riwaq-caramel ring-1 ring-riwaq-caramel/25">
                    {item.promo}
                  </span>
                ) : null}
                <span className="rounded-full bg-riwaq-green/10 px-3 py-1 text-[11px] font-extrabold text-riwaq-green ring-1 ring-riwaq-green/25">
                  +{item.points.toLocaleString("ar-SA")} نقطة ولاء
                </span>
              </div>

              <div>
                <p className="text-[11px] font-extrabold text-riwaq-muted">ملاحظات سريعة</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {drinkModifiers.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        setCart((prev) => {
                          const idx = prev.findIndex((p) => p.item.id === item.id);
                          if (idx === -1) return [...prev, { item, qty: 1, note: m }];
                          const next = [...prev];
                          const cur = next[idx]!;
                          next[idx] = { ...cur, note: cur.note ? `${cur.note}، ${m}` : m };
                          return next;
                        })
                      }
                      className="rounded-full border border-riwaq-beige bg-riwaq-cream/50 px-3 py-1.5 text-[11px] font-extrabold text-riwaq-brown hover:bg-riwaq-beige/70"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  addItem(item);
                  setCartOpen(true);
                }}
                className="w-full rounded-2xl bg-riwaq-brown py-3 text-sm font-extrabold text-white shadow-md hover:brightness-105"
              >
                إضافة للسلة
              </button>
            </div>
          </article>
        ))}
      </div>

      {cartOpen ? (
        <>
          <button
            type="button"
            aria-label="إغلاق السلة"
            className="fixed inset-0 z-[90] bg-riwaq-brown/45 backdrop-blur-[2px]"
            onClick={() => setCartOpen(false)}
          />
          <aside className="fixed inset-y-0 start-0 z-[95] flex w-[min(100vw-1rem,22rem)] flex-col border-e border-riwaq-beige bg-white shadow-2xl sm:w-[min(100vw-2rem,26rem)]">
            <div className="flex items-center justify-between border-b border-riwaq-beige px-5 py-4">
              <div>
                <p className="text-xs font-extrabold text-riwaq-muted">سلة الطلب</p>
                <p className="font-extrabold text-lg text-riwaq-brown">مراجعة قبل الإرسال</p>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-xl p-2 text-riwaq-muted hover:bg-riwaq-beige/70"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {cart.length === 0 ? (
                <p className="text-center text-sm font-bold text-riwaq-muted">السلة فارغة — أضف من المنيو</p>
              ) : (
                cart.map((line) => (
                  <div key={line.item.id} className="rounded-2xl bg-riwaq-cream/50 p-4 ring-1 ring-riwaq-beige/80">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-extrabold text-riwaq-brown">{line.item.name}</p>
                        {line.note ? (
                          <p className="mt-1 text-[11px] font-bold text-riwaq-muted">ملاحظة: {line.note}</p>
                        ) : null}
                      </div>
                      <span className="shrink-0 font-extrabold tabular-nums text-riwaq-green">
                        {formatSar(line.item.price * line.qty)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-9 w-9 rounded-xl bg-white font-extrabold ring-1 ring-riwaq-beige"
                          onClick={() => {
                            if (line.qty <= 1) {
                              setCart((p) => p.filter((x) => x.item.id !== line.item.id));
                            } else {
                              setQty(line.item.id, line.qty - 1);
                            }
                          }}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-extrabold tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          className="h-9 w-9 rounded-xl bg-white font-extrabold ring-1 ring-riwaq-beige"
                          onClick={() => setQty(line.item.id, line.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-[11px] font-extrabold text-red-700"
                        onClick={() => setCart((p) => p.filter((x) => x.item.id !== line.item.id))}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-4 border-t border-riwaq-beige bg-white px-5 py-5">
              <label className="block text-[11px] font-extrabold text-riwaq-muted">
                وقت الاستلام المطلوب
                <select
                  value={pickupAt}
                  onChange={(e) => setPickupAt(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-riwaq-beige bg-white px-4 py-3 text-sm font-bold text-riwaq-brown outline-none ring-riwaq-caramel/25 focus:ring-2"
                >
                  <option>خلال ١٥ دقيقة</option>
                  <option>خلال ٢٠ دقيقة</option>
                  <option>خلال ٣٠ دقيقة</option>
                  <option>استلام في الفرع لاحقًا</option>
                </select>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-riwaq-cream/50 px-4 py-3 ring-1 ring-riwaq-beige/80">
                <input
                  type="checkbox"
                  checked={linkReservation}
                  onChange={(e) => setLinkReservation(e.target.checked)}
                  className="accent-riwaq-brown"
                />
                <span className="text-sm font-bold text-riwaq-brown">ربط الطلب بحجز طاولة نشط</span>
              </label>

              <div className="space-y-2 rounded-2xl bg-riwaq-brown/[0.06] px-4 py-3 text-sm font-bold">
                <div className="flex justify-between gap-2">
                  <span className="text-riwaq-muted">المجموع قبل الخصم</span>
                  <span className="tabular-nums font-extrabold">{formatSar(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-riwaq-muted">خصم ولاء تقديري</span>
                  <span className="tabular-nums font-extrabold text-riwaq-green">− {formatSar(discount)}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-riwaq-beige/80 pt-2 text-base font-extrabold">
                  <span>الإجمالي</span>
                  <span className="tabular-nums text-riwaq-brown">{formatSar(total)}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-2xl bg-riwaq-green py-3 text-sm font-extrabold text-white shadow-lg hover:brightness-105"
              >
                إرسال الطلب (وهمي)
              </button>
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}
