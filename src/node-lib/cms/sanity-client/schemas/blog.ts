import * as z from "zod";

import {
  slugSchema,
  documentSchema,
  portableTextSchema,
  dateSchema,
  blogWebinarCategory,
} from "./base";
import { teamMemberPreviewSchema } from "./teamMember";

export const blogPostSchema = z
  .object({
    title: z.string(),
    slug: slugSchema,
    date: dateSchema,
    author: teamMemberPreviewSchema,
    contentPortableText: portableTextSchema,
    category: blogWebinarCategory,
  })
  .merge(documentSchema);

export type BlogPost = z.infer<typeof blogPostSchema>;

export const blogPostPreviewSchema = blogPostSchema.pick({
  id: true,
  title: true,
  slug: true,
  contentPortableText: true,
  category: true,
  date: true,
});

export type BlogPostPreview = z.infer<typeof blogPostPreviewSchema>;
