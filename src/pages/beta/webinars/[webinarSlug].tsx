import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useTheme } from "styled-components";

import { getSeoProps } from "../../../browser-lib/seo/getSeoProps";
import Layout from "../../../components/Layout";
import { Heading } from "../../../components/Typography";
import CMSClient from "../../../node-lib/cms";
import { Webinar } from "../../../common-lib/cms-types";
import { getBlogWebinarPostBreadcrumbs } from "../../../components/Breadcrumbs/getBreadcrumbs";
import MobileBlogFilters from "../../../components/MobileBlogFilters";
import MaxWidth from "../../../components/MaxWidth/MaxWidth";
import Grid, { GridArea } from "../../../components/Grid";
import Box from "../../../components/Box";
import useBlogCategoryList from "../../../components/Blog/BlogCategoryList/useBlogCategoryList";
import BlogCategoryList from "../../../components/Blog/BlogCategoryList";
import BlogHeader from "../../../components/Blog/BlogHeader/BlogHeader";
import { decorateWithIsr } from "../../../node-lib/isr";
// import BlogPortableText from "../../../components/Blog/BlogPortableText/BlogPortableText";
// import { BlogJsonLd } from "../../../browser-lib/seo/getJsonLd";

export type SerializedWebinar = Omit<Webinar, "date"> & {
  date: string;
};

export type WebinarPageProps = {
  webinar: SerializedWebinar;
  categories: { title: string; slug: string }[];
};

const WebinarDetailPage: NextPage<WebinarPageProps> = (props) => {
  const { webinar, categories } = props;

  const blogCategoriesListProps = useBlogCategoryList();

  const theme = useTheme();
  const HEADER_HEIGHT = theme.header.height;

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
      <MobileBlogFilters
        page={"webinars-index"}
        categoryListProps={{ categories }}
        withBackButton
      />
      <MaxWidth>
        <Grid $ph={[12, 0]}>
          <GridArea $order={[0, 2]} $colSpan={[12, 3]}>
            <Box
              $display={["none", "block"]}
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $pt={[48, 72]}
            >
              <Heading
                tag="h3"
                $font="body-3"
                id={blogCategoriesListProps.labelId}
              >
                Categories
              </Heading>
              <BlogCategoryList
                labelledBy={blogCategoriesListProps.labelId}
                $mt={24}
                categories={categories}
                page={"webinars-index"}
              />
            </Box>
          </GridArea>
          <GridArea $order={[0, 1]} $colSpan={[12, 2]} />
          <GridArea $order={[1, 0]} $colSpan={[12, 7]}>
            <BlogHeader blog={webinar} />
            <Box $mt={[48]}>
              {/* <BlogPortableText portableText={webinar.contentPortableText} /> */}
            </Box>
          </GridArea>
        </Grid>
      </MaxWidth>
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

  const webinar = {
    ...webinarResult,
    date: webinarResult.date.toISOString(),
  };

  const results: GetStaticPropsResult<WebinarPageProps> = {
    props: {
      webinar,
      // categories: webinar.category,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default WebinarDetailPage;
