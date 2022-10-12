import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { PortableText } from "@portabletext/react";

import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import CMSClient, { Webinar } from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";

export type SerializedWebinar = Omit<Webinar, "date"> & {
  date: string;
};

export type WebinarPageProps = {
  webinar: SerializedWebinar;
};

/**
 * @TODO: Remove /webinars/* from next-sitemap.config.js when built
 */

const WebinarDetailPage: NextPage<WebinarPageProps> = (props) => {
  return (
    <Layout seoProps={getSeoProps(props.webinar.seo)} $background="grey1">
      <Heading tag="h1" $font="heading-5">
        {props.webinar.title}
      </Heading>
      {props.webinar.date} <br />
      Hosted by: {props.webinar.hosts?.map((host) => host?.name).join(", ")}
      <p>
        An example of rich text via the <code>summaryPortableText</code> field
      </p>
      <div style={{ border: "1px solid red" }}>
        <PortableText
          value={props.webinar.summaryPortableText}
          components={{}}
        />
      </div>
    </Layout>
  );
};

type URLParams = { webinarSlug: string };

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const webinarResults = await CMSClient.webinars();

  const paths = webinarResults.map((webinar) => ({
    params: { webinarSlug: webinar.slug },
  }));

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<
  WebinarPageProps,
  URLParams
> = async (context) => {
  const webinarSlug = context.params?.webinarSlug as string;
  const isPreviewMode = context.preview === true;

  const webinarResult = await CMSClient.webinarBySlug(webinarSlug, {
    previewMode: isPreviewMode,
  });

  if (!webinarResult) {
    return {
      notFound: true,
    };
  }

  const webinar = {
    ...webinarResult,
    date: webinarResult.date.toISOString(),
  };

  const results: GetStaticPropsResult<WebinarPageProps> = {
    props: {
      webinar,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default WebinarDetailPage;
