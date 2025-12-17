import React from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { SpecialistUnitListingData } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import SpecialistUnitListing from "@/components/TeacherViews/SpecialistUnitListing/SpecialistUnitListing.view";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export type SpecialistUnitListingPageProps = {
  curriculumData: SpecialistUnitListingData;
  topNav: TopNavProps;
};

const SpecialistUnitListingPage: NextPage<SpecialistUnitListingPageProps> = ({
  curriculumData,
  topNav,
}) => {
  const { subjectTitle, developmentStageSlug, developmentStage } =
    curriculumData;

  const developmentStagesSEO = {
    ...getSeoProps({
      title: `Free Specialist ${subjectTitle} Teaching Resources for Lesson Planning`,
      description: `We have resources for development stages: ${developmentStage
        .map((stage) => stage.title)
        .join(", ")}`,
    }),
  };

  const unitsSEO = {
    ...getSeoProps({
      title: `Free Specialist ${subjectTitle} Teaching Resources for Lesson Planning`,
      description: "Specialist programme units",
    }),
  };

  return (
    <AppLayout
      topNavProps={topNav}
      seoProps={developmentStageSlug ? developmentStagesSEO : unitsSEO}
    >
      <SpecialistUnitListing curriculumData={curriculumData} />
    </AppLayout>
  );
};

export type URLParams = {
  programmeSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  SpecialistUnitListingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "specialist-unit-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { programmeSlug } = context.params;

      const curriculumData = await curriculumApi2023.specialistUnitListing({
        programmeSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }
      const topNav = await curriculumApi2023.topNav();

      const results: GetStaticPropsResult<SpecialistUnitListingPageProps> = {
        props: {
          curriculumData,
          topNav,
        },
      };

      return results;
    },
  });
};

export default SpecialistUnitListingPage;
