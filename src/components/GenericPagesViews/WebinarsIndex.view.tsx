import { NextPage } from "next";
import { toPlainText } from "@portabletext/react";

import { PostListItemProps } from "@/components/SharedComponents/PostListItem";
import { BlogWebinarCategory, WebinarPreview } from "@/common-lib/cms-types";
import { WebinarsListingPage } from "@/common-lib/cms-types/webinarsListingPage";
import PostListing from "@/components/GenericPagesViews/PostListing.view";
import { getVideoThumbnail } from "@/components/VideoPlayer/getVideoThumbnail";
import { PAGE_SIZE } from "@/components/SharedComponents/PostList/usePostList";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";

export type SerializedWebinarPreview = Omit<WebinarPreview, "date"> & {
  date: string;
};

export type WebinarListingPageProps = {
  webinars: SerializedWebinarPreview[];
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
  pageData: WebinarsListingPage;
};

/**
 * @TODO: Remove /webinars/* from next-sitemap.config.js when built
 */

const WebinarListingPage: NextPage<WebinarListingPageProps> = (props) => {
  const { categories, categorySlug, pageData, webinars } = props;
  const paginationProps = usePagination({
    totalResults: webinars.length,
    pageSize: PAGE_SIZE,
    items: webinars,
  });
  const { paginationTitle } = paginationProps;

  return (
    <PostListing
      seo={{
        title:
          `${pageData.seo ? pageData.seo.title : "Webinars"}` + paginationTitle,
        description:
          pageData.seo?.description ||
          "Join us for one of our scheduled webinars aimed at helping teachers to get the most out of Oak.",
        canonicalURL: pageData.seo?.canonicalURL || undefined,
      }}
      pageData={pageData}
      page={"webinar-index"}
      categories={categories}
      categorySlug={categorySlug}
      postsWithCategories={props}
      posts={webinars}
      variant={{
        slug: "webinars",
        title: "Webinars",
      }}
    />
  );
};

export const webinarToPostListItem = (
  webinar: SerializedWebinarPreview,
): PostListItemProps => ({
  ...webinar,
  contentType: "webinar",
  title: webinar.title,
  summary: toPlainText(webinar.summaryPortableText)
    .trim()
    .replaceAll(/\s+/g, " "),
  titleTag: "h3",
  category: webinar.category,
  date: webinar.date,
  thumbnailUrl: getVideoThumbnail({ video: webinar.video.video.asset }),
});

export default WebinarListingPage;
