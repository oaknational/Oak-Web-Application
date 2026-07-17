import {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from "next/dist/types";
import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
} from "@oaknational/oak-components";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { OaksImpactCaseStudies } from "@/components/GenericPagesComponents/OaksImpactCaseStudies";
import { oaksImpactCaseStudiesFixture } from "@/components/GenericPagesComponents/OaksImpactCaseStudies/OaksImpactCaseStudies.fixtures";
import { SupportYou } from "@/components/GenericPagesComponents/SupportYou";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import CMSClient from "@/node-lib/cms";
import { OaksImpactPage } from "@/common-lib/cms-types";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { OaksImpactSchoolQuote } from "@/components/GenericPagesComponents/OaksImpactSchoolQuote";

export type OaksImpactPageProps = {
  topNav: TopNavProps;
  pageData: OaksImpactPage;
};

const placeholderImage = {
  _id: "image-ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001-jpg",
  url: "https://sanity-asset-cdn.thenational.academy/images/cuvjke51/production/ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001.jpg",
};

const OaksImpact: NextPage<OaksImpactPageProps> = ({ topNav, pageData }) => {
  return (
    <Layout
      seoProps={getSeoProps({ title: "Oak's impact" })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title="Oak's impact"
          titleHighlight="bg-decorative2-main"
          content={pageData.header.introText}
        >
          <AboutSharedHeaderImage imageUrl={placeholderImage.url} />
        </AboutSharedHeader>

        <OakBox
          $ma={"spacing-48"}
          $pa={"spacing-48"}
          $borderColor="red"
          $ba="border-solid-xxl"
        >
          TODO: Stats
        </OakBox>

        <OaksImpactCaseStudies caseStudies={oaksImpactCaseStudiesFixture} />

        <NewGutterMaxWidth>
          <OakHeading
            tag={"h2"}
            $font={["heading-5", "heading-3"]}
            $textAlign={["left", "center"]}
            $mt={["spacing-56", "spacing-80"]}
            $mb={["spacing-24", "spacing-40"]}
          >
            {pageData.schoolQuotes.heading}
          </OakHeading>
          <OakGrid
            as="ul"
            $rg={"spacing-16"}
            $cg={"spacing-16"}
            $pl={"spacing-0"}
            $mv={"spacing-0"}
          >
            {pageData.schoolQuotes.cards.map(
              ({ quote, summary, logo, headshot }) => (
                <OakGridArea
                  as="li"
                  key={quote.organisation}
                  $colSpan={[12, 6]}
                >
                  <OaksImpactSchoolQuote
                    organisation={quote.organisation}
                    subTitle={summary}
                    logo={logo}
                    quote={{
                      quote: quote.text.split("\n").filter(Boolean),
                      authorName: quote.attribution,
                      authorTitle: quote.role,
                      authorImage: headshot,
                    }}
                  />
                </OakGridArea>
              ),
            )}
          </OakGrid>
        </NewGutterMaxWidth>

        <SupportYou
          headingTag="h2"
          link={{
            text: "Get in touch with an expert",
            href: "https://share.hsforms.com/2yBT-92_WT6CvX1b6L3Iw8Qbvumd",
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
      const isPreviewMode = context.preview === true;

      const pageData = await CMSClient.oaksImpactPage({
        previewMode: isPreviewMode,
      });

      if (!pageData) {
        return {
          notFound: true,
        };
      }

      const results: GetServerSidePropsResult<OaksImpactPageProps> = {
        props: {
          topNav,
          pageData,
        },
      };
      return results;
    },
  });
};

export default OaksImpact;
