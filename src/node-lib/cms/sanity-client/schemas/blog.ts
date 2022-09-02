import * as z from "zod";

import {
  slugSchema,
  documentSchema,
  dateSchema,
  blogWebinarCategorySchema,
  imageSchema,
} from "./base";
import { portableTextSchema } from "./portableText";
import { teamMemberPreviewSchema } from "./teamMember";

export const blogPostSchema = z
  .object({
    title: z.string(),
    slug: slugSchema,
    date: dateSchema,
    author: teamMemberPreviewSchema,
    summary: z.string().nonempty(),
    contentPortableText: portableTextSchema,
    category: blogWebinarCategorySchema,
    mainImage: imageSchema,
  })
  .merge(documentSchema);

export type BlogPost = z.infer<typeof blogPostSchema>;

export const blogPostPreviewSchema = blogPostSchema.pick({
  id: true,
  title: true,
  slug: true,
  summary: true,
  author: true,
  category: true,
  date: true,
  mainImage: true,
});

export type BlogPostPreview = z.infer<typeof blogPostPreviewSchema>;
