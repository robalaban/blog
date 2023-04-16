import { z, defineCollection } from 'astro:content';
const blogCollection = defineCollection({
  schema: z.object({
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    title: z.string({
      required_error: "Required frontmatter missing: title",
      invalid_type_error: "title must be a string",
    }),
    excerpt: z.string({
      required_error: "Required frontmatter missing: excerpt",
      invalid_type_error: "excerpt must be a string",
    }),
    date: z.date({
      required_error: "Required frontmatter missing: date",
      invalid_type_error:
        "date must be written in yyyy-mm-dd format without quotes: For example, Jan 22, 2000 should be written as 2000-01-22.",
    }),
  }),
});
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'blog': blogCollection,
};
