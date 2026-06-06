export const teamMember = {
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: "required" },
    { name: "role", title: "Role", type: "string" },
    { name: "experience", title: "Experience line", type: "string" },
    { name: "bio", title: "Bio", type: "text", rows: 4 },
    { name: "image", title: "Portrait", type: "image", options: { hotspot: true } },
    { name: "orderRank", title: "Sort order", type: "number" },
  ],
};
