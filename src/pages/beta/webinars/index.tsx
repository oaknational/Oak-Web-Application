import { GetStaticProps, GetStaticPropsResult } from "next";

import { WebinarListingPageProps } from "../../../components/pages/WebinarsIndex.page";
import CMSClient from "../../../node-lib/cms";
import { decorateWithIsr } from "../../../node-lib/isr";
import { serializeDate } from "../../../utils/serializeDate";

export { default } from "../../../components/pages/WebinarsIndex.page";

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
      webinarResults
        .map((webinar) => webinar.category)
        .map((item) => [item["slug"], item])
    ).values(),
  ].sort((a, b) => (a.title < b.title ? -1 : 1));

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
