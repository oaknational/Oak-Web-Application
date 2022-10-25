import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { toPlainText } from "@portabletext/react";

import CMSClient, { WebinarPreview } from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";
import { BlogListItemProps } from "../../components/Blog/BlogList/BlogListItem";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import BlogList from "../../components/Blog/BlogList";

export type SerializedWebinarPreview = Omit<WebinarPreview, "date"> & {
  date: string;
};

export type WebinarListingPageProps = {
  webinars: SerializedWebinarPreview[];
};

/**
 * @TODO: Remove /webinars/* from next-sitemap.config.js when built
 */

const WebinarListingPage: NextPage<WebinarListingPageProps> = (props) => {
  const webinars = props.webinars.map(webinarToBlogListItem);

  return (
    <Layout
      seoProps={getSeoProps({
        title: "Webinars",
        description: "Webinars",
      })}
      $background="grey1"
    >
      <Heading tag="h1" $font="heading-4">
        Webinars
      </Heading>

      <BlogList items={webinars} />
    </Layout>
  );
};

export const webinarToBlogListItem = (
  webinar: SerializedWebinarPreview
): BlogListItemProps => ({
  contentType: "webinar",
  title: webinar.title,
  href: `/webinars/${webinar.slug}`,
  snippet: toPlainText(webinar.summaryPortableText),
  titleTag: "h3",
  category: webinar.category,
  date: webinar.date,
  mainImage: null,
});

export const serializeDate = <T extends { date: Date }>(
  item: T
): T & { date: string } => ({
  ...item,
  date: item.date.toISOString(),
});

export const getStaticProps: GetStaticProps<WebinarListingPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const webinarResults = await CMSClient.webinars({
    previewMode: isPreviewMode,
  });

  const webinars = webinarResults.map(serializeDate);

  const results: GetStaticPropsResult<WebinarListingPageProps> = {
    props: {
      webinars,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default WebinarListingPage;
