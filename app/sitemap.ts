import { MetadataRoute } from "next";
import { caseStudies, industries, posts, services } from "@/content/data";
import { seoContentLastModified, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPages = Array.from(
    { length: Math.max(Math.ceil(posts.length / 9) - 1, 0) },
    (_, index) => ({
      path: `/blog/page/${index + 2}`,
      lastModified: posts[(index + 1) * 9]?.date || seoContentLastModified,
    }),
  );
  const pages = [
    "",
    "/services",
    "/industries",
    "/case-studies",
    "/blog",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
  ];
  const servicePages = Object.values(services).map((service) => `/${service.slug}`);
  const industryPages = Object.values(industries).map((industry) => `/${industry.slug}`);

  return [
    ...pages.map((path) => ({ url: `${site.url}${path}`, lastModified: seoContentLastModified })),
    ...servicePages.map((path) => ({ url: `${site.url}${path}`, lastModified: seoContentLastModified })),
    ...industryPages.map((path) => ({ url: `${site.url}${path}`, lastModified: seoContentLastModified })),
    ...blogPages.map(({ path, lastModified }) => ({ url: `${site.url}${path}`, lastModified })),
    ...caseStudies.map((study) => ({
      url: `${site.url}/case-studies/${study.slug}`,
      lastModified: seoContentLastModified,
    })),
    ...posts.map((post) => ({ url: `${site.url}/blog/${post.slug}`, lastModified: post.date })),
  ];
}
