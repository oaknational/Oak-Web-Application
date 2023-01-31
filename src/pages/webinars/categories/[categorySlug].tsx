import { GetStaticPathsResult } from "next";

import CMSClient from "../../../node-lib/cms";
import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "../../../node-lib/isr";
import { getStaticProps } from "../index";

type URLParams = { categorySlug: string };
export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const webinarResults = await CMSClient.webinars();

  const paths = webinarResults.map((webinarResult) => ({
    params: {
      categorySlug: webinarResult.category.slug,
    },
  }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths,
  };
  return config;
};

export { getStaticProps };
export { default } from "../../../components/pages/WebinarsIndex.page";
