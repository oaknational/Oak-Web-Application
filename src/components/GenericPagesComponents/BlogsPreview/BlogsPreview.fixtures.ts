import { BlogsPreviewProps } from "./BlogsPreview";

import { serializeDate } from "@/utils/serializeDate";
import { BlogPostPreview } from "@/common-lib/cms-types";

export const mockBlogPreview = (id: string): BlogPostPreview => ({
  id,
  title: `Blog ${id}`,
  date: new Date("2021-01-01"),
  author: {
    name: "John Doe",
    id: "123",
  },
  category: {
    title: "Category 1",
    slug: "category-1",
  },
  slug: `blog-${id}`,
  summaryPortableText: `Blog ${id} summary`,
  mainImage: {
    asset: {
      _id: "image-1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422-png",
      url: "https://cdn.sanity.io/images/cuvjke51/production/1b28197a71f5e06f82f71f328e0eb607aca8b275-632x422.png",
    },
  },
});

export const basic: BlogsPreviewProps = {
  title: "Blogs",
  label: "View all research and insights blogs",
  blogPostCategorySlug: "research-and-insights",
  backgroundColor: "bg-decorative3-very-subdued",
  blogs: [
    serializeDate(mockBlogPreview("1")),
    serializeDate(mockBlogPreview("2")),
    serializeDate(mockBlogPreview("3")),
  ],
};
