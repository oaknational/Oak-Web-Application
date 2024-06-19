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
import UnitList from "@/components/TeacherComponents/UnitList";
import Box from "@/components/SharedComponents/Box";
import UnitsLearningThemeFilters from "@/components/TeacherComponents/UnitsLearningThemeFilters";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import TabularNav from "@/components/SharedComponents/TabularNav";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import filterLearningTheme from "@/utils/filterLearningTheme/filterLearningTheme";
import HeaderListing from "@/components/TeacherComponents/HeaderListing/HeaderListing";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { UnitListItemProps } from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import { SpecialistUnit } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";

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

  const unitsSEO = {
    ...getSeoProps({
      title: `Free ${keyStageSlug.toUpperCase()} ${subjectTitle} teaching resources${paginationTitle}`,
      description: `Get fully sequenced teaching resources and lesson plans in ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
    }),
  };

  const trackUnitSelected = ({
    ...props
  }: UnitListItemProps | SpecialistUnit) => {
    // Temporary until tracking for specialist units
    const isSpecialistUnit = (
      x: UnitListItemProps | SpecialistUnit,
    ): x is SpecialistUnit => {
      return "developmentStageTitle" in x;
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
    <AppLayout seoProps={unitsSEO}>
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
            label: toSentenceCase(keyStageTitle),
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
        programmeFactor={toSentenceCase(keyStageTitle)}
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

      try {
        const curriculumData = await curriculumApi2023.unitListing({
          programmeSlug,
        });

        if (programmeSlug.startsWith("maths-")) {
          const legacyCurriculumData = await curriculumApi2023.unitListing({
            programmeSlug: programmeSlug + "-l",
          });

          curriculumData.units = [
            ...curriculumData.units,
            ...legacyCurriculumData.units,
          ];
        }

        if (!curriculumData) {
          return {
            notFound: true,
          };
        }

        const results: GetStaticPropsResult<UnitListingPageProps> = {
          props: {
            curriculumData,
          },
        };

        return results;
      } catch (error) {
        return {
          notFound: true,
        };
      }
    },
  });
};

export default UnitListingPage;
