import { NextPage } from "next";
import { toPlainText } from "@portabletext/react";

import useTrackPageView from "../../hooks/useTrackPageView";
import { PostListItemProps } from "../../components/Posts/PostList/PostListItem";
import {
  BlogWebinarCategory,
  WebinarPreview,
} from "../../common-lib/cms-types";
import { WebinarsListingPage } from "../../common-lib/cms-types/webinarsListingPage";
import PostListing from "../Posts/PostListing";
import { getVideoThumbnail } from "../VideoPlayer/getVideoThumbnail";

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
  useTrackPageView({ pageTitle: "Webinar" });

  return (
    <PostListing
      seo={{
        title: pageData.seo?.title || "Webinars",
        description:
          pageData.seo?.description ||
          "Join us for one of our scheduled webinars aimed at helping teachers to get the most out of Oak.",
        canonicalURL: pageData.seo?.canonicalURL || undefined,
      }}
      pageData={pageData}
      page={"webinars-index"}
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
  webinar: SerializedWebinarPreview
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
