import {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from "next/dist/types";
import { OakHeading } from "@oaknational/oak-components";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";

export type OaksImpactPageProps = {
  topNav: TopNavProps;
};

const OaksImpact: NextPage<OaksImpactPageProps> = ({ topNav }) => {
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    getBrowserConfig("posthogApiKey"),
  );

  let isImpactPageEnabled: boolean = false;
  if (posthogUserId) {
    isImpactPageEnabled =
      (await getFeatureFlag({
        featureFlagKey: "oaks-impact",
        posthogUserId,
      })) === true;
  }

  if (!isImpactPageEnabled) {
    return {
      notFound: true,
    };
  }

  return getPageProps({
    page: "about-oaks-impact::getServerSideProps",
    context,
    withIsr: false,
    getProps: async () => {
      const topNav = await curriculumApi2023.topNav();

      const results: GetServerSidePropsResult<OaksImpactPageProps> = {
        props: {
          topNav,
        },
      };
      return results;
    },
  });
};

export default OaksImpact;
