import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React from "react";

import CurriculumHeader from "@/components/pages/CurriculumInfo/CurriculumHeader/CurriculumHeader";
import OverviewTab from "@/components/pages/CurriculumInfo/tabs/OverviewTab/OverviewTab";
import Box from "@/components/Box/Box";
import AppLayout from "@/components/AppLayout/AppLayout";
import curriculumApi, {
  CurriculumHeaderData,
  CurriculumOverviewTabData,
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

export type OverviewPageProps = {
  overviewData: CurriculumOverviewTabData;
  curriculumHeaderData: CurriculumHeaderData;
  subjectPhaseOptions: SubjectPhasePickerData;
  slug: string;
};

const OverviewPage: NextPage<OverviewPageProps> = ({
  overviewData,
  curriculumHeaderData,
  subjectPhaseOptions,
  slug,
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
        pageSlug={slug}
        tab="overview"
      />

      <Box $background={"white"}>
        <OverviewTab data={overviewData} slug={slug} />
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
  OverviewPageProps,
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
      const overviewData = await curriculumApi.curriculumOverview({ slug });
      const curriculumHeaderData = await curriculumApi.curriculumHeader({
        slug,
      });
      const subjectPhaseData = await fetchSubjectPhasePickerData();

      const results: GetStaticPropsResult<OverviewPageProps> = {
        props: {
          overviewData,
          curriculumHeaderData,
          subjectPhaseOptions: subjectPhaseData,
          slug: context.params?.subjectPhaseSlug,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default OverviewPage;
