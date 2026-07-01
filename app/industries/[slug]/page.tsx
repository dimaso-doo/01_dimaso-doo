import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryPage } from "@/components/industry-page";
import { industries, IndustryKey } from "@/content/data";
import { metadata as meta } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const industryEntries = Object.entries(industries) as [IndustryKey, (typeof industries)[IndustryKey]][];

export function generateStaticParams() {
  return industryEntries.map(([, industry]) => ({ slug: industry.slug.replace("industries/", "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = industryEntries.find(([, industry]) => industry.slug === `industries/${slug}`);
  if (!entry) return {};
  const [, industry] = entry;
  return meta(`${industry.title} | Dimaso`, industry.intro, `/${industry.slug}`);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = industryEntries.find(([, industry]) => industry.slug === `industries/${slug}`);
  if (!entry) notFound();
  return <IndustryPage type={entry[0]}/>;
}
