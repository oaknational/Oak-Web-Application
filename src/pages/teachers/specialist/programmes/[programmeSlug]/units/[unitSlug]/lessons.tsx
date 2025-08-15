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
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { SpecialistLessonListingData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";
import SpecialistLessonListing from "@/components/TeacherViews/SpecialistLessonListing/SpecialistLessonListing.view";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";

export type SpecialistLessonListingPageProps = {
  curriculumData: SpecialistLessonListingData;
};

const SEO = {
  ...getSeoProps({
    title: `Free Specialist Teaching Resources for Lesson Planning`,
    description: "Specialist lessons",
  }),
};

const SpecialistLessonListingPage: NextPage<
  SpecialistLessonListingPageProps
> = ({ curriculumData }) => {
  return (
    <AppLayout seoProps={SEO}>
      <SpecialistLessonListing curriculumData={curriculumData} />
    </AppLayout>
  );
};

export type URLParams = {
  programmeSlug: string;
  unitSlug: string;
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
  SpecialistLessonListingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "teachers-specialist-lesson-index::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { programmeSlug, unitSlug } = context.params;
      try {
        const curriculumData = await curriculumApi2023.specialistLessonListing({
          unitSlug,
          programmeSlug,
        });

        if (!curriculumData) {
          return {
            notFound: true,
          };
        }

        const results: GetStaticPropsResult<SpecialistLessonListingPageProps> =
          {
            props: {
              curriculumData,
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

export default withOnboardingRequired(SpecialistLessonListingPage);
