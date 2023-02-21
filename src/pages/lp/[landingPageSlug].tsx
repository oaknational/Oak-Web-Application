import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import { BasePortableTextProvider } from "../../components/PortableText";
import CMSClient from "../../node-lib/cms";
import { LandingPage } from "../../common-lib/cms-types/landingPage";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../node-lib/isr";
import { LandingPageTextAndMedia } from "../../components/pages/LandingPages/LandingPageTextAndMedia";
import { Quote } from "../../components/pages/LandingPages/Quote";
import { SignupPrompt } from "../../components/pages/LandingPages/SignupPrompt";
import { LandingPageTextBlock } from "../../components/pages/LandingPages/LandingPageTextBlock";
import LandingPageHero from "../../components/pages/LandingPages/LandingPageHero";

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

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const landingResults = await CMSClient.landingPages();

  const paths = landingResults.map((landingPage) => ({
    params: { landingPageSlug: landingPage.slug },
  }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  LandingPageProps,
  URLParams
> = async (context) => {
  const isPreviewMode = context.preview === true;

  const landingPageSlug = context?.params?.landingPageSlug as string;
  const landingPageResult = await CMSClient.landingPageBySlug(landingPageSlug, {
    previewMode: isPreviewMode,
  });

  if (!landingPageResult) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<LandingPageProps> = {
    props: {
      pageData: landingPageResult,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default Landing;
