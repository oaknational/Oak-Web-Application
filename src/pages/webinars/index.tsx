import { GetStaticProps, NextPage } from "next";
import { toPlainText } from "@portabletext/react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import BlogList from "../../components/BlogList";
import { BlogListItemProps } from "../../components/BlogList/BlogListItem";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import CMSClient, { WebinarPreview } from "../../node-lib/cms";

export type WebinarListingPageProps = {
  webinars: WebinarPreview[];
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

const webinarToBlogListItem = (webinar: WebinarPreview): BlogListItemProps => ({
  contentType: "webinar",
  title: webinar.title,
  href: `/webinars/${webinar.slug}`,
  snippet: toPlainText(webinar.summaryPortableText),
  titleTag: "h3",
  category: "foo",
  date: new Date(),
});

export const getStaticProps: GetStaticProps<WebinarListingPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const webinarResults = await CMSClient.webinars({
    previewMode: isPreviewMode,
  });

  return {
    props: {
      webinars: webinarResults,
      isPreviewMode,
    },
  };
};

export default WebinarListingPage;
