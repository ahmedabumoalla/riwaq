/**
 * مساعدات طبقة البيانات: Supabase أولًا ثم fallback إلى mock عند الخطأ أو غياب الجداول.
 */

export type DataSource = "supabase" | "mock";

export type DataResult<T> = {
  data: T;
  source: DataSource;
  /** رسالة تشخيصية — لا تعرض للمستخدم النهائي */
  error?: string;
};

export function logDataFallback(scope: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.warn(`[riwaq:data:${scope}] fallback to mock —`, msg);
}

/**
 * ينفّذ دالة Supabase؛ عند الفشل أو null يعيد mock.
 */
export async function withMockFallback<T>(
  scope: string,
  mock: T,
  fetcher: () => Promise<{ data: T | null; error: unknown }>,
): Promise<DataResult<T>> {
  try {
    const { data, error } = await fetcher();
    if (error) {
      logDataFallback(scope, error);
      return { data: mock, source: "mock", error: String(error) };
    }
    if (data === null || data === undefined) {
      return { data: mock, source: "mock" };
    }
    return { data, source: "supabase" };
  } catch (e) {
    logDataFallback(scope, e);
    return {
      data: mock,
      source: "mock",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
