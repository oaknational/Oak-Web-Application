import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useEffect } from "react";
import { uniqBy } from "lodash/fp";
import { OakBox, OakFlex } from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/Layout";
import CMSClient from "@/node-lib/cms";
import { TeamMemberPreview, Webinar } from "@/common-lib/cms-types";
import { getBlogWebinarPostBreadcrumbs } from "@/components/SharedComponents/Breadcrumbs/getBreadcrumbs";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import BlogPortableText from "@/components/GenericPagesComponents/PostPortableText/PostPortableText";
import WebinarVideo from "@/components/GenericPagesComponents/WebinarVideo";
import { BlogJsonLd } from "@/browser-lib/seo/getJsonLd";
import { getVideoThumbnail } from "@/components/SharedComponents/VideoPlayer/getVideoThumbnail";
import useAnalytics from "@/context/Analytics/useAnalytics";
import PostSingleLayout from "@/components/SharedComponents/PostSingleLayout";
import getPageProps from "@/node-lib/getPageProps";

export type SerializedWebinar = Omit<Webinar, "date"> & {
  date: string;
  author: TeamMemberPreview | undefined;
};

export type WebinarSinglePageProps = {
  webinar: SerializedWebinar;
  categories: { title: string; slug: string }[];
};

const WebinarSinglePage: NextPage<WebinarSinglePageProps> = (props) => {
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
    >
      <PostSingleLayout
        content={props}
        breadcrumbs={getBlogWebinarPostBreadcrumbs(
          categories,
          webinar,
          "webinars",
          "Webinars",
        )}
      >
        <OakFlex $position={"relative"} $mt="space-between-xl">
          <WebinarVideo webinar={webinar} />
        </OakFlex>
        <OakBox $mt="space-between-l">
          <BlogPortableText portableText={webinar.summaryPortableText} />
        </OakBox>
      </PostSingleLayout>
      <BlogJsonLd blog={props.webinar} />
    </Layout>
  );
};

type URLParams = { webinarSlug: string };

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const webinarResults = await CMSClient.webinars();

  const paths = webinarResults.map((webinar) => ({
    params: { webinarSlug: webinar.slug },
  }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  WebinarSinglePageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "webinar-single::getStaticProps",
    context,
    getProps: async () => {
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
        webinarResults.map((w) => w.category),
      ).sort((a, b) => (a.title < b.title ? -1 : 1));

      const webinar: SerializedWebinar = {
        ...webinarResult,
        date: webinarResult.date.toISOString(),
        author: webinarResult.hosts[0], // make the first host equivalent to a blog author
      };

      const results: GetStaticPropsResult<WebinarSinglePageProps> = {
        props: {
          webinar,
          categories,
        },
      };
      return results;
    },
  });
};

export default WebinarSinglePage;
