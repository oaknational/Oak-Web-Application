import { GetStaticProps, NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import sanityGraphqlApi from "../../node-lib/sanity-graphql";
import { Webinar } from "../../node-lib/sanity-graphql/generated/sdk";
import Layout from "../../components/Layout";
import BlogList from "../../components/BlogList";
import { BlogListItemProps } from "../../components/BlogList/BlogListItem";
import { Heading } from "../../components/Typography";
import { toPlainText } from "@portabletext/react";

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

const webinarToBlogListItem = (webinar: Webinar): BlogListItemProps => ({
  contentType: "webinar",
  title: webinar.title,
  href: `/webinars/${webinar.slug?.current}`,
  snippet: toPlainText(webinar.summaryPortableText),
  titleTag: "h3",
});

export const getStaticProps: GetStaticProps<
  WebinarListingPageProps
> = async () => {
  const webinarResults = await sanityGraphqlApi.allWebinars();

  const webinars = webinarResults.allWebinar
    // @TODO: Could we use zod
    .filter((webinar) => typeof webinar.slug?.current === "string")
    .map(webinarToBlogListItem);

  return {
    props: {
      webinars,
    },
  };
};

export default WebinarListingPage;
