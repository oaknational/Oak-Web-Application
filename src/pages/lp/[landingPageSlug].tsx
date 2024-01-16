import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import CMSClient from "@/node-lib/cms";
import { LandingPage } from "@/common-lib/cms-types/landingPage";
import { LandingPageTextAndMedia } from "@/components/GenericPagesComponents/LandingPageTextAndMedia";
import { LandingPageQuote } from "@/components/GenericPagesComponents/LandingPageQuote";
import { LandingPageSignupPrompt } from "@/components/GenericPagesComponents/LandingPageSignupPrompt";
import { LandingPageTextBlock } from "@/components/GenericPagesComponents/LandingPageTextBlock";
import LandingPageHero from "@/components/GenericPagesComponents/LandingPageHero";
import getPageProps from "@/node-lib/getPageProps";
import { getABTestedLandingPage } from "@/node-lib/cms/ab-testing";
import Layout from "@/components/SharedComponents/Layout";
import MaxWidth from "@/components/SharedComponents/MaxWidth";

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
          <>
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
                  <LandingPageQuote
                    key={`${index}:${content.quote.text}`}
                    {...content.quote}
                  />
                );
              }
              if (content.type == "LandingPageFormBlock") {
                return (
                  <LandingPageSignupPrompt
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
          </>
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
        isPreviewMode,
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
        },
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
