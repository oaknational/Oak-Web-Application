import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React from "react";

import CurriculumHeader from "@/components/Grid/CurriculumInfo/CurriculumHeader";
import DownloadTab from "@/components/Grid/CurriculumInfo/tabs/DownloadTab";
import Box from "@/components/Box/Box";
import AppLayout from "@/components/AppLayout/AppLayout";
import curriculumApi, {
  curriculumSubjectPhaseOverviewData,
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

export type DownloadPageProps = {
  data: curriculumSubjectPhaseOverviewData;
  subjectPhaseOptions: SubjectPhasePickerData;
  subjectPhaseSlug: string;
};

const DownloadPage: NextPage<DownloadPageProps> = ({
  data,
  subjectPhaseOptions,
  subjectPhaseSlug,
}) => {
  return (
    <AppLayout
      seoProps={BETA_SEO_PROPS}
      $background={"white"}
      headerVariant="landing-pages"
    >
      <CurriculumHeader
        subject={data.subject}
        phase={data.phase}
        subjectPhaseOptions={subjectPhaseOptions}
      />
      <Box $background={"white"}>
        <DownloadTab {...data} slug={subjectPhaseSlug} />
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

export const getStaticProps: GetStaticProps<DownloadPageProps> = async (
  context
) => {
  return getPageProps({
    page: "curriculum-info::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("Missing params");
      }
      // Parse and use params instead of "maths" and "secondary" when MV is ready
      const overviewData =
        await curriculumApi.curriculumSubjectPhaseOverviewPage({
          subject: "maths",
          phase: "secondary",
        });
      const subjectPhaseData = await fetchSubjectPhasePickerData();

      const results: GetStaticPropsResult<DownloadPageProps> = {
        props: {
          data: overviewData,
          subjectPhaseOptions: subjectPhaseData,
          subjectPhaseSlug: "maths-secondary",
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default DownloadPage;
