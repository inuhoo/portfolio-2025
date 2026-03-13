import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const previousWorkCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/previous-work" }),
  schema: z.object({
    title: z.string(),
    about: z.string(),
    tags: z.array(z.string()).optional()
  }),
});

export const collections = {
  'previous-work': previousWorkCollection,
};