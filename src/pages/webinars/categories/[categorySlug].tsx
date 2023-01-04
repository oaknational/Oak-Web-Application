import { GetStaticPaths } from "next";

import CMSClient from "../../../node-lib/cms";
import { getStaticProps } from "../index";

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

export { getStaticProps };
export { default } from "../../../components/pages/WebinarsIndex.page";
