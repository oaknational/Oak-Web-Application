import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import Grid, { GridArea } from "../../components/Grid";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import CMSClient, { LandingPage } from "../../node-lib/cms";
import { extractNumberEnvVar } from "../../utils/configHelper";

export type LandingPageProps = {
  pageData: LandingPage;
};

const Landing: NextPage<LandingPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)}>
      <MaxWidth>
        <Grid>
          <GridArea $colSpan={[12, 12, 12]}>
            Landing page: <pre>{pageData.slug}</pre>
          </GridArea>
        </Grid>
      </MaxWidth>
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
    revalidate: extractNumberEnvVar("SANITY_REVALIDATE_SECONDS"),
  };
};

export default Landing;
