import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import sanityGraphqlApi from "../../node-lib/sanity-graphql";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import { Webinar } from "../../node-lib/sanity-graphql/generated/sdk";

type WebinarPageProps = {
  webinar: Webinar;
};

const WebinarDetailPage: NextPage<WebinarPageProps> = (props) => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} background="grey1">
      <Heading tag="h1">{props.webinar.title}</Heading>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const webinarResults = await sanityGraphqlApi.allWebinars();

  const paths = webinarResults.allWebinar
    // @TODO: Zod for better filtering?
    .filter((webinar) => typeof webinar.slug?.current === "string")
    .map((webinar) => ({
      params: { webinarSlug: webinar.slug.current },
    }));

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<WebinarPageProps> = async (
  context
) => {
  const webinarSlug = context?.params?.webinarSlug as string;
  const webinarResult = await sanityGraphqlApi.webinarBySlug({
    slug: webinarSlug,
  });

  const webinar = webinarResult.allWebinar[0];

  if (!webinar) {
    // @TODO: 404 logic (although should be handled by getStaticPaths)
    return { props: {} };
  }

  return {
    props: {
      webinar: webinar,
    },
  };
};

export default WebinarDetailPage;
