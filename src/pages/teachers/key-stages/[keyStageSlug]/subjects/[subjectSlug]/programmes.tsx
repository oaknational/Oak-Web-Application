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

  const tiersSEO = {
    ...getSeoProps({
      title: `${keyStageTitle} ${subjectTitle} tiers`,
      description: `We have resources for tiers: ${programmes
        .filter((programme) => programme.tierTitle)
        .map((programme) => programme.tierTitle)
        .join(", ")}`,
    }),
    ...{ noFollow: true, noIndex: true },
  };
  return (
    <AppLayout seoProps={tiersSEO}>
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
        isLegacyLesson={isSlugLegacy(subjectSlug)}
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

      const curriculumData = isSlugLegacy(context.params?.subjectSlug)
        ? await curriculumApi.tierListing({
            keyStageSlug: context.params?.keyStageSlug,
            subjectSlug: context.params?.subjectSlug,
          })
        : await curriculumApi2023.programmeListingPage({
            keyStageSlug: context.params?.keyStageSlug,
            subjectSlug: context.params?.subjectSlug,
          });

      const results = {
        props: {
          ...curriculumData,
        },
      };

      return results;
    },
  });
};

export default ProgrammesListingPage;
