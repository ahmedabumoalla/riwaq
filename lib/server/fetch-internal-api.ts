import "server-only";

import { headers } from "next/headers";

/** طلب داخلي من RSC نحو Route Handlers مع تمرير الكوكيز. */
export async function fetchInternalApi(path: string): Promise<Response> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");
  const url = `${proto}://${host}${path}`;
  return fetch(url, {
    cache: "no-store",
    headers: { cookie: h.get("cookie") ?? "" },
  });
}
