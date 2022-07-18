import { GetStaticProps, NextPage } from "next";
import { toPlainText } from "@portabletext/react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import BlogList from "../../components/BlogList";
import { BlogListItemProps } from "../../components/BlogList/BlogListItem";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import CMSClient, { WebinarPreview } from "../../node-lib/cms";

type WebinarListingPageProps = {
  webinars: Array<BlogListItemProps>;
};

const WebinarListingPage: NextPage<WebinarListingPageProps> = (props) => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} background="grey1">
      <Heading tag="h1" fontSize={32}>
        Webinars
      </Heading>

      <BlogList
        title={"Stay up to date!"}
        items={props.webinars}
        titleTag={"h2"}
      />
    </Layout>
  );
};

const webinarToBlogListItem = (webinar: WebinarPreview): BlogListItemProps => ({
  contentType: "webinar",
  title: webinar.title,
  href: `/webinars/${webinar.slug}`,
  snippet: toPlainText(webinar.summaryPortableText),
  titleTag: "h3",
});

export const getStaticProps: GetStaticProps<
  WebinarListingPageProps
> = async () => {
  const webinarResults = await CMSClient.getWebinars();

  const webinars = webinarResults.map(webinarToBlogListItem);

  return {
    props: {
      webinars,
    },
  };
};

export default WebinarListingPage;
