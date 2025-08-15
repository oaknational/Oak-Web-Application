import React from "react";
import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { SpecialistSubjectListingPageData } from "@/node-lib/curriculum-api-2023/queries/specialistSubjectListing/specialistSubjectListing.schema";
import SpecialistSubjectListing from "@/components/TeacherViews/SpecialistSubjectListing/SpecialistSubjectListing.view";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { Wall } from "@/components/AppComponents/Wall";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";

export type SpecialistSubjectistingPageProps = {
  curriculumData: SpecialistSubjectListingPageData;
};

const SEO = {
  ...getSeoProps({
    title: `Free Specialist Teaching Resources for Lesson Planning`,
    description: "Specialist subjects",
  }),
};

const SpecialistSubjectListingPage: NextPage<
  SpecialistSubjectistingPageProps
> = ({ curriculumData }) => {
  const { therapies, specialist } = curriculumData;

  return (
    <AppLayout seoProps={SEO}>
      <SpecialistSubjectListing therapies={therapies} specialist={specialist} />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<
  SpecialistSubjectistingPageProps
> = async (context) => {
  return getPageProps({
    page: "teachers-specialist-subject-listing::getStaticProps",
    context,
    getProps: async () => {
      const curriculumData = await curriculumApi2023.specialistSubjectListing();

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      // TODO: remove this once specialist is published
      const therapiesAndSpecialistExist =
        curriculumData.therapies.length > 0 &&
        curriculumData.specialist.length > 0;

      if (!therapiesAndSpecialistExist) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<SpecialistSubjectistingPageProps> = {
        props: {
          curriculumData,
        },
      };

      return results;
    },
  });
};

export default withOnboardingRequired(SpecialistSubjectListingPage, Wall);
