export const siteSettings = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    { name: "title", title: "Site title", type: "string" },
    { name: "description", title: "Default meta description", type: "text", rows: 3 },
    { name: "email", title: "Email", type: "email" },
    { name: "phone", title: "Phone", type: "string" },
    { name: "linkedinUrl", title: "LinkedIn URL", type: "url" },
    { name: "serbiaOffice", title: "Serbia office", type: "string" },
    { name: "usOffice", title: "US office", type: "string" },
  ],
};
