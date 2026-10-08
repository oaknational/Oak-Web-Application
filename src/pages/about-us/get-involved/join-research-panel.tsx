import { NextPage, GetServerSideProps } from "next";
import { OakBox } from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type AboutUsJoinResearchPanelPageProps = {
  // pageData: {};
  topNav: TopNavProps;
};

export const AboutUsJoinResearchPanel: NextPage<
  AboutUsJoinResearchPanelPageProps
> = ({ topNav }) => {
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
        <OakBox $zIndex={"neutral"} $color={"text-primary"}>
          Join the research panel
        </OakBox>
      </Layout>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export const getServerSideProps: GetServerSideProps<
  AboutUsJoinResearchPanelPageProps
> = async (context) => {
  const isEnabled = await isFeatureFlagEnabledServer(
    context.req.cookies,
    "join-research-panel",
  );
  if (!isEnabled) {
    return { notFound: true };
  }

  //   const isPreviewMode = context.preview === true;

  const topNav = await curriculumApi2023.topNav();

  return {
    props: {
      // pageData: {},
      topNav,
    },
  };
};

export default AboutUsJoinResearchPanel;
