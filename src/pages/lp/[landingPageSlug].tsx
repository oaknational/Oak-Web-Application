import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import { BasePortableTextProvider } from "../../components/PortableText";
import CMSClient from "../../node-lib/cms";
import { LandingPage } from "../../common-lib/cms-types/landingPage";
import { ABTest, ABTestedLandingPage } from "../../common-lib/cms-types/abTest";
import { LandingPageTextAndMedia } from "../../components/pages/LandingPages/LandingPageTextAndMedia";
import { Quote } from "../../components/pages/LandingPages/Quote";
import { SignupPrompt } from "../../components/pages/LandingPages/SignupPrompt";
import { LandingPageTextBlock } from "../../components/pages/LandingPages/LandingPageTextBlock";
import LandingPageHero from "../../components/pages/LandingPages/LandingPageHero";
import getPageProps from "../../node-lib/getPageProps";

export type LandingPageProps = {
  pageData: LandingPage;
  abTest: ABTestedLandingPage | null;
};

const Landing: NextPage<LandingPageProps> = ({ pageData, abTest }) => {
  const pageVariant = usePageVariant<ABTestedLandingPage, LandingPage>(abTest);

  return <LandingPageTemplate pageData={pageVariant || pageData} />;
};

/**
 * Given an A/B test object, return either the matching variant for
 * the user or the control
 *
 * Currently co-located while only landing pages are A/B tested
 */
function usePageVariant<ABTestForPage extends ABTest, PageType>(
  abTest: ABTestForPage | null
): PageType | null {
  const variantForUser = useFeatureFlagVariantKey(
    abTest?.posthogFeatureFlagKey ?? ""
  );

  // The hook returns undefined before posthog
  // has initialized, so default to control
  const variantName = variantForUser ?? "control";

  if (!abTest) {
    return null;
  }

  const variant = abTest?.variants.find(
    (variantOption) => variantOption.posthogVariant === variantName
  );

  return variant?.page || abTest.controlVariant;
}

export type LandingPageTemplateProps = {
  pageData: LandingPage;
};

const LandingPageTemplate: NextPage<LandingPageTemplateProps> = ({
  pageData,
}) => {
  return (
    <Layout
      headerVariant="landing-pages"
      headerCta={pageData.headerCta}
      seoProps={getSeoProps(pageData.seo)}
    >
      <>
        <MaxWidth $justifyContent={"flex-start"}>
          <LandingPageHero hero={pageData.hero} />
          <BasePortableTextProvider>
            {pageData.content.map((content, index) => {
              if (content.type == "LandingPageTextAndMediaBlock") {
                return (
                  <LandingPageTextAndMedia
                    key={`${index}:${content.textAndMedia.title}`}
                    {...content.textAndMedia}
                  />
                );
              }
              if (content.type == "LandingPageQuoteBlock") {
                return (
                  <Quote
                    key={`${index}:${content.quote.text}`}
                    {...content.quote}
                  />
                );
              }
              if (content.type == "LandingPageFormBlock") {
                return (
                  <SignupPrompt
                    key={`${index}:${content.title}`}
                    {...content}
                  />
                );
              }
              if (content.type == "LandingPageTextBlock") {
                return (
                  <LandingPageTextBlock
                    key={`${index}:${content.bodyPortableText[0]._key}`}
                    {...content}
                  />
                );
              }
            })}
          </BasePortableTextProvider>
        </MaxWidth>
      </>
    </Layout>
  );
};

type URLParams = {
  landingPageSlug: string;
};

export const getServerSideProps: GetServerSideProps<
  LandingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "landing-page::getServerSideProps",
    context,
    withIsr: false,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const landingPageSlug = context?.params?.landingPageSlug as string;

      const abTest = await CMSClient.landingPageABTestBySlug(landingPageSlug, {
        previewMode: isPreviewMode,
      });

      let landingPageResult;

      if (abTest) {
        landingPageResult = abTest.controlVariant;
      } else {
        landingPageResult = await CMSClient.landingPageBySlug(landingPageSlug, {
          previewMode: isPreviewMode,
        });
      }

      if (!landingPageResult) {
        return {
          notFound: true,
        };
      }

      const results: GetServerSidePropsResult<LandingPageProps> = {
        props: {
          pageData: landingPageResult,
          abTest,
        },
      };
      return results;
    },
  });
};

export default Landing;
