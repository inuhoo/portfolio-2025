import { defineCollection, z } from 'astro:content';

const previousWorkCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    about: z.string(),
    tags: z.array(z.string())
    // any other fields you want
  }),
});

export const collections = {
  'previous-work': previousWorkCollection,
};