import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Armchair, Clock, MapPin, Share2, Sparkles, Star, Users } from "lucide-react";
import { DataEmptyState } from "@/components/ui/data-state";
import { listCafePromotions } from "@/lib/data/cafe-promotions";
import { getMapCafeByIdData } from "@/lib/data/cafes";
import { distanceKm } from "@/lib/geo/haversine";
import { postsByCafeId } from "@/lib/mock/community";
import { getMapCafeById, manualRegionCenters } from "@/lib/mock/map-cafes";
import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/community/post-card";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const r = await getMapCafeByIdData(supabase, id);
  const c = r.data ?? getMapCafeById(id);
  return { title: c ? c.name : "الكوفي" };
}

function crowdAr(c: "low" | "medium" | "high") {
  if (c === "low") return "هادئ نسبيًا";
  if (c === "medium") return "متوسط الازدحام";
  return "مزدحم الآن";
}

function regionRef(cafeRegion: string) {
  const id =
    { الرياض: "riyadh", جدة: "jeddah", الدمام: "dammam", مكة: "makkah" }[cafeRegion] ?? "riyadh";
  return manualRegionCenters.find((r) => r.id === id) ?? manualRegionCenters[0]!;
}

export default async function PublicCafePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const r = await getMapCafeByIdData(supabase, id);
  const cafe = r.data ?? getMapCafeById(id);
  if (!cafe) notFound();
  const promotions = await listCafePromotions(supabase, cafe.id, true);
  const bannerPromotion = promotions.find((p) => p.promoType === "banner");
  const latestPromotion = promotions.find((p) => p.promoType === "latest_products");
  const contestPromotion = promotions.find((p) => p.promoType === "contest");

  const posts = postsByCafeId(cafe.id);
  const ref = regionRef(cafe.region);
  const approxKm = distanceKm(ref.lat, ref.lng, cafe.lat, cafe.lng);

  return (
    <div className="min-w-0 space-y-8">
      {bannerPromotion ? (
        <section className="overflow-hidden rounded-3xl border border-riwaq-beige bg-white/90 shadow-sm">
          {bannerPromotion.imageUrl ? (
            <img src={bannerPromotion.imageUrl} alt={bannerPromotion.title} className="h-44 w-full object-cover" />
          ) : null}
          <div className="p-4">
            <h2 className="text-lg font-extrabold text-riwaq-brown">{bannerPromotion.title || "إعلان"}</h2>
            <p className="mt-1 text-sm font-bold text-riwaq-muted">{bannerPromotion.description}</p>
          </div>
        </section>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-xl ring-1 ring-riwaq-beige/80">
        <div className="relative aspect-[21/9] min-h-[160px] w-full bg-linear-to-br from-riwaq-beige/90 via-riwaq-cream to-riwaq-caramel/25">
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-sm font-extrabold text-riwaq-brown/70">معرض صور الكوفي — Placeholder</p>
          </div>
        </div>
        <div className="space-y-4 p-5 sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold text-riwaq-brown sm:text-3xl">{cafe.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-riwaq-muted">
                <MapPin className="h-4 w-4 shrink-0 text-riwaq-caramel" aria-hidden />
                {cafe.address}
              </p>
              <p className="mt-2 text-xs font-bold text-riwaq-muted">
                تقريبًا{" "}
                <span className="font-extrabold text-riwaq-caramel">
                  {approxKm.toLocaleString("ar-SA", { maximumFractionDigits: 1 })} كم
                </span>{" "}
                من مركز منطقة مرجعية ({ref.label}). للمسافة من موقعك الحقيقي:{" "}
                <Link href="/customer/map" className="text-riwaq-caramel underline-offset-2 hover:underline">
                  خريطة قريبة
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-riwaq-cream px-3 py-1.5 text-sm font-extrabold text-riwaq-brown ring-1 ring-riwaq-beige">
                <Star className="h-4 w-4 text-riwaq-caramel" aria-hidden />
                {cafe.rating.toFixed(1)} ({cafe.reviewCount.toLocaleString("ar-SA")})
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-riwaq-cream px-3 py-1.5 text-xs font-extrabold text-riwaq-muted ring-1 ring-riwaq-beige">
                <Users className="h-4 w-4" aria-hidden />
                {crowdAr(cafe.crowd)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-extrabold">
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-riwaq-beige">
              <Clock className="inline h-3.5 w-3.5 text-riwaq-caramel" aria-hidden /> {cafe.hoursLabel}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-900 ring-1 ring-emerald-200">
              {cafe.loyaltySnippet}
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/customer/reservations"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-riwaq-brown text-sm font-extrabold text-white shadow-md hover:bg-riwaq-brown/90"
            >
              <Armchair className="ms-2 h-4 w-4" />
              حجز طاولة
            </Link>
            <Link
              href="/customer/menu"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-riwaq-green/40 bg-white text-sm font-extrabold text-riwaq-green hover:bg-emerald-50"
            >
              طلب من المنيو
            </Link>
            <Link
              href="/customer/share"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-riwaq-beige bg-riwaq-cream/60 text-sm font-extrabold text-riwaq-brown hover:bg-riwaq-beige/60"
            >
              <Share2 className="ms-2 h-4 w-4" />
              مشاركة تجربة
            </Link>
          </div>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md backdrop-blur-xl lg:col-span-2">
          <h2 className="text-lg font-extrabold text-riwaq-brown">المنيو المختار</h2>
          <ul className="mt-3 space-y-2">
            {cafe.menuHighlights.map((m) => (
              <li key={m} className="rounded-2xl bg-riwaq-cream/50 px-3 py-2 text-sm font-bold text-riwaq-brown ring-1 ring-riwaq-beige/80">
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md backdrop-blur-xl">
          <h2 className="text-lg font-extrabold text-riwaq-brown">الطاولات</h2>
          <ul className="mt-3 space-y-2 text-sm font-bold text-riwaq-muted">
            {cafe.tableLabels.map((t) => (
              <li key={t} className="rounded-2xl bg-riwaq-cream/40 px-3 py-2 ring-1 ring-riwaq-beige/70">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md backdrop-blur-xl sm:p-6">
        <h2 className="text-lg font-extrabold text-riwaq-brown">العروض</h2>
        {cafe.promos.length ? (
          <ul className="mt-3 space-y-2">
            {cafe.promos.map((p) => (
              <li key={p} className="rounded-2xl bg-riwaq-caramel/10 px-3 py-2 text-sm font-extrabold text-riwaq-brown ring-1 ring-riwaq-caramel/25">
                {p}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm font-bold text-riwaq-muted">لا عروض نشطة حاليًا في البيانات التجريبية.</p>
        )}
      </section>

      {latestPromotion ? (
        <section className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-extrabold text-riwaq-brown">{latestPromotion.title || "أحدث المنتجات"}</h2>
          <p className="mt-2 text-sm font-bold text-riwaq-muted">{latestPromotion.description || "اكتشف أحدث إضافات المنيو."}</p>
          {cafe.menuHighlights.length ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {cafe.menuHighlights.slice(0, 6).map((m) => (
                <li key={m} className="rounded-2xl bg-riwaq-cream/50 px-3 py-2 text-sm font-bold text-riwaq-brown ring-1 ring-riwaq-beige/80">
                  {m}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-3">
              <DataEmptyState title="لا توجد منتجات مميزة" description="سيتم عرض أحدث المنتجات هنا عند إضافتها." />
            </div>
          )}
        </section>
      ) : null}

      {contestPromotion ? (
        <section className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-extrabold text-riwaq-brown">{contestPromotion.title || "مسابقة"}</h2>
          <p className="mt-2 text-sm font-bold text-riwaq-muted">
            {contestPromotion.description || "شارك تجربتك في المجتمع للدخول في المسابقة الحالية."}
          </p>
          <Link
            href="/customer/share"
            className="mt-4 inline-flex rounded-2xl bg-riwaq-brown px-4 py-2 text-xs font-extrabold text-white"
          >
            شارك الآن
          </Link>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-riwaq-caramel" aria-hidden />
          <h2 className="text-lg font-extrabold text-riwaq-brown">منشورات المجتمع عن هذا الكوفي</h2>
        </div>
        <div className="space-y-4">
          {posts.length ? (
            posts.map((p) => <PostCard key={p.id} post={p} showFullComments />)
          ) : (
            <p className="rounded-3xl border border-dashed border-riwaq-beige bg-riwaq-cream/40 p-6 text-center text-sm font-bold text-riwaq-muted">
              لا منشورات بعد — كن أول من يشارك تجربة.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/90 bg-white/85 p-5 shadow-md backdrop-blur-xl sm:p-6">
        <h2 className="text-lg font-extrabold text-riwaq-brown">آراء العملاء</h2>
        <ul className="mt-4 space-y-3">
          {cafe.reviews.map((r) => (
            <li key={r.author} className="rounded-2xl border border-riwaq-beige/80 bg-riwaq-cream/35 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-extrabold text-riwaq-brown">{r.author}</p>
                <span className="text-sm font-extrabold text-riwaq-caramel">{r.rating.toFixed(1)} ★</span>
              </div>
              <p className="mt-2 text-sm font-bold text-riwaq-muted">{r.text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
