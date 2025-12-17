import React from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { SpecialistProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/specialistProgrammeListing/specialistProgrammeListing.schema";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import SpecialistProgrammeListingView from "@/components/TeacherViews/SpecialistProgrammeListing/SpecialistProgrammeListing.view";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export type SpecialistProgrammeListingPageProps = {
  curriculumData: SpecialistProgrammeListingPageData;
  topNav: TopNavProps;
};

const SEO = {
  ...getSeoProps({
    title: `Free Specialist Teaching Resources for Lesson Planning`,
    description: "Specialist programmes",
  }),
};

const SpecialistProgrammeListingPage: NextPage<
  SpecialistProgrammeListingPageProps
> = ({ curriculumData, topNav }) => {
  const { programmes, subjectSlug, subjectTitle } = curriculumData;
  return (
    <AppLayout seoProps={SEO} topNavProps={topNav}>
      <SpecialistProgrammeListingView
        programmes={programmes}
        subjectSlug={subjectSlug}
        subjectTitle={subjectTitle}
      />
    </AppLayout>
  );
};

export type URLParams = {
  subjectSlug: string;
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
  SpecialistProgrammeListingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "teachers-specialist-programme-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { subjectSlug } = context.params;
      try {
        const curriculumData =
          await curriculumApi2023.specialistProgrammeListing({ subjectSlug });
        if (!curriculumData) {
          return {
            notFound: true,
          };
        }
        const topNav = await curriculumApi2023.topNav();

        const results: GetStaticPropsResult<SpecialistProgrammeListingPageProps> =
          {
            props: {
              curriculumData,
              topNav,
            },
          };

        return results;
      } catch {
        return {
          notFound: true,
        };
      }
    },
  });
};

export default SpecialistProgrammeListingPage;
