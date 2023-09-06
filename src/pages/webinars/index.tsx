import { GetStaticProps, GetStaticPropsResult } from "next";

import { WebinarListingPageProps } from "../../components/pages/WebinarsIndex.page";
import CMSClient from "../../node-lib/cms";
import { serializeDate } from "../../utils/serializeDate";
import getPageProps from "../../node-lib/getPageProps";

export { default } from "../../components/pages/WebinarsIndex.page";

export const getStaticProps: GetStaticProps<
  WebinarListingPageProps,
  { categorySlug?: string }
> = async (context) => {
  return getPageProps({
    page: "webinar-listing::getStaticProps",
    context,
    getProps: async () => {
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
      const webinars = webinarResults
        .map((webinar) => serializeDate(webinar))
        .filter((webinar) => {
          if (categorySlug) {
            return webinar.category.slug === categorySlug;
          }
          return true;
        });

      const webinarCategories = [
        ...new Map(
          webinarResults
            .map((webinar) => webinar.category)
            .map((item) => [item["slug"], item]),
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
      return results;
    },
  });
};
