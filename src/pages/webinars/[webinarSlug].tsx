import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useEffect } from "react";
import { uniqBy } from "lodash/fp";

import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import Layout from "../../components/Layout";
import CMSClient from "../../node-lib/cms";
import { TeamMemberPreview, Webinar } from "../../common-lib/cms-types";
import { getBlogWebinarPostBreadcrumbs } from "../../components/Breadcrumbs/getBreadcrumbs";
import Box from "../../components/Box";
import { decorateWithIsr } from "../../node-lib/isr";
import BlogPortableText from "../../components/Blog/BlogPortableText/BlogPortableText";
import Flex from "../../components/Flex";
import BlogWebinarsIndexLayout from "../../components/Blog/BlogWebinarsIndexLayout";
import WebinarVideo from "../../components/Blog/WebinarVideo";
import { BlogJsonLd } from "../../browser-lib/seo/getJsonLd";
import { getVideoThumbnail } from "../../components/VideoPlayer/getVideoThumbnail";
import useAnalytics from "../../context/Analytics/useAnalytics";

export type SerializedWebinar = Omit<Webinar, "date"> & {
  date: string;
  author: TeamMemberPreview | undefined;
};

export type WebinarPageProps = {
  webinar: SerializedWebinar;
  categories: { title: string; slug: string }[];
};

const WebinarDetailPage: NextPage<WebinarPageProps> = (props) => {
  const { webinar, categories } = props;
  const { track } = useAnalytics();
  useEffect(() => {
    track.webinarPageViewed({
      webinarTitle: webinar.title,
      webinarCategory: webinar.category.title,
      videoAvailable: Boolean(webinar.video),
    });
  }, [track, webinar]);

  return (
    <Layout
      seoProps={getSeoProps({
        ...props.webinar.seo,
        title: webinar.seo?.title || webinar.title,
        description: webinar.seo?.description,
        imageUrl: getVideoThumbnail({
          video: webinar.video.video.asset,
          width: 1600,
          height: 900,
        }),
      })}
      $background="white"
      breadcrumbs={getBlogWebinarPostBreadcrumbs(
        categories,
        webinar,
        "webinars",
        "Webinars"
      )}
    >
      <BlogWebinarsIndexLayout content={props}>
        <Flex $position={"relative"} $mt={56}>
          <WebinarVideo webinar={webinar} />
        </Flex>
        <Box $mt={[48]}>
          <BlogPortableText portableText={webinar.summaryPortableText} />
        </Box>
      </BlogWebinarsIndexLayout>
      <BlogJsonLd blog={props.webinar} />
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

  const webinarResults = await CMSClient.webinars();

  const categories = uniqBy(
    "title",
    webinarResults.map((w) => w.category)
  ).sort((a, b) => (a.title < b.title ? -1 : 1));

  const webinar: SerializedWebinar = {
    ...webinarResult,
    date: webinarResult.date.toISOString(),
    author: webinarResult.hosts[0], // make the first host equivalent to a blog author
  };

  const results: GetStaticPropsResult<WebinarPageProps> = {
    props: {
      webinar,
      categories,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default WebinarDetailPage;
