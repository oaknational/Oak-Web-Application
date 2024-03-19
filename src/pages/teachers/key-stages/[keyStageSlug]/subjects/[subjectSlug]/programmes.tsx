import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import curriculumApi from "@/node-lib/curriculum-api";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import SubjectProgrammeListing from "@/components/TeacherComponents/SubjectProgrammeListing";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import HeaderListing from "@/components/TeacherComponents/HeaderListing/HeaderListing";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import removeLegacySlugSuffix from "@/utils/slugModifiers/removeLegacySlugSuffix";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { isKeyStageTitleValueType } from "@/components/TeacherViews/Search/helpers";
import { keyStageToSentenceCase } from "@/context/Search/search.helpers";
import { generateProgrammeListing } from "@/components/TeacherComponents/helpers/programmeHelpers/generateCorrectProgrammes";

const ProgrammesListingPage: NextPage<ProgrammeListingPageData> = (props) => {
  const { programmes, keyStageSlug, subjectSlug, keyStageTitle, subjectTitle } =
    props;
  if (!programmes[0]) {
    throw new Error("No programmes");
  }
  const keyStageSentenceCase = keyStageToSentenceCase(keyStageTitle);

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const handleProgrammeClick = (
    programme: ProgrammeListingPageData["programmes"][number],
  ) => {
    "tierTitle" in programme &&
      keyStageSentenceCase &&
      programme.tierTitle !== null &&
      isKeyStageTitleValueType(keyStageSentenceCase) &&
      track.tierSelected({
        subjectTitle,
        subjectSlug,
        keyStageTitle: keyStageSentenceCase,
        keyStageSlug,
        tierName: programme.tierTitle,
        analyticsUseCase,
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
    ...{ noFollow: true, noIndex: true },
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
        hasCurriculumDownload={isSlugLegacy(subjectSlug)}
        {...props}
        subjectSlug={removeLegacySlugSuffix(subjectSlug)}
        isNew={!isSlugLegacy(subjectSlug)} // we have no way to know if it's new based on cohort information at this level
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
      const curriculumData = isSlugLegacy(subjectSlug)
        ? await curriculumApi.tierListing({
            keyStageSlug: keyStageSlug,
            subjectSlug: subjectSlug,
          })
        : await curriculumApi2023.programmeListingPage({
            keyStageSlug: keyStageSlug,
            subjectSlug: subjectSlug,
          });

      const generatedCurriculumData = generateProgrammeListing(
        curriculumData,
        isSlugLegacy(subjectSlug),
      );

      const results = {
        props: {
          ...generatedCurriculumData,
        },
      };

      return results;
    },
  });
};

export default ProgrammesListingPage;
