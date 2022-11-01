import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { toPlainText } from "@portabletext/react";

import { decorateWithIsr } from "../../node-lib/isr";
import { BlogListItemProps } from "../../components/Blog/BlogList/BlogListItem";
import Layout from "../../components/Layout";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import { getBlogWebinarListBreadcrumbs } from "../../components/Breadcrumbs/getBreadcrumbs";
import MobileBlogFilters from "../../components/MobileBlogFilters";
import SummaryCard from "../../components/Card/SummaryCard";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import CMSClient from "../../node-lib/cms";
import {
  BlogWebinarCategory,
  WebinarPreview,
} from "../../common-lib/cms-types";
import BlogWebinarsListAndCategories from "../Blog/BlogWebinarsListAndCategories";
import { WebinarsListingPage } from "../../common-lib/cms-types/webinarsListingPage";

export type SerializedWebinarPreview = Omit<WebinarPreview, "date"> & {
  date: string;
};

export type WebinarListingPageProps = {
  webinars: SerializedWebinarPreview[];
  categories: BlogWebinarCategory[];
  categorySlug: string | null;
  pageData: WebinarsListingPage;
};

/**
 * @TODO: Remove /webinars/* from next-sitemap.config.js when built
 */

const WebinarListingPage: NextPage<WebinarListingPageProps> = (props) => {
  const webinars = props.webinars.map(webinarToBlogListItem);
  const { categories, categorySlug, pageData } = props;
  const cardImage = {
    src: "/images/illustrations/teacher-carrying-stuff-237-286.png",
    alt: "",
  };

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
          title={pageData.title}
          heading={pageData.heading}
          // TODO: Replace line summary with new field from CMS
          summary={pageData.summary}
          imageProps={cardImage}
        />
        <BlogWebinarsListAndCategories
          {...props}
          blogs={webinars}
          page={"webinars-index"}
        />
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

  const pageData = await CMSClient.webinarsListingPage({
    previewMode: isPreviewMode,
  });

  if (!pageData) {
    return {
      notFound: true,
    };
  }
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
    ...new Map(
      webinars
        .map((webinar) => webinar.category)
        .map((item) => [item["slug"], item])
    ).values(),
  ];

  const results: GetStaticPropsResult<WebinarListingPageProps> = {
    props: {
      webinars,
      categories: webinarCategories,
      categorySlug: categorySlug,
      pageData,
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
