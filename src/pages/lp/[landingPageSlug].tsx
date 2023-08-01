import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";

import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import { BasePortableTextProvider } from "../../components/PortableText";
import CMSClient from "../../node-lib/cms";
import { LandingPage } from "../../common-lib/cms-types/landingPage";
import { LandingPageTextAndMedia } from "../../components/pages/LandingPages/LandingPageTextAndMedia";
import { Quote } from "../../components/pages/LandingPages/Quote";
import { SignupPrompt } from "../../components/pages/LandingPages/SignupPrompt";
import { LandingPageTextBlock } from "../../components/pages/LandingPages/LandingPageTextBlock";
import LandingPageHero from "../../components/pages/LandingPages/LandingPageHero";
import getPageProps from "../../node-lib/getPageProps";
import { getABTestedLandingPage } from "../../node-lib/cms/ab-testing";

export type LandingPageProps = {
  pageData: LandingPage;
};

const Landing: NextPage<LandingPageProps> = ({ pageData }) => {
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

      const abTestedPage = await getABTestedLandingPage(
        landingPageSlug,
        context,
        isPreviewMode
      );

      if (abTestedPage) {
        /**
         * For simplified tracking purposes, explicitly redirect the user to
         * the variant page.
         * This means if users that haven't consented when this request comes in
         * then submit the form (therefor consenting to hubspot) their variant
         * will still be tracked in some way
         */
        return {
          redirect: {
            destination: `/lp/${abTestedPage.slug}`,
            permanent: false,
          },
        };
      }

      const landingPageResult = await CMSClient.landingPageBySlug(
        landingPageSlug,
        {
          previewMode: isPreviewMode,
        }
      );

      if (!landingPageResult) {
        return {
          notFound: true,
        };
      }

      const results: GetServerSidePropsResult<LandingPageProps> = {
        props: {
          pageData: landingPageResult,
        },
      };
      return results;
    },
  });
};

export default Landing;
