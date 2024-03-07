import React, { useId } from "react";
import { useRouter } from "next/router";
import { useTheme } from "styled-components";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { OakGrid, OakGridArea, OakHeading } from "@oaknational/oak-components";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import type { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import curriculumApi, { UnitListingData } from "@/node-lib/curriculum-api";
import UnitList from "@/components/TeacherComponents/UnitList";
import Box from "@/components/SharedComponents/Box";
import UnitsLearningThemeFilters from "@/components/TeacherComponents/UnitsLearningThemeFilters";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import TabularNav from "@/components/SharedComponents/TabularNav";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { filterLearningTheme } from "@/utils/filterLearningTheme/filterLearningTheme";
import HeaderListing from "@/components/TeacherComponents/HeaderListing/HeaderListing";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { UnitListItemProps } from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import { IndividualSpecialistUnit } from "@/components/TeacherViews/SpecialistUnitListing/SpecialistUnitListing.view";
import { NEW_COHORT } from "@/config/cohort";
import isSlugLegacyOrEYFS from "@/utils/slugModifiers/isSlugLegacyOrEYFS";

export type UnitListingPageProps = {
  curriculumData: UnitListingData;
};

const UnitListingPage: NextPage<UnitListingPageProps> = ({
  curriculumData,
}) => {
  const {
    programmeSlug,
    keyStageTitle,
    keyStageSlug,
    subjectTitle,
    subjectSlug,
    tierSlug,
    tiers,
    units,
    examBoardTitle,
    hasNewContent,
  } = curriculumData;

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const learningThemes = curriculumData.learningThemes ?? [];

  const router = useRouter();
  const themeSlug = router.query["learning-theme"]?.toString();

  const unitsFilteredByLearningTheme = filterLearningTheme(themeSlug, units);

  const paginationProps = usePagination({
    totalResults: unitsFilteredByLearningTheme.length,
    pageSize: RESULTS_PER_PAGE,
    items: unitsFilteredByLearningTheme,
  });

  const { currentPageItems, paginationTitle } = paginationProps;

  const theme = useTheme();

  const HEADER_HEIGHT = theme.header.height;

  const learningThemesId = useId();
  const learningThemesFilterId = useId();

  const tiersSEO = {
    ...getSeoProps({
      title: `${keyStageTitle} ${subjectTitle} tiers${paginationTitle}`,
      description: `We have resources for tiers: ${tiers
        .map((tier) => tier.tierTitle)
        .join(", ")}`,
    }),
    ...{ noFollow: true, noIndex: true },
  };

  const unitsSEO = {
    ...getSeoProps({
      title: `Free ${keyStageSlug.toUpperCase()} ${subjectTitle} Teaching Resources for Lesson Planning${paginationTitle}`,
      description: "Programme units",
    }),
    ...{ noFollow: true, noIndex: true },
  };

  const trackUnitSelected = ({
    ...props
  }: UnitListItemProps | IndividualSpecialistUnit) => {
    // Temporary until tracking for specialist units
    const isSpecialistUnit = (
      x: UnitListItemProps | IndividualSpecialistUnit,
    ): x is IndividualSpecialistUnit => {
      return "developmentalStageTitle" in x;
    };

    if (!isSpecialistUnit(props)) {
      return track.unitSelected({
        keyStageTitle: props.keyStageTitle as KeyStageTitleValueType,
        keyStageSlug,
        subjectTitle,
        subjectSlug,
        unitName: props.title,
        unitSlug: props.slug,
        analyticsUseCase,
      });
    }
  };

  return (
    <AppLayout
      seoProps={
        tierSlug
          ? programmeSlug.includes(tierSlug)
            ? unitsSEO
            : tiersSEO
          : unitsSEO
      }
    >
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
            label: keyStageTitle,
          },
          {
            oakLinkProps: {
              page: "unit-index",

              programmeSlug,
            },
            label: subjectTitle,
            disabled: true,
          },
        ]}
        background={"lavender30"}
        subjectIconBackgroundColor={"lavender"}
        title={`${subjectTitle} ${examBoardTitle ? examBoardTitle : ""}`}
        programmeFactor={keyStageTitle}
        isNew={hasNewContent ?? false}
        hasCurriculumDownload={isSlugLegacy(programmeSlug)}
        {...curriculumData}
      />
      <MaxWidth $ph={16}>
        <OakGrid>
          <OakGridArea
            $order={[0, 2]}
            $colSpan={[12, 4, 3]}
            $pl={["inner-padding-xl"]}
          >
            <Box
              $display={["none", "block"]}
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $mt={[0, 24]}
              $pt={[48]}
            >
              {learningThemes?.length > 1 && (
                <Flex $flexDirection={"column"}>
                  <OakHeading
                    id={learningThemesId}
                    tag="h3"
                    $font="body-3"
                    $mb="space-between-s"
                  >
                    {/* Though still called "Learning themes" internally, these should be referred to as "Threads" in user facing displays */}
                    Filter by thread
                  </OakHeading>
                  <UnitsLearningThemeFilters
                    labelledBy={learningThemesId}
                    learningThemes={learningThemes}
                    selectedThemeSlug={themeSlug ? themeSlug : "all"}
                    linkProps={{
                      page: "unit-index",
                      programmeSlug,
                    }}
                    trackingProps={{
                      keyStageSlug,
                      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
                      subjectTitle,
                      subjectSlug,
                    }}
                  />
                </Flex>
              )}
            </Box>
          </OakGridArea>

          <OakGridArea
            $order={[1, 0]}
            $colSpan={[12, 8, 9]}
            $mt={"space-between-m2"}
          >
            <Flex $flexDirection={["column-reverse", "column"]}>
              <Flex
                $flexDirection={"row"}
                $minWidth={"100%"}
                $justifyContent={"space-between"}
                $position={"relative"}
                $alignItems={"center"}
              >
                {tiers.length === 0 && (
                  <Flex $minWidth={120} $mb={16} $position={"relative"}>
                    <OakHeading $font={"heading-5"} tag={"h2"}>
                      {`Units (${unitsFilteredByLearningTheme.length})`}
                    </OakHeading>
                  </Flex>
                )}

                {learningThemes.length > 1 && (
                  <MobileFilters
                    providedId={learningThemesFilterId}
                    label="Threads"
                    $mt={0}
                    $mb={[16, 0]}
                  >
                    <UnitsLearningThemeFilters
                      labelledBy={learningThemesFilterId}
                      learningThemes={learningThemes}
                      selectedThemeSlug={themeSlug ? themeSlug : "all"}
                      linkProps={{
                        page: "unit-index",
                        programmeSlug,
                      }}
                      trackingProps={{
                        keyStageSlug,
                        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
                        subjectTitle,
                        subjectSlug,
                      }}
                    />
                  </MobileFilters>
                )}
              </Flex>

              {tiers.length > 0 && (
                <nav aria-label="tiers" data-testid="tiers-nav">
                  <TabularNav
                    $mb={[10, 24]}
                    label="tiers"
                    links={tiers.map(
                      ({
                        tierTitle: title,
                        tierSlug: slug,
                        tierProgrammeSlug,
                      }) => ({
                        label: title,
                        programmeSlug: tierProgrammeSlug,
                        page: "unit-index",
                        isCurrent: tierSlug === slug,
                        currentStyles: ["underline"],
                      }),
                    )}
                  />
                </nav>
              )}
            </Flex>
            <UnitList
              {...curriculumData}
              currentPageItems={currentPageItems}
              paginationProps={paginationProps}
              onClick={trackUnitSelected}
            />
          </OakGridArea>
        </OakGrid>
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  programmeSlug: string;
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
  UnitListingPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "unit-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { programmeSlug } = context.params;

      const curriculumData = isSlugLegacyOrEYFS(programmeSlug)
        ? await curriculumApi.unitListing({
            programmeSlug,
          })
        : await curriculumApi2023.unitListing({
            programmeSlug,
            isLegacy: programmeSlug.endsWith("early-years-foundation-stage-l"),
          });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const unitsCohorts = curriculumData.units.flatMap((unit) =>
        unit.flatMap((u) => u.cohort ?? "2020-2023"),
      );
      const hasNewContent = unitsCohorts.includes(NEW_COHORT);

      const results: GetStaticPropsResult<UnitListingPageProps> = {
        props: {
          curriculumData: {
            ...curriculumData,
            hasNewContent,
          },
        },
      };

      return results;
    },
  });
};

export default UnitListingPage;
