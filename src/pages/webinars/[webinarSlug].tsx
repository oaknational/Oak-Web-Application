import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import sanityGraphqlApi from "../../node-lib/sanity-graphql";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import { Webinar } from "../../node-lib/sanity-graphql/generated/sdk";
import { PortableText, toPlainText } from "@portabletext/react";

type WebinarPageProps = {
  webinar: Webinar;
};

const WebinarDetailPage: NextPage<WebinarPageProps> = (props) => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} background="grey1">
      <Heading tag="h1">{props.webinar.title}</Heading>

      {props.webinar.date} <br />

      Hosted by: {props.webinar.hosts?.map(host => host?.name).join(', ')}

      <p>An example of rich text via the <code>summaryPortableText</code> field</p>
      <div style={{ border: "1px solid red" }}>
        <PortableText
          value={props.webinar.summaryPortableText}
          components={{
            list: {
              bullet: ({ children }) => <ul>{children}</ul>,
              number: ({ children }) => <ol>{children}</ol>,
            },
            listItem: {
              bullet: ({ children }) => <li>{children}</li>,
            },
          }}
        />
      </div>
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
