export const site = {
  name: "Dimaso",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dimaso.co",
  email: "office@dimaso.co",
  phone: "+381 61 137 5150",
  description:
    "Senior website maintenance, web development, and web design partner for US and international businesses.",
};

export function metadata(title: string, description: string, path = "") {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: "website" as const },
    twitter: { card: "summary_large_image" as const, title, description },
  };
}
