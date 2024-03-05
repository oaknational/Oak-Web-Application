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
import SpecialistProgrammeListing from "@/components/TeacherComponents/SpecialistProgrammeListing";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";

export type SpecialistProgrammeListingPageProps = {
  curriculumData: SpecialistProgrammeListingPageData;
};

const SEO = {
  ...getSeoProps({
    title: `Free Specialist Teaching Resources for Lesson Planning`,
    description: "Specialist programmes",
  }),
  ...{ noFollow: true, noIndex: true },
};

const SpecialistProgrammeListingPage: NextPage<
  SpecialistProgrammeListingPageProps
> = ({ curriculumData }) => {
  const { programmes } = curriculumData;
  return (
    <AppLayout seoProps={SEO}>
      <SpecialistProgrammeListing
        programmes={programmes}
        onClick={() => console.log("todo: implement what this is")}
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
      const curriculumData = await curriculumApi2023.specialistProgrammeListing(
        { subjectSlug },
      );

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<SpecialistProgrammeListingPageProps> =
        {
          props: {
            curriculumData,
          },
        };

      return results;
    },
  });
};

export default SpecialistProgrammeListingPage;
