import { NextPage, GetServerSideProps } from "next";

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
import JoinResearchPanelPageHeader from "@/components/GenericPagesComponents/JoinResearchPanelHeader";
import JoinResearchPanelPageDefault from "@/components/GenericPagesComponents/JoinResearchPanelDefault";
import JoinResearchPanelPeople from "@/components/GenericPagesComponents/JoinResearchPanelPeople";
import JoinResearchPanelInfo from "@/components/GenericPagesComponents/JoinResearchPanelInfo";
import JoinResearchPanelCallout from "@/components/GenericPagesComponents/JoinResearchPanelCallout";
import { SerializedBlogPostPreview } from "@/common-lib/cms-types/blog";
import { BlogsPreview } from "@/components/GenericPagesComponents/BlogsPreview/BlogsPreview";
import { serializeDate } from "@/utils/serializeDate";

const pageComponents: {
  [K in JoinResearchPanelPageBlockType]: (
    block: JoinResearchPanelPageBlock<K>,
    blogs: SerializedBlogPostPreview[],
  ) => React.ReactNode;
} = {
  JoinResearchPanelPageHeader: JoinResearchPanelPageHeader,
  JoinResearchPanelPageCallout: JoinResearchPanelCallout,
  JoinResearchPanelPageInfo: JoinResearchPanelInfo,
  JoinResearchPanelPageJourney: JoinResearchPanelPageDefault,
  JoinResearchPanelPagePeople: JoinResearchPanelPeople,
  JoinResearchPanelPageBlogsPreview: (block, blogs) => (
    <BlogsPreview
      title={block.title}
      label={block.label}
      blogs={blogs}
      blogPostCategorySlug="research-and-insights"
      backgroundColor="bg-decorative3-very-subdued"
    />
  ),
  JoinResearchPanelPageFaqs: JoinResearchPanelPageDefault,
  JoinResearchPanelPageContactUs: JoinResearchPanelPageDefault,
};

function renderBlock<K extends JoinResearchPanelPageBlockType>(
  block: JoinResearchPanelPageBlock<K>,
  blogs: SerializedBlogPostPreview[],
) {
  return pageComponents[block.__typename](block, blogs);
}

export type AboutUsJoinResearchPanelPageProps = {
  pageData: Omit<JoinResearchPanelPage, "blogs"> & {
    blogs: SerializedBlogPostPreview[];
  };
  topNav: TopNavProps;
};

export const AboutUsJoinResearchPanel: NextPage<
  AboutUsJoinResearchPanelPageProps
> = ({ topNav, pageData }) => {
  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <Layout
        seoProps={getSeoProps({ title: "Join the research panel" })}
        $background={"bg-primary"}
        topNavProps={topNav}
      >
        {pageData.content.blocks.map((block, i) => {
          return (
            <div key={`${block.__typename}-${i}`}>
              {renderBlock(block, pageData.blogs)}
            </div>
          );
        })}
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

  const isPreviewMode = context.preview === true;

  const pageData = await CMSClient.joinResearchPanelPage({
    previewMode: isPreviewMode,
    blogCategorySlug: "research-and-insights",
  });

  if (!pageData) {
    return { notFound: true };
  }

  const topNav = await curriculumApi2023.topNav();

  return {
    props: {
      pageData: {
        ...pageData,
        blogs: pageData.blogs.map((blog) => serializeDate(blog)),
      },
      topNav,
    },
  };
};

export default AboutUsJoinResearchPanel;
