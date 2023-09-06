import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React from "react";
import { useRouter } from "next/router";

import CurriculumHeader from "@/components/pages/CurriculumInfo/CurriculumHeader/CurriculumHeader";
import OverviewTab from "@/components/pages/CurriculumInfo/tabs/OverviewTab/OverviewTab";
import UnitsTab from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";
import DownloadsTab from "@/components/pages/CurriculumInfo/tabs/DownloadsTab/DownloadsTab";
import AppLayout from "@/components/AppLayout/AppLayout";
import Box from "@/components/Box/Box";
import curriculumApi, {
  CurriculumDownloadsTabData,
  CurriculumOverviewTabData,
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
import OakError from "@/errors/OakError";

export type CurriculumSelectionSlugs = {
  phaseSlug: string;
  subjectSlug: string;
  examboardSlug: string | null;
};

export type CurriculumInfoPageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  subjectPhaseOptions: SubjectPhasePickerData;
  curriculumOverviewTabData: CurriculumOverviewTabData;
  curriculumUnitsTabData: CurriculumUnitsTabData;
  curriculumDownloadsTabData: CurriculumDownloadsTabData;
};

const VALID_TABS = ["overview", "units", "downloads"] as const;
export type CurriculumTab = typeof VALID_TABS[number];

const CurriculumInfoPage: NextPage<CurriculumInfoPageProps> = ({
  curriculumSelectionSlugs,
  subjectPhaseOptions,
  curriculumOverviewTabData,
  curriculumUnitsTabData,
  curriculumDownloadsTabData,
}) => {
  const router = useRouter();
  const tab = router.query.tab as CurriculumTab;

  let tabContent;
  switch (tab) {
    case "overview":
      tabContent = <OverviewTab data={curriculumOverviewTabData} />;
      break;
    case "units":
      tabContent = <UnitsTab data={curriculumUnitsTabData} />;
      break;
    case "downloads":
      tabContent = <DownloadsTab data={curriculumDownloadsTabData} />;
      break;
  }

  return (
    <AppLayout
      seoProps={BETA_SEO_PROPS}
      $background={"white"}
      headerVariant="landing-pages"
    >
      <CurriculumHeader
        subjectPhaseOptions={subjectPhaseOptions}
        curriculumSelectionSlugs={curriculumSelectionSlugs}
        color1="mint"
        color2="mint30"
      />

      <Box $background={"white"}>{tabContent}</Box>
    </AppLayout>
  );
};

export type URLParams = {
  tab: "units" | "overview" | "downloads";
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

export const parseSubjectPhaseSlug = (slug: string) => {
  const parts = slug.split("-");
  const lastSlug = parts.pop();
  let phaseSlug, examboardSlug;
  // Update below if any new examboards are added
  if (lastSlug && ["aqa", "edexcel", "ocr"].includes(lastSlug)) {
    examboardSlug = lastSlug;
    phaseSlug = parts.pop();
  } else {
    examboardSlug = null;
    phaseSlug = lastSlug;
  }
  const subjectSlug = parts.join("-");
  if (!subjectSlug || !phaseSlug) {
    throw new OakError({
      code: "curriculum-api/params-incorrect",
    });
  }
  return {
    phaseSlug: phaseSlug,
    subjectSlug: subjectSlug,
    examboardSlug: examboardSlug,
  };
};

export const getStaticProps: GetStaticProps<
  CurriculumInfoPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "curriculum-info::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("Missing params");
      }
      const tab = context.params.tab;
      if (!VALID_TABS.includes(tab)) {
        throw new OakError({
          code: "curriculum-api/not-found",
        });
      }
      const slugs = parseSubjectPhaseSlug(context.params.subjectPhaseSlug);
      const curriculumOverviewTabData = await curriculumApi.curriculumOverview(
        slugs
      );
      const curriculumUnitsTabData = await curriculumApi.curriculumUnits(slugs);
      const curriculumDownloadsTabData =
        await curriculumApi.curriculumDownloads(slugs);
      const subjectPhaseOptions = await fetchSubjectPhasePickerData();
      const results: GetStaticPropsResult<CurriculumInfoPageProps> = {
        props: {
          curriculumSelectionSlugs: slugs,
          subjectPhaseOptions,
          curriculumOverviewTabData,
          curriculumUnitsTabData,
          curriculumDownloadsTabData,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default CurriculumInfoPage;
