import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PortableText } from "@portabletext/react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import CMSClient, { Webinar } from "../../node-lib/cms";

export type SerializedWebinar = Omit<Webinar, "date"> & {
  date: string;
};

export type WebinarPageProps = {
  webinar: SerializedWebinar;
  isPreviewMode: boolean;
};

const WebinarDetailPage: NextPage<WebinarPageProps> = (props) => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background="grey1"
      isPreviewMode={props.isPreviewMode}
    >
      <Heading tag="h1" $fontSize={24}>
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

  return {
    props: {
      webinar,
      isPreviewMode,
    },
  };
};

export default WebinarDetailPage;
