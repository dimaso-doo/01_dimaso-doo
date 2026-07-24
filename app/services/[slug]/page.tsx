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
    development: "Web Development Services",
    design: "Web Design Services",
    wordpress: "WordPress Support Services",
    technicalSeo: "Technical SEO Services",
    aiSupport: "AI Website & Workflow Support",
  };
  const descriptions: Record<ServiceKey, string> = {
    maintenance: "Dimaso provides ongoing website maintenance, updates, bug fixes, backups, security, performance, technical SEO, analytics, and monthly support.",
    development: "Dimaso provides WordPress, Laravel, custom CMS, ecommerce, integration, migration, and scalable web development services for US and international clients.",
    design: "Dimaso designs business websites, UX/UI, responsive pages, redesigns, landing pages, and conversion-focused website experiences.",
    wordpress: "WordPress maintenance, plugin and theme updates, Elementor support, custom fixes, security, backups, performance, migrations, and WooCommerce support.",
    technicalSeo: "Dimaso provides technical SEO audits and implementation for indexing, metadata, schema, sitemaps, robots.txt, internal linking, performance, GA4, and GSC.",
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
