import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React from "react";

import CurriculumHeader from "@/components/pages/CurriculumInfo/CurriculumHeader/CurriculumHeader";
import UnitsTab from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";
import AppLayout from "@/components/AppLayout/AppLayout";
import Box from "@/components/Box/Box";
import curriculumApi, {
  CurriculumHeaderData,
  CurriculumUnitsTabData,
} from "@/node-lib/curriculum-api-2023";
import { BETA_SEO_PROPS } from "@/browser-lib/seo/Seo";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { SubjectPhasePickerData } from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import { fetchSubjectPhasePickerData } from "@/pages/beta/[viewType]/curriculum/index";
import getPageProps from "@/node-lib/getPageProps";
import { ViewType } from "@/common-lib/urls";

export type CurriculumUnitsPageProps = {
  curriculumUnitsData: CurriculumUnitsTabData;
  curriculumHeaderData: CurriculumHeaderData;
  subjectPhaseOptions: SubjectPhasePickerData;
  pageSlug: string;
};

const CurriculumUnitsPage: NextPage<CurriculumUnitsPageProps> = ({
  curriculumUnitsData,
  curriculumHeaderData,
  subjectPhaseOptions,
  pageSlug,
}) => {
  return (
    <AppLayout
      seoProps={BETA_SEO_PROPS}
      $background={"white"}
      headerVariant="landing-pages"
    >
      <CurriculumHeader
        data={curriculumHeaderData}
        subjectPhaseOptions={subjectPhaseOptions}
        pageSlug={pageSlug}
        tab="units"
      />

      <Box $background={"white"}>
        <UnitsTab data={curriculumUnitsData} />
      </Box>
    </AppLayout>
  );
};

export type URLParams = {
  viewType: ViewType;
  subjectPhaseSlug: string;
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
  CurriculumUnitsPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "curriculum-info::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("Missing params");
      }
      // Parse and use params instead of "maths" and "secondary" when MV is ready
      const slug = context.params?.subjectPhaseSlug;
      const curriculumUnitsData = await curriculumApi.curriculumUnits({ slug });
      const curriculumHeaderData = await curriculumApi.curriculumHeader({
        slug,
      });
      const subjectPhaseData = await fetchSubjectPhasePickerData();

      const results: GetStaticPropsResult<CurriculumUnitsPageProps> = {
        props: {
          curriculumUnitsData,
          curriculumHeaderData,
          subjectPhaseOptions: subjectPhaseData,
          pageSlug: context.params?.subjectPhaseSlug,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default CurriculumUnitsPage;
