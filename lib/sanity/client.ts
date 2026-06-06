type SanityParam = string | number | boolean | null;

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19",
  token: process.env.SANITY_API_READ_TOKEN,
};

export const isSanityConfigured = Boolean(sanityConfig.projectId && sanityConfig.dataset);

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
}: {
  query: string;
  params?: Record<string, SanityParam>;
  revalidate?: number;
}): Promise<T | null> {
  if (!isSanityConfigured || !sanityConfig.projectId) return null;

  const search = new URLSearchParams({ query });
  Object.entries(params).forEach(([key, value]) => {
    search.set(`$${key}`, JSON.stringify(value));
  });

  const url = `https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/query/${sanityConfig.dataset}?${search.toString()}`;
  const headers: HeadersInit = sanityConfig.token ? { Authorization: `Bearer ${sanityConfig.token}` } : {};
  const response = await fetch(url, { headers, next: { revalidate } });

  if (!response.ok) return null;
  const payload = (await response.json()) as { result?: T };
  return payload.result ?? null;
}
