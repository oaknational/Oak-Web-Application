import { NextPage } from "next";
import { toPlainText } from "@portabletext/react";

import { BlogListItemProps } from "../../components/Blog/BlogList/BlogListItem";
import {
  BlogWebinarCategory,
  WebinarPreview,
} from "../../common-lib/cms-types";
import { WebinarsListingPage } from "../../common-lib/cms-types/webinarsListingPage";
import PostListing from "../Posts/PostListing";

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
  const webinars = props.webinars.map(webinarToBlogListItem);
  const { categories, categorySlug, pageData } = props;

  return (
    <PostListing
      seo={{
        title: "Webinarss",
        description: "Webinars",
      }}
      pageData={pageData}
      categories={categories}
      categorySlug={categorySlug}
      postsWithCategories={props}
      posts={webinars}
      variant={{
        slug: "beta/webinars",
        title: "Webinars",
      }}
    />
  );
};

export const webinarToBlogListItem = (
  webinar: SerializedWebinarPreview
): BlogListItemProps => ({
  ...webinar,
  contentType: "webinar",
  title: webinar.title,
  summary: toPlainText(webinar.summaryPortableText),
  titleTag: "h3",
  category: webinar.category,
  date: webinar.date,
  mainImage: webinar.video.video.asset.playbackId,
  thumbTime: webinar.video.video.asset.thumbTime,
});

export default WebinarListingPage;
