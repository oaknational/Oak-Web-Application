import { GetStaticProps, NextPage } from "next";
import { toPlainText } from "@portabletext/react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import CMSClient, { WebinarPreview } from "../../node-lib/cms";
import BlogList from "../../components/BlogList";
import { BlogListItemProps } from "../../components/BlogList/BlogListItem";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";

export type SerializedWebinarPreview = Omit<WebinarPreview, "date"> & {
  date: string;
};

export type WebinarListingPageProps = {
  webinars: SerializedWebinarPreview[];
  isPreviewMode: boolean;
};

const WebinarListingPage: NextPage<WebinarListingPageProps> = (props) => {
  const webinars = props.webinars.map(webinarToBlogListItem);

  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background="grey1"
      isPreviewMode={props.isPreviewMode}
    >
      <Heading tag="h1" $fontSize={32}>
        Webinars
      </Heading>

      <BlogList title={"Stay up to date!"} items={webinars} titleTag={"h2"} />
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
  category: "foo",
  date: webinar.date,
  mainImage: "",
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

  return {
    props: {
      webinars,
      isPreviewMode,
    },
    revalidate: 10,
  };
};

export default WebinarListingPage;
