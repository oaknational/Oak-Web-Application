import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { capitalize } from "lodash";

import CMSClient from "@/node-lib/cms";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import CurriculumHeader from "@/components/pages/CurriculumInfo/CurriculumHeader/CurriculumHeader";
import OverviewTab from "@/components/pages/CurriculumInfo/tabs/OverviewTab/OverviewTab";
import UnitsTab from "@/components/pages/CurriculumInfo/tabs/UnitsTab/UnitsTab";
import AppLayout from "@/components/AppLayout/AppLayout";
import Box from "@/components/Box/Box";
import curriculumApi, {
  CurriculumUnitsTabData,
  CurriculumOverviewMVData,
} from "@/node-lib/curriculum-api-2023";
// import { BETA_SEO_PROPS } from "@/browser-lib/seo/Seo";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { SubjectPhasePickerData } from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import { fetchSubjectPhasePickerData } from "@/pages/teachers/curriculum/index";
import getPageProps from "@/node-lib/getPageProps";
import OakError from "@/errors/OakError";

export type CurriculumSelectionSlugs = {
  phaseSlug: string;
  subjectSlug: string;
  examboardSlug: string | null;
};

export type CurriculumInfoPageProps = {
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
  subjectPhaseOptions: SubjectPhasePickerData;
  curriculumOverviewTabData: CurriculumOverviewMVData;
  curriculumOverviewSanityData: CurriculumOverviewSanityData;
  curriculumUnitsTabData: CurriculumUnitsTabData;
};

const VALID_TABS = ["overview", "units"] as const;
export type CurriculumTab = (typeof VALID_TABS)[number];

const CurriculumInfoPage: NextPage<CurriculumInfoPageProps> = ({
  curriculumSelectionSlugs,
  subjectPhaseOptions,
  curriculumOverviewTabData,
  curriculumUnitsTabData,
  curriculumOverviewSanityData,
}) => {
  const router = useRouter();
  const tab = router.query.tab as CurriculumTab;

  const { subjectSlug, examboardSlug, phaseSlug } = curriculumSelectionSlugs;

  let keyStagesData: string;
  switch (phaseSlug) {
    case "primary":
      keyStagesData = `KS1-2`;
      break;
    case "secondary":
      keyStagesData = `KS3-4`;
      break;
    default:
      keyStagesData = "";
      break;
  }

  const pageTitleData = `${keyStagesData} ${capitalize(subjectSlug)} ${
    examboardSlug ? capitalize(examboardSlug) : ""
  } Curriculum Plans | Oak National Academy`;

  const pageDescriptionData = `Looking for ${keyStagesData} ${subjectSlug} curriculum? We have sequenced curriculum plans, select by key stage. Our free resources are easy to browse and explore.`;

  const [curriculumTabTitleData, setCurriculumTabTitleData] =
    useState<string>(pageTitleData);
  const [curriculumTabDescriptionData, setCurriculumTabDescriptionData] =
    useState<string>(pageDescriptionData);

  let tabContent: JSX.Element;
  switch (tab) {
    case "overview":
      tabContent = (
        <OverviewTab
          data={{
            curriculumInfo: curriculumOverviewTabData,
            curriculumCMSInfo: curriculumOverviewSanityData,
            curriculumSelectionSlugs,
          }}
        />
      );
      setCurriculumTabTitleData(
        `${keyStagesData} ${capitalize(subjectSlug)} ${
          examboardSlug ? capitalize(examboardSlug) : ""
        } Curriculum Plans | Oak National Academy`,
      );
      setCurriculumTabDescriptionData(
        `Looking for ${keyStagesData} ${subjectSlug} curriculum? We have sequenced curriculum plans, select by key stage. Our free resources are easy to browse and explore.`,
      );
      break;
    case "units":
      tabContent = <UnitsTab data={curriculumUnitsTabData} />;
      setCurriculumTabTitleData(
        `${keyStagesData} ${capitalize(subjectSlug)} ${
          examboardSlug ? capitalize(examboardSlug) : ""
        } Curriculum Unit Sequences | Oak National Academy`,
      );
      setCurriculumTabDescriptionData(
        `Explore our free ${keyStagesData} ${subjectSlug} curriculum unit sequences, easily select units and topics and view in our interactive tool now`,
      );
      break;
    default:
      throw new Error("Not a valid tab");
  }

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: curriculumTabTitleData,
          description: curriculumTabDescriptionData,
        }),
      }}
      $background={"white"}
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
  tab: "units" | "overview";
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
  const lastSlug = parts.pop() ?? null;
  let phaseSlug: string | null, examboardSlug: string | null;
  // Use phase to determine if examboard is present
  if (lastSlug && ["primary", "secondary"].includes(lastSlug)) {
    examboardSlug = null;
    phaseSlug = lastSlug;
  } else {
    examboardSlug = lastSlug;
    phaseSlug = parts.pop() ?? null;
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
      const isPreviewMode = context.preview === true;
      if (!VALID_TABS.includes(tab)) {
        throw new OakError({
          code: "curriculum-api/not-found",
        });
      }
      const slugs = parseSubjectPhaseSlug(context.params.subjectPhaseSlug);
      const curriculumOverviewTabData = await curriculumApi.curriculumOverview({
        subjectSlug: slugs.subjectSlug,
        phaseSlug: slugs.phaseSlug,
      });

      const curriculumOverviewSanityData =
        await CMSClient.curriculumOverviewPage({
          previewMode: isPreviewMode,
          ...slugs,
        });

      if (!curriculumOverviewSanityData) {
        return {
          notFound: true,
        };
      }
      const curriculumUnitsTabData = await curriculumApi.curriculumUnits(slugs);
      const subjectPhaseOptions = await fetchSubjectPhasePickerData();
      const results: GetStaticPropsResult<CurriculumInfoPageProps> = {
        props: {
          curriculumSelectionSlugs: slugs,
          subjectPhaseOptions,
          curriculumOverviewTabData,
          curriculumOverviewSanityData,
          curriculumUnitsTabData,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default CurriculumInfoPage;
