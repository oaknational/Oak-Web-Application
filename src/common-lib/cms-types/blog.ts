import * as z from "zod";

import {
  slugSchema,
  documentSchema,
  dateSchema,
  blogWebinarCategorySchema,
  imageSchema,
  seoSchema,
} from "./base";
import { portableTextSchema } from "./portableText";
import { teamMemberPreviewSchema } from "./teamMember";

export const blogPostSchema = z
  .object({
    title: z.string(),
    slug: slugSchema,
    date: dateSchema,
    author: teamMemberPreviewSchema,
    /**
     * Blogs are the one entity that doesn't use portable text for its Summary.
     * However, it is named portable text for ease of interface with the
     * <SummaryCard /> component.
     */
    summaryPortableText: z.string().min(1),
    contentPortableText: portableTextSchema,
    category: blogWebinarCategorySchema,
    mainImage: imageSchema,
    seo: seoSchema.nullish(),
  })
  .merge(documentSchema);

export type BlogPost = z.infer<typeof blogPostSchema>;

export const blogPostPreviewSchema = blogPostSchema.pick({
  id: true,
  title: true,
  slug: true,
  summaryPortableText: true,
  author: true,
  category: true,
  date: true,
  mainImage: true,
  seo: true,
});

export type BlogPostPreview = z.infer<typeof blogPostPreviewSchema>;
