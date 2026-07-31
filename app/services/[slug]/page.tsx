import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/service-page";
import { services, ServiceKey } from "@/content/data";
import { metadata as meta } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const serviceEntries = Object.entries(services) as [ServiceKey, (typeof services)[ServiceKey]][];

export function generateStaticParams() {
  return serviceEntries.map(([, service]) => ({ slug: service.slug.replace("services/", "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = serviceEntries.find(([, service]) => service.slug === `services/${slug}`);
  if (!entry) return {};
  const [key, service] = entry;
  const titles: Record<ServiceKey, string> = {
    maintenance: "Website Maintenance Services",
    development: "Custom Web Development Services",
    design: "Web Design & Website Redesign Services",
    wordpress: "WordPress Maintenance & Support Services",
    technicalSeo: "Technical SEO Audit & Implementation Services",
    aiSupport: "AI Website & Workflow Support",
  };
  const descriptions: Record<ServiceKey, string> = {
    maintenance: "Dimaso provides ongoing website maintenance, updates, bug fixes, backups, security, performance, technical SEO, analytics, and monthly support.",
    development: "Custom web development services for WordPress, Laravel, custom CMS, ecommerce, API integrations, migrations, and business-critical web platforms.",
    design: "Dimaso designs business websites, UX/UI, responsive pages, redesigns, landing pages, and conversion-focused website experiences.",
    wordpress: "Ongoing WordPress maintenance and support for safer updates, plugin and theme fixes, Elementor, WooCommerce, security, backups, performance, and migrations.",
    technicalSeo: "Technical SEO audits and implementation for crawlability, indexing, metadata, schema, internal links, Core Web Vitals, GA4, GSC, and migrations.",
    aiSupport: "AI website and workflow support for search visibility, structured content, Schema.org, llms.txt, automation, reporting, and clearer AI discovery.",
  };
  return meta(titles[key], descriptions[key], `/${service.slug}`);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = serviceEntries.find(([, service]) => service.slug === `services/${slug}`);
  if (!entry) notFound();
  return <ServicePage type={entry[0]}/>;
}
