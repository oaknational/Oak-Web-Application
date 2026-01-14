import { GetStaticProps, GetStaticPropsResult } from "next";

import ErrorPage, { ErrorProps } from "./_error";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";

export default function Custom500({ topNav }: Readonly<ErrorProps>) {
  return <ErrorPage statusCode={500} topNav={topNav} />;
}

export const getStaticProps: GetStaticProps<ErrorProps> = async (context) => {
  return getPageProps({
    page: "500",
    context,
    getProps: async () => {
      const topNav = await curriculumApi2023.topNav();

      const results: GetStaticPropsResult<ErrorProps> = {
        props: {
          topNav,
        },
      };

      return results;
    },
  });
};
