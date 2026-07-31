export const productionUrl = "https://dimaso.co";
export const organizationId = `${productionUrl}/#organization`;
export const websiteId = `${productionUrl}/#website`;
export const seoContentLastModified = "2026-07-31";

export const site = {
  name: "Dimaso",
  url: productionUrl,
  email: "office@dimaso.co",
  phone: "+381 61 137 5150",
  description:
    "Website maintenance, web development, web design, WordPress support, technical SEO, AI website visibility, hosting, security, analytics, and long-term website care.",
};

export const social = {
  title: "Dimaso | Website Maintenance & Web Development",
  description: "Dimaso provides website maintenance, web development, WordPress support, technical SEO, and AI website support for US and international organizations.",
  image: `${productionUrl}/og-dimaso.jpg`,
  imageAlt: "Dimaso — Website Support, Maintenance & Development",
  linkedin: "https://www.linkedin.com/company/dimaso.co/",
};

export const organizationSchema = {
  "@type": "Organization",
  "@id": organizationId,
  name: site.name,
  url: site.url,
  logo: `${site.url}/dimaso-logo-accent.svg`,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Novi Sad",
    addressCountry: "RS",
  },
  sameAs: [social.linkedin],
  areaServed: ["United States", "Europe", "Serbia", "International"],
  knowsAbout: [
    "Website Maintenance",
    "Web Development",
    "Web Design",
    "WordPress Support",
    "Technical SEO",
    "AI Website and Workflow Support",
    "CMS Support",
    "Hosting, Security, and Backups",
    "Quality Assurance and Testing",
  ],
};

const socialImage={url:social.image,secureUrl:social.image,type:"image/jpeg",width:1200,height:630,alt:social.imageAlt};

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
