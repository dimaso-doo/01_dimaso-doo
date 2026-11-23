export const productionUrl = "https://dimaso.co";
export const organizationId = `${productionUrl}/#organization`;
export const websiteId = `${productionUrl}/#website`;
export const seoContentLastModified = "2026-11-22";

export const site = {
  name: "Dimaso",
  url: productionUrl,
  email: "office@dimaso.co",
  phone: "+381 60 159 31 87",
  description:
    "Website design, development, and ongoing support. Based in Novi Sad, Serbia, working with clients worldwide.",
};

export const social = {
  title: "Website Maintenance & Web Development | Dimaso",
  description: "Website maintenance, WordPress support, custom web development, and technical SEO for US and international organizations.",
  image: `${productionUrl}/og-dimaso.jpg`,
  imageAlt: "Dimaso | Website Support, Maintenance & Development",
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
    "WordPress Maintenance and Support",
    "Custom Web Development",
    "Technical SEO Audits and Implementation",
    "Web Design and Website Redesign",
    "AI Website and Workflow Support",
    "AI Application Development",
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
