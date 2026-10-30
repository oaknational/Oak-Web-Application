import { NextPage, GetServerSideProps } from "next";
import { OakBox } from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type NcAlignmentCheckerPageProps = {
  topNav: TopNavProps;
};

export const NcAlignmentChecker: NextPage<NcAlignmentCheckerPageProps> = ({
  topNav,
}) => {
  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <Layout
        seoProps={getSeoProps({ title: "NC Alignment Checker" })}
        $background={"bg-primary"}
        topNavProps={topNav}
      >
        <OakBox $zIndex={"neutral"} $color={"text-primary"}>
          NC Alignment Checker
        </OakBox>
      </Layout>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export const getServerSideProps: GetServerSideProps<
  NcAlignmentCheckerPageProps
> = async (context) => {
  const isEnabled = await isFeatureFlagEnabledServer(
    context.req.cookies,
    "nc-alignment-checker",
  );
  if (!isEnabled) {
    return { notFound: true };
  }

  const topNav = await curriculumApi2023.topNav();

  return {
    props: {
      topNav,
    },
  };
};

export default NcAlignmentChecker;
