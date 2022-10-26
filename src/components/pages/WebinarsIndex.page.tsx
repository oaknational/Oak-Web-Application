import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { toPlainText } from "@portabletext/react";
import { useTheme } from "styled-components";

import CMSClient, {
  BlogWebinarCategory,
  WebinarPreview,
} from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";
import { BlogListItemProps } from "../../components/Blog/BlogList/BlogListItem";
import Layout from "../../components/Layout";
import { Heading } from "../../components/Typography";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import BlogList from "../../components/Blog/BlogList";
import { getBlogWebinarListBreadcrumbs } from "../../components/Breadcrumbs/getBreadcrumbs";
import MobileBlogFilters from "../../components/MobileBlogFilters";
import SummaryCard from "../../components/Card/SummaryCard";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Grid, { GridArea } from "../../components/Grid";
import Box from "../../components/Box";
import useBlogCategoryList from "../../components/Blog/BlogCategoryList/useBlogCategoryList";
import BlogCategoryList from "../../components/Blog/BlogCategoryList";

export type SerializedWebinarPreview = Omit<WebinarPreview, "date"> & {
  date: string;
};

export type WebinarListingPageProps = {
  webinars: SerializedWebinarPreview[];
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
};

/**
 * @TODO: Remove /webinars/* from next-sitemap.config.js when built
 */

const WebinarListingPage: NextPage<WebinarListingPageProps> = (props) => {
  const webinars = props.webinars.map(webinarToBlogListItem);
  const { categories, categorySlug } = props;
  const blogCategoriesListProps = useBlogCategoryList();

  const cardImage = {
    src: "/images/illustrations/teacher-carrying-stuff-237-286.png",
    alt: "",
  };

  const theme = useTheme();
  const HEADER_HEIGHT = theme.header.height;

  return (
    <Layout
      seoProps={getSeoProps({
        title: "Webinars",
        description: "Webinars",
      })}
      $background="white"
      breadcrumbs={getBlogWebinarListBreadcrumbs(
        categories,
        categorySlug,
        "webinars"
      )}
    >
      <MobileBlogFilters
        page={"webinars-index"}
        categoryListProps={{
          categories,
          selectedCategorySlug: categorySlug,
        }}
      />
      <MaxWidth $pt={[0, 80, 80]}>
        <SummaryCard
          title={"Webinar Listing"}
          heading={"Inspiration for inside and outside the classroom"}
          // TODO: Replace line summary with new field from CMS
          summary={"This card needs to come from Sanity"}
          imageProps={cardImage}
        />
        <Grid $ph={[12, 0]}>
          <GridArea $order={[0, 2]} $colSpan={[12, 4, 3]}>
            <Box
              $display={["none", "block"]}
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $mt={[0, 24]}
              $pt={[48]}
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
                selectedCategorySlug={categorySlug}
                page={"webinars-index"}
              />
            </Box>
          </GridArea>
          {/* @todo is there a nicer way to make this 1 column spacer? */}
          <GridArea $order={1} $colSpan={[12, 1]} />
          <GridArea $order={[1, 0]} $colSpan={[12, 7, 8]} $mt={[48, 72]}>
            <BlogList items={webinars} withContainingHrs withPagination />
          </GridArea>
        </Grid>
      </MaxWidth>
      {/* <BlogListJsonLd blogs={props.webinars} /> @todo // needs more data from
        sanity */}
    </Layout>
  );
};

export const webinarToBlogListItem = (
  webinar: SerializedWebinarPreview
): BlogListItemProps => ({
  contentType: "webinar",
  title: webinar.title,
  href: `/webinars/${webinar.slug}`,
  snippet: toPlainText(webinar.summaryPortableText),
  titleTag: "h3",
  category: webinar.category,
  date: webinar.date,
  mainImage: null,
});

export const serializeDate = <T extends { date: Date }>(
  item: T
): T & { date: string } => ({
  ...item,
  date: item.date.toISOString(),
});

export const getStaticProps: GetStaticProps<
  WebinarListingPageProps,
  { categorySlug?: string }
> = async (context) => {
  const isPreviewMode = context.preview === true;

  const webinarResults = await CMSClient.webinars({
    previewMode: isPreviewMode,
  });

  const categorySlug = context.params?.categorySlug || null;
  const webinars = webinarResults.map(serializeDate).filter((webinar) => {
    if (categorySlug) {
      return webinar.category.slug === categorySlug;
    }
    return true;
  });

  const webinarCategories = [
    ...new Set(webinars.map((item) => item.category)),
  ].sort((a, b) => (a.title < b.title ? -1 : 1));

  const results: GetStaticPropsResult<WebinarListingPageProps> = {
    props: {
      webinars,
      categories: webinarCategories,
      categorySlug: categorySlug,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

type URLParams = { categorySlug: string };
export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const blogResults = await CMSClient.webinars();

  const paths = blogResults.map((blogResult) => ({
    params: {
      categorySlug: blogResult.category.slug,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export default WebinarListingPage;
