import { NextPage, GetServerSideProps } from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import CMSClient from "@/node-lib/cms";
import {
  NcAlignmentCheckerLandingPage,
  NcAlignmentCheckerLandingPageBlock,
  NcAlignmentCheckerLandingPageBlockType,
} from "@/common-lib/cms-types/ncAlignmentChecker";
import { OakCodeRenderer } from "@/styles/oakThemeApp";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";

function DefaultComponent(
  block: NcAlignmentCheckerLandingPageBlock<NcAlignmentCheckerLandingPageBlockType>,
) {
  return (
    <NewGutterMaxWidth>
      <OakCodeRenderer
        string={"```" + JSON.stringify(block, null, 2) + "```"}
      />
    </NewGutterMaxWidth>
  );
}

const pageComponents: {
  [K in NcAlignmentCheckerLandingPageBlockType]: (
    props: NcAlignmentCheckerLandingPageBlock<K>,
  ) => React.ReactNode;
} = {
  NcAlignmentCheckerLandingPageHeader: DefaultComponent,
  NcAlignmentCheckerLandingPageTextAndMedia: DefaultComponent,
  NcAlignmentCheckerLandingPageSubjectExperts: DefaultComponent,
  NcAlignmentCheckerLandingPageQuotes: DefaultComponent,
  NcAlignmentCheckerLandingPageFaqs: DefaultComponent,
  NcAlignmentCheckerLandingPageSubjectPickerCallout: DefaultComponent,
};

function renderBlock<K extends NcAlignmentCheckerLandingPageBlockType>(
  block: NcAlignmentCheckerLandingPageBlock<K>,
) {
  return pageComponents[block.__typename](block);
}

export type NcAlignmentCheckerPageProps = {
  topNav: TopNavProps;
  pageData: NcAlignmentCheckerLandingPage;
};

export const NcAlignmentChecker: NextPage<NcAlignmentCheckerPageProps> = ({
  topNav,
  pageData,
}) => {
  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <Layout
        seoProps={getSeoProps(
          pageData.seo ?? { title: "NC Alignment Checker" },
        )}
        $background={"bg-primary"}
        topNavProps={topNav}
      >
        {pageData.blocks?.map(renderBlock)}
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

  const isPreviewMode = context.preview === true;

  const pageData = await CMSClient.ncAlignmentCheckerLandingPage({
    previewMode: isPreviewMode,
  });

  if (!pageData) {
    return { notFound: true };
  }

  const topNav = await curriculumApi2023.topNav();

  return {
    props: {
      pageData,
      topNav,
    },
  };
};

export default NcAlignmentChecker;
