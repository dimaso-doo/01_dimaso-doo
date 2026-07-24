import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryPage } from "@/components/industry-page";
import { industries, IndustryKey } from "@/content/data";
import { metadata as meta } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const industryEntries = Object.entries(industries) as [IndustryKey, (typeof industries)[IndustryKey]][];

const seo: Record<IndustryKey, { title: string; description: string }> = {
  nonprofits: {
    title: "Website Support for Nonprofits",
    description: "Website maintenance and development for nonprofits, including WordPress support, donation form QA, accessibility, security, analytics, and technical SEO.",
  },
  associations: {
    title: "Website Support for Associations",
    description: "Website support for associations, including event pages, resource libraries, membership content, WordPress maintenance, analytics, and technical SEO.",
  },
  agencies: {
    title: "White-Label Web Development for Agencies",
    description: "White-label web development and website support for agencies that need dependable WordPress, landing page, maintenance, QA, and overflow delivery.",
  },
  smallBusinesses: {
    title: "Website Support for Small Businesses",
    description: "Website maintenance, redesign, form QA, performance, analytics, local SEO basics, and ongoing technical support for small businesses and growing teams.",
  },
  education: {
    title: "Website Support for Education",
    description: "Website support for schools, training providers, and education teams, including program pages, admissions forms, accessibility, analytics, and CMS support.",
  },
  healthcare: {
    title: "Healthcare Website Support",
    description: "Healthcare website maintenance and development, including service pages, form QA, content, security, performance, analytics, and technical SEO.",
  },
  ecommerce: {
    title: "Ecommerce Website Development & Support",
    description: "Ecommerce development and maintenance for WooCommerce stores, including product pages, checkout QA, integrations, tracking, performance, and technical SEO.",
  },
};

export function generateStaticParams() {
  return industryEntries.map(([, industry]) => ({ slug: industry.slug.replace("industries/", "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = industryEntries.find(([, industry]) => industry.slug === `industries/${slug}`);
  if (!entry) return {};
  const [key, industry] = entry;
  return meta(seo[key].title, seo[key].description, `/${industry.slug}`);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = industryEntries.find(([, industry]) => industry.slug === `industries/${slug}`);
  if (!entry) notFound();
  return <IndustryPage type={entry[0]}/>;
}
