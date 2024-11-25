import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import SubjectProgrammeListing from "@/components/TeacherComponents/SubjectProgrammeListing";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import HeaderListing from "@/components/TeacherComponents/HeaderListing/HeaderListing";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import removeLegacySlugSuffix from "@/utils/slugModifiers/removeLegacySlugSuffix";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { programmeListingPage } from "@/node-lib/curriculum-api-2023";

const ProgrammesListingPage: NextPage<ProgrammeListingPageData> = (props) => {
  const {
    programmes,
    keyStageSlug,
    subjectSlug,
    keyStageTitle,
    subjectTitle,
    legacy,
  } = props;
  if (!programmes[0]) {
    throw new Error("No programmes");
  }
  const { track } = useAnalytics();

  const handleProgrammeClick = (
    programme: ProgrammeListingPageData["programmes"][number],
  ) => {
    const { tierTitle, examBoardTitle } = programme;

    const filterValue =
      examBoardTitle && tierTitle
        ? `${examBoardTitle}, ${tierTitle}`
        : examBoardTitle
          ? examBoardTitle
          : tierTitle;

    const filterType =
      examBoardTitle && tierTitle
        ? "Exam board / tier filter"
        : examBoardTitle
          ? "Exam board filter"
          : "Tier filter";

    filterValue &&
      track.browseRefined({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "refine",
        componentType: "programme_card",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        filterType,
        filterValue,
        activeFilters: { keyStage: [keyStageSlug], subject: [subjectSlug] },
      });
  };

  // SEO Methods
  const generateTierString = (tiers: Array<string>) => {
    if (tiers.length === 2) {
      return `${tiers[0]} or ${tiers[1]} tier`;
    } else {
      return `${tiers.slice(0, -1).join(", ")} or ${tiers.slice(-1)} tier`;
    }
  };
  const tiers = programmes
    .map((programme) => programme.tierTitle?.toLowerCase())
    .filter(Boolean)
    .filter((tier, index, self) => self.indexOf(tier) === index);

  const hasExamBoards = programmes.some(
    (programme) => programme.examBoardTitle,
  );

  const getSEOTitle = () => {
    if (hasExamBoards) {
      return `${keyStageTitle} ${subjectTitle} exam boards`;
    } else {
      return `${keyStageTitle} ${subjectTitle} tiers`;
    }
  };

  const getSEODescription = () => {
    if (tiers.length > 0 && hasExamBoards) {
      return `Choose ${generateTierString(
        tiers as string[],
      )} from the most popular exam boards in GCSE ${subjectTitle}`;
    } else if (tiers.length > 0) {
      return `Choose ${generateTierString(
        tiers as string[],
      )} for GCSE ${subjectTitle}`;
    } else {
      return `Choose from the most popular exam boards in GCSE ${subjectTitle}`;
    }
  };

  const programmesSEO = {
    ...getSeoProps({
      title: getSEOTitle(),
      description: getSEODescription(),
    }),
  };

  return (
    <AppLayout seoProps={programmesSEO}>
      <HeaderListing
        breadcrumbs={[
          {
            oakLinkProps: { page: "home" },
            label: "Home",
          },
          {
            oakLinkProps: {
              page: "subject-index",
              keyStageSlug,
            },
            label: keyStageTitle ?? "",
          },
          {
            oakLinkProps: {
              page: "programme-index",
              subjectSlug: subjectSlug,
              keyStageSlug,
            },
            label: subjectTitle,
          },
        ]}
        background={"lavender30"}
        subjectIconBackgroundColor={"lavender"}
        title={subjectTitle}
        programmeFactor={keyStageTitle}
        hasCurriculumDownload={legacy}
        {...props}
        subjectSlug={subjectSlug}
        isNew={!legacy} // we have no way to know if it's new based on cohort information at this level
      />
      <MaxWidth $mb={[56, 80]} $mt={[56, 72]} $ph={16}>
        <SubjectProgrammeListing {...props} onClick={handleProgrammeClick} />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  keyStageSlug: string;
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
  ProgrammeListingPageData,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "teachers-programme-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context params");
      }

      const { subjectSlug, keyStageSlug } = context.params;

      const isLegacy = isSlugLegacy(subjectSlug);
      const curriculumData = await programmeListingPage({
        keyStageSlug: keyStageSlug,
        subjectSlug: isLegacy
          ? removeLegacySlugSuffix(subjectSlug)
          : subjectSlug,
        isLegacy: isLegacy,
      });

      const results = {
        props: {
          ...curriculumData,
          legacy: isLegacy,
        },
      };

      return results;
    },
  });
};

export default ProgrammesListingPage;
