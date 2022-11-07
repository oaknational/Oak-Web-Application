import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { uniqBy } from "lodash/fp";

import { getSeoProps } from "../../../browser-lib/seo/getSeoProps";
import Layout from "../../../components/Layout";
import CMSClient from "../../../node-lib/cms";
import { TeamMemberPreview, Webinar } from "../../../common-lib/cms-types";
import { getBlogWebinarPostBreadcrumbs } from "../../../components/Breadcrumbs/getBreadcrumbs";
import Box from "../../../components/Box";
import { decorateWithIsr } from "../../../node-lib/isr";
import BlogPortableText from "../../../components/Blog/BlogPortableText/BlogPortableText";
import CMSVideo from "../../../components/CMSVideo";
import Flex from "../../../components/Flex";
import BlogWebinarsIndexLayout from "../../../components/Blog/BlogWebinarsIndexLayout";
// import { BlogJsonLd } from "../../../browser-lib/seo/getJsonLd";

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

  return (
    <Layout
      seoProps={getSeoProps({
        ...props.webinar.seo,
        title: webinar.seo?.title || webinar.title,
        description: webinar.seo?.description || "",
        imageUrl: "", // @TODO: add image from video frame
      })}
      $background="white"
      breadcrumbs={getBlogWebinarPostBreadcrumbs(
        categories,
        webinar,
        "webinars"
      )}
    >
      <BlogWebinarsIndexLayout content={props}>
        <Flex $position={"relative"} $mt={56}>
          <CMSVideo video={webinar.video} />
        </Flex>
        <Box $mt={[48]}>
          <BlogPortableText portableText={webinar.summaryPortableText} />
        </Box>
      </BlogWebinarsIndexLayout>
      {/* <BlogJsonLd {...props.webinar} /> */}
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
    author: webinarResult.hosts.find((host) => host !== undefined), // make the first host equivalent to a blog author
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
