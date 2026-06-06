export const testimonial = {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    { name: "name", title: "Client / project name", type: "string", validation: "required" },
    { name: "category", title: "Category", type: "string" },
    { name: "scope", title: "Scope", type: "string" },
    { name: "quote", title: "Quote", type: "text", rows: 5 },
    { name: "person", title: "Person", type: "string" },
    { name: "role", title: "Role", type: "string" },
    { name: "url", title: "Website URL", type: "url" },
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
    { name: "alt", title: "Image alt text", type: "string" },
    { name: "youtubeId", title: "YouTube video ID", type: "string" },
    { name: "initials", title: "Fallback initials", type: "string" },
    { name: "orderRank", title: "Sort order", type: "number" },
  ],
};
