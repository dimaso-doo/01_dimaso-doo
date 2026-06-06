export const post = {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: "required" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: "required" },
    { name: "category", title: "Category", type: "string" },
    { name: "date", title: "Publish date", type: "date" },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    { name: "service", title: "Related service URL", type: "string" },
    { name: "image", title: "Hero image", type: "image", options: { hotspot: true } },
    { name: "body", title: "Body", type: "array", of: [{ type: "block" }] },
  ],
};
