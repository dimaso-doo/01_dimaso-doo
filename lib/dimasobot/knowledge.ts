import { blogContent, type BlogInline } from "@/content/blog-content";
import { caseStudies, homeFaq, industries, industryFaqs, posts, serviceFaqs, services } from "@/content/data";
import { site } from "@/lib/site";

export type DimasoKnowledgeChunk = {
  id: string;
  type: "core" | "service" | "industry" | "faq" | "case-study" | "blog";
  title: string;
  url: string;
  text: string;
};

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function chunk(id: string, type: DimasoKnowledgeChunk["type"], title: string, url: string, parts: Array<string | undefined | null>) {
  return {
    id,
    type,
    title,
    url,
    text: cleanText(parts.filter(Boolean).join(" ")),
  };
}

function inlineText(content: BlogInline[]) {
  return content.map((item) => typeof item === "string" ? item : item.text).join("");
}

function blogSections(slug: string) {
  const blocks = blogContent[slug] || [];
  const sections: Array<{ heading: string; text: string[] }> = [];
  let current: { heading: string; text: string[] } | null = null;

  for (const block of blocks) {
    if (block.type === "h2") {
      current = { heading: block.text, text: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { heading: "Article intro", text: [] };
      sections.push(current);
    }
    if (block.type === "h3") current.text.push(block.text);
    if (block.type === "p") current.text.push(inlineText(block.content));
  }

  return sections;
}

export function buildDimasoKnowledgeChunks(): DimasoKnowledgeChunk[] {
  const chunks: DimasoKnowledgeChunk[] = [
    chunk("core:overview", "core", "Dimaso overview", "/", [
      `${site.name} provides ${site.description}`,
      "Dimaso is a senior website maintenance, web development, web design, WordPress support, technical SEO, AI website visibility, hosting, security, analytics, and long-term website care team from Novi Sad, Serbia.",
      "Dimaso works with US, European, Serbian, and international organizations.",
    ]),
    chunk("core:us-presence", "core", "Dimaso US presence", "/about", [
      "Dimaso has a US presence through Dimaso US LLC in Sheridan, Wyoming, United States.",
      "Dimaso also has Serbia and Europe presence through Dimaso RS in Novi Sad, Serbia.",
      "This helps US and international clients work with Dimaso as a practical remote website partner.",
    ]),
    ...homeFaq.map(([question, answer], index) => chunk(`faq:home:${index}`, "faq", question, "/", [question, answer])),
  ];

  for (const [key, service] of Object.entries(services)) {
    chunks.push(chunk(`service:${key}:overview`, "service", service.title, `/${service.slug}`, [
      service.label,
      service.serviceType,
      service.eyebrow,
      service.intro,
      service.coverCopy,
      service.proofCopy,
      `Common requests: ${service.commonRequests.join("; ")}`,
      `Keywords: ${service.keywords.join("; ")}`,
      `Problems: ${service.problems.join("; ")}`,
      `Process: ${service.process.join("; ")}`,
    ]));

    for (const [index, [question, answer]] of (serviceFaqs[key as keyof typeof serviceFaqs] || []).entries()) {
      chunks.push(chunk(`faq:service:${key}:${index}`, "faq", question, `/${service.slug}`, [question, answer]));
    }
  }

  for (const [key, industry] of Object.entries(industries)) {
    chunks.push(chunk(`industry:${key}:overview`, "industry", industry.title, `/${industry.slug}`, [
      industry.label,
      industry.intro,
      industry.who,
      `Problems: ${industry.problems.join("; ")}`,
      `Deliverables: ${industry.deliverables.join("; ")}`,
      industry.deliverablesCopy,
      industry.whyCopy,
      `Common requests: ${industry.commonRequests.join("; ")}`,
      `Related services: ${industry.relatedServices.join("; ")}`,
    ]));

    for (const [index, [question, answer]] of (industryFaqs[key as keyof typeof industryFaqs] || []).entries()) {
      chunks.push(chunk(`faq:industry:${key}:${index}`, "faq", question, `/${industry.slug}`, [question, answer]));
    }
  }

  for (const caseStudy of caseStudies) {
    chunks.push(chunk(`case-study:${caseStudy.slug}`, "case-study", caseStudy.name, `/case-studies/${caseStudy.slug}`, [
      caseStudy.category,
      caseStudy.summary,
      caseStudy.overview,
      caseStudy.problem,
      caseStudy.solution,
      caseStudy.workSummary,
      `Work: ${caseStudy.work.join("; ")}`,
      caseStudy.result,
      caseStudy.services,
      `Service tags: ${caseStudy.serviceTags.join("; ")}`,
      `Technologies: ${caseStudy.technologies.join("; ")}`,
    ]));
  }

  for (const post of posts) {
    chunks.push(chunk(`blog:${post.slug}:summary`, "blog", post.title, `/blog/${post.slug}`, [
      post.category,
      post.date,
      post.excerpt,
      post.description,
    ]));

    for (const [index, section] of blogSections(post.slug).entries()) {
      chunks.push(chunk(`blog:${post.slug}:section:${index}`, "blog", `${post.title}: ${section.heading}`, `/blog/${post.slug}`, [
        post.category,
        section.heading,
        ...section.text,
      ]));
    }
  }

  return chunks.filter((item) => item.text.length > 40);
}
