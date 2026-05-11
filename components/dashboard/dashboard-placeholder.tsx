import type { LucideIcon } from "lucide-react";

type DashboardPlaceholderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets?: string[];
};

export function DashboardPlaceholder({
  icon: Icon,
  title,
  description,
  bullets,
}: DashboardPlaceholderProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <div className="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-lg shadow-riwaq-brown/5 backdrop-blur-md sm:p-10">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-riwaq-beige to-white text-riwaq-caramel ring-1 ring-riwaq-beige shadow-inner">
            <Icon className="h-7 w-7" aria-hidden />
          </span>
          <h2 className="mt-6 font-extrabold text-2xl text-riwaq-brown">{title}</h2>
          <p className="mt-3 text-base font-bold leading-8 text-riwaq-muted">{description}</p>
          {bullets?.length ? (
            <ul className="mt-8 w-full space-y-2 text-right">
              {bullets.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl bg-riwaq-cream/80 px-4 py-3 text-sm font-bold text-riwaq-brown ring-1 ring-riwaq-beige/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
