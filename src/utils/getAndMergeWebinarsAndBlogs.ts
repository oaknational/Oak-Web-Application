import CMSClient from "@/node-lib/cms";
import { sortByDate } from "@/pages";
import { serializeDate } from "@/utils/serializeDate";

export const getAndMergeWebinarsAndBlogs = async (
  isPreviewMode: boolean,
  limit?: number,
  categorySlug?: string,
) => {
  const blogResults = await CMSClient.blogPosts({
    previewMode: isPreviewMode,
    limit: limit,
  });

  let blogPosts = blogResults.map((blog) => ({
    ...blog,
    type: "blog-post" as const,
  }));

  if (categorySlug) {
    blogPosts = blogPosts.filter((blog) => blog.category.slug === categorySlug);
  }

  const webinarResults = await CMSClient.webinars({
    previewMode: isPreviewMode,
    limit: limit,
  });

  let webinars = webinarResults
    .map((webinar) => ({
      ...webinar,
      type: "webinar" as const,
    }))
    .filter((webinar) => webinar.date.getTime() < new Date().getTime());

  if (categorySlug) {
    webinars = webinars.filter(
      (webinar) => webinar.category.slug === categorySlug,
    );
  }

  return [...blogPosts, ...webinars]
    .sort(sortByDate)
    .slice(0, 4)
    .map(serializeDate);
};
