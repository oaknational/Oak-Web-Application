import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React from "react";

import CMSClient from "@/node-lib/cms";
import CurriculumHeader from "@/components/pages/CurriculumInfo/CurriculumHeader/CurriculumHeader";
import OverviewTab from "@/components/pages/CurriculumInfo/tabs/OverviewTab/OverviewTab";
import Box from "@/components/Box/Box";
import AppLayout from "@/components/AppLayout/AppLayout";
import curriculumApi, {
  CurriculumOverviewTabData,
} from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewPage } from "@/common-lib/cms-types";
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
  sanityData: CurriculumOverviewPage;
  subjectPhaseOptions: SubjectPhasePickerData;
  slug: string;
};

const OverviewPage: NextPage<OverviewPageProps> = ({
  overviewData,
  sanityData,
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
        data={overviewData}
        subjectPhaseOptions={subjectPhaseOptions}
        pageSlug={slug}
        tab="overview"
      />

      <Box $background={"white"}>
        <OverviewTab
          curriculumInfo={overviewData}
          curriculumCMSInfo={sanityData}
          slug={slug}
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
      const isPreviewMode = context.preview === true;

      // Parse and use params instead of "maths" and "secondary" when MV is ready
      const slug = context.params?.subjectPhaseSlug;
      const overviewData = await curriculumApi.curriculumOverview({ slug });
      const phaseSlug = slug.includes("primary") ? "primary" : "secondary";

      const [subjectSlug, examboardSlug] = slug.split("-" + phaseSlug);
      // examboardSlug = examboardSlug?.replace("-", "");
      console.log(subjectSlug, phaseSlug, examboardSlug);
      const params = { subjectSlug, phaseSlug };

      const subjectPhaseData = await fetchSubjectPhasePickerData();
      const sanityData = await CMSClient.curriculumOverviewPage({
        previewMode: isPreviewMode,
        ...params,
      });

      if (!sanityData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<OverviewPageProps> = {
        props: {
          overviewData: { ...overviewData, subjectSlug: "maths" },
          sanityData,
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
