export const site = {
  name: "Dimaso",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dimaso.co",
  email: "office@dimaso.co",
  phone: "+381 61 137 5150",
  description:
    "Ongoing website support, maintenance, development, integrations, technical SEO, QA, analytics, and platform care for business-critical digital platforms.",
};

export const social = {
  title: "Dimaso — Website Support, Maintenance & Development",
  description: site.description,
  image: "https://dimaso.co/og-dimaso.png",
  imageAlt: "Dimaso — Website Support, Maintenance & Development",
};

const socialImage={url:social.image,secureUrl:social.image,type:"image/png",width:1200,height:630,alt:social.imageAlt};

export function metadata(title: string, description: string, path = "") {
  const url = `${site.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, type: "website" as const, images:[socialImage] },
    twitter: { card: "summary_large_image" as const, title, description, images:[socialImage] },
  };
}
