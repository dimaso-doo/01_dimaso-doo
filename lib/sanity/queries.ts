import { caseStudies, posts } from "@/content/data";
import { testimonials } from "@/content/testimonials";
import { sanityFetch } from "./client";

export const postListQuery = `*[_type == "post"] | order(date desc) {
  slug,
  title,
  category,
  date,
  excerpt,
  service,
  "image": image.asset->url
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  slug,
  title,
  category,
  date,
  excerpt,
  service,
  body,
  "image": image.asset->url
}`;

export const caseStudyListQuery = `*[_type == "caseStudy"] | order(orderRank asc, name asc) {
  slug,
  name,
  category,
  website,
  summary,
  services,
  "image": image.asset->url
}`;

export const caseStudyBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0] {
  ...
}`;

export const testimonialListQuery = `*[_type == "testimonial"] | order(orderRank asc, name asc) {
  name,
  category,
  scope,
  quote,
  person,
  role,
  url,
  youtubeId,
  initials,
  "image": image.asset->url,
  alt
}`;

export async function getPosts() {
  return (await sanityFetch<typeof posts>({ query: postListQuery, revalidate: 300 })) ?? posts;
}

export async function getPostBySlug(slug: string) {
  return (await sanityFetch<(typeof posts)[number]>({ query: postBySlugQuery, params: { slug }, revalidate: 300 })) ?? posts.find(post => post.slug === slug) ?? null;
}

export async function getCaseStudies() {
  return (await sanityFetch<typeof caseStudies>({ query: caseStudyListQuery, revalidate: 300 })) ?? caseStudies;
}

export async function getCaseStudyBySlug(slug: string) {
  return (await sanityFetch<(typeof caseStudies)[number]>({ query: caseStudyBySlugQuery, params: { slug }, revalidate: 300 })) ?? caseStudies.find(study => study.slug === slug) ?? null;
}

export async function getTestimonials() {
  return (await sanityFetch<typeof testimonials>({ query: testimonialListQuery, revalidate: 300 })) ?? testimonials;
}
