import { NextPage, GetServerSideProps } from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";

export type AboutUsOaksImpactCaseStudyListPageProps = {
  // pageData: {};
  topNav: TopNavProps;
};

export const AboutUsOaksImpactCaseStudyList: NextPage<
  AboutUsOaksImpactCaseStudyListPageProps
> = ({
  // pageData: {},
  topNav,
}) => {
  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <Layout
        seoProps={getSeoProps({ title: "Case Studies" })}
        $background={"bg-primary"}
        topNavProps={topNav}
      >
        TODO: Case Study list page
      </Layout>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export const getServerSideProps: GetServerSideProps<
  AboutUsOaksImpactCaseStudyListPageProps
> = async (context) => {
  const isEnabled = await isFeatureFlagEnabledServer(
    context.req.cookies,
    "case-studies-v2",
  );
  if (!isEnabled) {
    return { notFound: true };
  }

  //   const isPreviewMode = context.preview === true;
  //   const oaksImpactCaseStudyPage = await CMSClient.oaksImpactCaseStudyPage({
  //     previewMode: isPreviewMode,
  //   });

  const topNav = await curriculumApi2023.topNav();

  //   if (!oaksImpactCaseStudyPage) {
  //     return {
  //       notFound: true,
  //     };
  //   }

  return {
    props: {
      // pageData: {},
      topNav,
    },
  };
};

export default AboutUsOaksImpactCaseStudyList;
