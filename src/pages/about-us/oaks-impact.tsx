import {
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next/dist/types";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { OaksImpactCaseStudies } from "@/components/GenericPagesComponents/OaksImpactCaseStudies";
import { SupportYou } from "@/components/GenericPagesComponents/SupportYou";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import { OaksImpactStats } from "@/components/GenericPagesComponents/OaksImpactStats";
import CMSClient from "@/node-lib/cms";
import { OaksImpactPage } from "@/common-lib/cms-types";
import { OaksImpactSchoolQuotesSection } from "@/components/GenericPagesComponents/OaksImpactSchoolQuotesSection";
import TrackScrolledTo from "@/components/SharedComponents/TrackScrolledTo";
import { OaksImpactHeader } from "@/components/GenericPagesComponents/OaksImpactHeader";
import useTrackExitIntended from "@/hooks/useTrackExitIntended";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type OaksImpactPageProps = {
  topNav: TopNavProps;
  pageData: OaksImpactPage;
};

const OaksImpact: NextPage<OaksImpactPageProps> = ({ topNav, pageData }) => {
  useTrackExitIntended();
  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <Layout
        seoProps={getSeoProps({ title: "Oak's impact" })}
        $background={"bg-primary"}
        topNavProps={topNav}
      >
        <AboutUsLayout>
          <OaksImpactHeader
            title="Oak's impact"
            body={pageData.header.introText}
            video={pageData.header.video}
            mediaDescription={pageData.header.videoDescription}
          />
          <OaksImpactStats {...pageData.statsSection} />
          <OaksImpactCaseStudies
            title="Case studies"
            caseStudies={pageData.caseStudiesSection.caseStudies}
          />
          <OaksImpactSchoolQuotesSection {...pageData.schoolQuotes} />
          <TrackScrolledTo eventKey="support_you" />
          <SupportYou
            headingTag="h2"
            link={{
              text: "Get in touch with an expert",
              href: "https://share.hsforms.com/2yBT-92_WT6CvX1b6L3Iw8Qbvumd",
            }}
          />
        </AboutUsLayout>
      </Layout>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export const getStaticProps: GetStaticProps<OaksImpactPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "about-oaks-impact::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const oaksImpactPage = await CMSClient.oaksImpactPage({
        previewMode: isPreviewMode,
      });

      const topNav = await curriculumApi2023.topNav();

      if (!oaksImpactPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<OaksImpactPageProps> = {
        props: {
          pageData: oaksImpactPage,
          topNav,
        },
      };
      return results;
    },
  });
};

export default OaksImpact;
