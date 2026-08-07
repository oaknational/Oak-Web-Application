import {
  GetServerSideProps,
  GetServerSidePropsResult,
  NextPage,
} from "next/dist/types";
import { useEffect } from "react";

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
import useAnalytics from "@/context/Analytics/useAnalytics";
import { OaksImpactHeader } from "@/components/GenericPagesComponents/OaksImpactHeader";
import { isFeatureFlagEnabled } from "@/utils/featureFlagServer";

export type OaksImpactPageProps = {
  topNav: TopNavProps;
  pageData: OaksImpactPage;
};

// to do - do the track and extract to hook
// what is exit intent?
const useTrackExitIntended = () => {
  const { track } = useAnalytics();

  useEffect(() => {
    const functionToHandleMouseOut = (e: MouseEvent) => {
      // Check if cursor moves outside the top of the window viewport
      if (e.clientY <= 0 && !e.relatedTarget) {
        console.log("User is intending to exit the page");
        // track.exitIntended();
      }
    };

    window.addEventListener("mouseout", functionToHandleMouseOut);
    return () => {
      window.removeEventListener("mouseout", functionToHandleMouseOut);
    };
  }, [track]);
};

const OaksImpact: NextPage<OaksImpactPageProps> = ({ topNav, pageData }) => {
  useTrackExitIntended();
  return (
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
          videoDescription={pageData.header.videoDescription}
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
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isImpactPageEnabled = await isFeatureFlagEnabled(
    context,
    "oaks-impact",
  );
  if (!isImpactPageEnabled) {
    return {
      notFound: true,
    };
  }

  return getPageProps({
    page: "about-oaks-impact::getServerSideProps",
    context,
    withIsr: false,
    getProps: async () => {
      const topNav = await curriculumApi2023.topNav();
      const isPreviewMode = context.preview === true;

      const pageData = await CMSClient.oaksImpactPage({
        previewMode: isPreviewMode,
      });

      if (!pageData) {
        return {
          notFound: true,
        };
      }

      const results: GetServerSidePropsResult<OaksImpactPageProps> = {
        props: {
          topNav,
          pageData,
        },
      };
      return results;
    },
  });
};

export default OaksImpact;
