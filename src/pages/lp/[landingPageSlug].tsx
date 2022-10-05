import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import config from "../../config";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import { BasePortableTextProvider } from "../../components/PortableText";
import CMSClient from "../../node-lib/cms";
import { LandingPage } from "../../node-lib/cms/sanity-client/schemas/landingPage";
import { Quote } from "../../components/SanityBlocks/LandingPage/Quote";
import { LandingPageTextBlock } from "../../components/SanityBlocks/LandingPage/LandingPageTextBlock";
import { SignupPrompt } from "../../components/SanityBlocks/LandingPage/SignupPrompt";
import { LandingPageTextAndMedia } from "../../components/SanityBlocks/LandingPage/LandingPageTextAndMedia";
import LandingPageHero from "../../components/SanityBlocks/LandingPage/LandingPageHero";

export type LandingPageProps = {
  pageData: LandingPage;
};

const Landing: NextPage<LandingPageProps> = ({ pageData }) => {
  return (
    <Layout
      headerVariant="landingPages"
      headerProps={pageData.headerButton}
      seoProps={getSeoProps(pageData.seo)}
    >
      <>
        <MaxWidth $justifyContent={"flex-start"}>
          <LandingPageHero hero={pageData.hero} />

          <BasePortableTextProvider>
            {pageData.content.map((content) => {
              if (content.type == "LandingPageTextAndMediaBlock") {
                return <LandingPageTextAndMedia {...content.textAndMedia} />;
              }
              if (content.type == "LandingPageQuoteBlock") {
                return <Quote {...content.quote} />;
              }
              if (content.type == "LandingPageFormBlock") {
                return <SignupPrompt {...content} />;
              }
              if (content.type == "LandingPageTextBlock") {
                return <LandingPageTextBlock {...content} />;
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

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const landingResults = await CMSClient.landingPages();

  const paths = landingResults.map((landingPage) => ({
    params: { landingPageSlug: landingPage.slug },
  }));

  return {
    fallback: false,
    paths,
  };
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

  return {
    props: {
      pageData: landingPageResult,
    },
    revalidate: config.get("sanityRevalidateSeconds"),
  };
};

export default Landing;
