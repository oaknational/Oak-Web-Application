import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React from "react";

import CurriculumHeader from "@/components/pages/CurriculumInfo/CurriculumHeader";
import SequenceTab from "@/components/pages/CurriculumInfo/tabs/SequenceTab";
import AppLayout from "@/components/AppLayout/AppLayout";
import Box from "@/components/Box/Box";
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

export type CurriculumSequencePageProps = {
  data: curriculumSubjectPhaseOverviewData;
  subjectPhaseOptions: SubjectPhasePickerData;
};

const CurriculumSequencePage: NextPage<CurriculumSequencePageProps> = ({
  data,
  subjectPhaseOptions,
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
        <SequenceTab
          {...{
            threads: [
              "Algebra",
              "Geometry and Measure",
              "Number",
              "Probability",
              "Ratio and Proportion",
              "Statistics",
            ],
            units: [
              "Counting, recognising and comparing numbers 0-10",
              "Counting to and from 20",
              "Counting in tens - decade numbers",
              "Pattern in counting from 20 to 100",
              "Comparing quantities - part whole relationships",
              "Composition of numbers 0 to 5",
              "Recognise, compose, decompose and manipulate 3D shapes",
              " Composition of numbers 6 to 10",
            ],
          }}
        />
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
  CurriculumSequencePageProps
> = async (context) => {
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

      const results: GetStaticPropsResult<CurriculumSequencePageProps> = {
        props: {
          data: overviewData,
          subjectPhaseOptions: subjectPhaseData,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default CurriculumSequencePage;
