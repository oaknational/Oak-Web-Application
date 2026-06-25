import {
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next/dist/types";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { OakHeading } from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/Layout";
import ErrorView from "@/components/AppComponents/ErrorView";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";

export type OaksImpactPageProps = {
  topNav: TopNavProps;
};

const OaksImpact: NextPage<OaksImpactPageProps> = ({ topNav }) => {
  const isImpactPageEnabled = useFeatureFlagEnabled("oaks-impact");

  if (!isImpactPageEnabled) {
    return <ErrorView statusCode={404} topNav={topNav} />;
  }

  return (
    <Layout
      seoProps={getSeoProps({ title: "Oak's Impact" })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <OakHeading tag="h1" $font="heading-1">
        Hello World
      </OakHeading>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  return getPageProps({
    page: "about-oaks-impact::getStaticProps",
    context,
    getProps: async () => {
      const topNav = await curriculumApi2023.topNav();

      const results: GetStaticPropsResult<OaksImpactPageProps> = {
        props: {
          topNav,
        },
      };
      return results;
    },
  });
};

export default OaksImpact;
