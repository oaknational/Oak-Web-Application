import React from "react";
import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { SpecialistSubjectListingPageData } from "@/node-lib/curriculum-api-2023/queries/specialistSubjectListing/specialistSubjectListing.schema";
import SpecialistSubjectListing from "@/components/TeacherViews/SpecialistSubjectListing/SpecialistSubjectListing.view";

export type SpecialistSubjectistingPageProps = {
  curriculumData: SpecialistSubjectListingPageData;
};

const SpecialistSubjectListingPage: NextPage<
  SpecialistSubjectistingPageProps
> = ({ curriculumData }) => {
  const { therapies, specialist } = curriculumData;

  //   const { track } = useAnalytics();
  //   const { analyticsUseCase } = useAnalyticsPageProps();

  return (
    <AppLayout seoProps={{ title: "", description: "" }}>
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

      const results: GetStaticPropsResult<SpecialistSubjectistingPageProps> = {
        props: {
          curriculumData,
        },
      };

      return results;
    },
  });
};

export default SpecialistSubjectListingPage;
