import { NextPage, GetServerSideProps } from "next";
import {
  OakBox,
  OakHeading,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { PortableText } from "@portabletext/react";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import CMSClient from "@/node-lib/cms";
import {
  JoinResearchPanelPage,
  JoinResearchPanelPageBlock,
  JoinResearchPanelPageBlockType,
} from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import CMSImage from "@/components/SharedComponents/CMSImage";

export type AboutUsJoinResearchPanelPageProps = {
  pageData: JoinResearchPanelPage;
  topNav: TopNavProps;
};

export const AboutUsJoinResearchPanel: NextPage<
  AboutUsJoinResearchPanelPageProps
> = ({ topNav, pageData }) => {
  const JoinResearchPanelPageHeader = ({
    title,
    bodyRaw,
    image,
    button,
  }: JoinResearchPanelPageBlock<"JoinResearchPanelPageHeader">) => (
    <pre>
      <OakHeading tag="h1"> {title} </OakHeading>
      <PortableText value={bodyRaw} />
      <OakPrimaryButton
        element="a"
        href={getLinkHref(button)}
        iconName="external"
        isTrailingIcon
      >
        {button.label}
      </OakPrimaryButton>
      <CMSImage image={image} />
    </pre>
  );

  const JoinResearchPanelPageDefault = (
    block: JoinResearchPanelPageBlock<JoinResearchPanelPageBlockType>,
  ) => {
    return (
      <pre>
        <code>{JSON.stringify(block, null, 2)}</code>
      </pre>
    );
  };

  const pageComponents: {
    [K in JoinResearchPanelPageBlockType]: (
      block: JoinResearchPanelPageBlock<K>,
    ) => React.ReactNode;
  } = {
    JoinResearchPanelPageHeader: JoinResearchPanelPageHeader,
    JoinResearchPanelPageCallout: JoinResearchPanelPageDefault,
    JoinResearchPanelPageInfo: JoinResearchPanelPageDefault,
    JoinResearchPanelPageJourney: JoinResearchPanelPageDefault,
    JoinResearchPanelPagePeople: JoinResearchPanelPageDefault,
    JoinResearchPanelPageFaqs: JoinResearchPanelPageDefault,
    JoinResearchPanelPageContactUs: JoinResearchPanelPageDefault,
  };

  function renderBlock<K extends JoinResearchPanelPageBlockType>(
    block: JoinResearchPanelPageBlock<K>,
  ) {
    return pageComponents[block.__typename](block);
  }

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
          {pageData.blocks.map((block) => {
            return <div key={block.__typename}>{renderBlock(block)}</div>;
          })}
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

  // const isPreviewMode = context.preview === true;

  const pageData = await CMSClient.joinResearchPanelPage({
    previewMode: true,
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

export default AboutUsJoinResearchPanel;
