import {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from "next/dist/types";
import { OakBox } from "@oaknational/oak-components";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { SupportYou } from "@/components/GenericPagesComponents/SupportYou";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";

export type OaksImpactPageProps = {
  topNav: TopNavProps;
};

const placeholderImage = {
  _id: "ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001-jpg",
  url: "https://sanity-asset-cdn.thenational.academy/images/cuvjke51/production/ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001.jpg",
};

const OaksImpact: NextPage<OaksImpactPageProps> = ({ topNav }) => {
  return (
    <Layout
      seoProps={getSeoProps({ title: "Oak's Impact" })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title="Oak's Impact"
          titleHighlight="bg-decorative2-main"
          content="How our world-class curriculum is making a difference in schools and trusts across the country"
        >
          <AboutSharedHeaderImage
            imageAlt="Oak's Impact"
            imageUrl={placeholderImage.url}
          />
        </AboutSharedHeader>
        <OakBox
          $ma={"spacing-48"}
          $pa={"spacing-48"}
          $borderColor="red"
          $ba="border-solid-xxl"
        >
          TODO: Stats
        </OakBox>
        <OakBox
          $ma={"spacing-48"}
          $pa={"spacing-48"}
          $borderColor="red"
          $ba="border-solid-xxl"
        >
          TODO: Case Studies
        </OakBox>
        <OakBox
          $ma={"spacing-48"}
          $pa={"spacing-48"}
          $borderColor="red"
          $ba="border-solid-xxl"
        >
          TODO: Quotes
        </OakBox>
        <SupportYou
          title="Discover how Oak can support you"
          headingTag="h2"
          body="To explore the impact Oak’s curricula could have in your school or trust, fill out the form below and one of our experts will be in touch shortly."
          link={{
            href: "https://share.hsforms.com/2yBT-92_WT6CvX1b6L3Iw8Qbvumd",
            text: "Get in touch with an expert",
          }}
          image={{
            asset: placeholderImage,
            altText: "Oak's Impact",
          }}
        />
      </AboutUsLayout>
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
