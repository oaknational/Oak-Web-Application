import { NextPage, GetServerSideProps, GetStaticPropsResult } from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { OaksImpactCaseStudyPage } from "@/common-lib/cms-types/aboutPages";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";

export type AboutUsOaksImpactCaseStudyPageProps = {
  pageData: OaksImpactCaseStudyPage;
  topNav: TopNavProps;
};

const AboutUsOaksImpactCaseStudy: NextPage<
  AboutUsOaksImpactCaseStudyPageProps
> = ({ pageData, topNav }) => {
  return (
    <Layout
      seoProps={getSeoProps({ title: pageData.video.title })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <pre>
          <code>{JSON.stringify(pageData, null, 2)}</code>
        </pre>
      </AboutUsLayout>
    </Layout>
  );
};

// TODO: Add back in once moving back to `getStaticProps(...)`
// export const getStaticPaths = async () => {
//     console.log({shouldSkipInitialBuild})
//   if (shouldSkipInitialBuild) {
//     return getFallbackBlockingConfig();
//   }

//   const impactPageData = await CMSClient.oaksImpactPage();

//   if (!impactPageData) {
//     return {
//       notFound: true,
//     };
//   }

//   const paths = impactPageData.caseStudiesSection.caseStudies.map((caseStudy) => ({
//     params: { slug: caseStudy.slug.current },
//   }));

//   console.log("getStaticPaths: paths", paths);

//   const config: GetStaticPathsResult<URLParams> = {
//     fallback: "blocking",
//     paths,
//   };
//   return config;
// };

type URLParams = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<
  AboutUsOaksImpactCaseStudyPageProps,
  URLParams
> = async (context) => {
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

  const slug = context.params?.slug;
  if (!slug) {
    return { notFound: true };
  }
  const isPreviewMode = context.preview === true;
  const oaksImpactCaseStudyPage = await CMSClient.oaksImpactCaseStudyPage({
    previewMode: isPreviewMode,
    slug: slug,
  });

  const topNav = await curriculumApi2023.topNav();

  if (!oaksImpactCaseStudyPage) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<AboutUsOaksImpactCaseStudyPageProps> = {
    props: {
      pageData: oaksImpactCaseStudyPage,
      topNav,
    },
  };
  return results;
};

export default AboutUsOaksImpactCaseStudy;
