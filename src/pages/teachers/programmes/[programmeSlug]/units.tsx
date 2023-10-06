import React, { useId } from "react";
import { useRouter } from "next/router";
import { useTheme } from "styled-components";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import type { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import AppLayout from "@/components/AppLayout";
import Flex from "@/components/Flex";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import usePagination from "@/components/Pagination/usePagination";
import curriculumApi, { UnitListingData } from "@/node-lib/curriculum-api";
import UnitList from "@/components/UnitAndLessonLists/UnitList";
import Grid, { GridArea } from "@/components/Grid";
import Box from "@/components/Box";
import LearningThemeFilters from "@/components/Filters/LearningThemeFilters";
import MobileFilters from "@/components/MobileFilters";
import { Heading } from "@/components/Typography";
import TabularNav from "@/components/TabularNav";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { filterLearningTheme } from "@/utils/filterLearningTheme/filterLearningTheme";
import HeaderListing from "@/components/HeaderListing/HeaderListing";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

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
  } = curriculumData;

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
        isNew={!isSlugLegacy(programmeSlug)}
        hasCurriculumDownload={isSlugLegacy(programmeSlug)}
        {...curriculumData}
      />
      <MaxWidth $ph={16}>
        <Grid>
          <GridArea $order={[0, 2]} $colSpan={[12, 4, 3]} $pl={[32]}>
            <Box
              $display={["none", "block"]}
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $mt={[0, 24]}
              $pt={[48]}
            >
              {learningThemes?.length > 1 && (
                <Flex $flexDirection={"column"}>
                  <Heading
                    id={learningThemesId}
                    tag="h3"
                    $font="body-3"
                    $mb={16}
                  >
                    {/* Though still called "Learning themes" internally, these should be referred to as "Threads" in user facing displays */}
                    Filter by thread
                  </Heading>
                  <LearningThemeFilters
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
          </GridArea>

          <GridArea $order={[1, 0]} $colSpan={[12, 8, 9]} $mt={32}>
            <Flex $flexDirection={["column-reverse", "column"]}>
              <Flex
                $flexDirection={"row"}
                $minWidth={"100%"}
                $justifyContent={"space-between"}
                $position={"relative"}
                $alignItems={"center"}
              >
                {tiers.length === 0 && (
                  <Flex $minWidth={300} $mb={16} $position={"relative"}>
                    <Heading $font={["heading-7", "heading-5"]} tag={"h2"}>
                      {`Units (${unitsFilteredByLearningTheme.length})`}
                    </Heading>
                  </Flex>
                )}

                {learningThemes.length > 1 && (
                  <MobileFilters
                    providedId={learningThemesFilterId}
                    label="Threads"
                    $mt={0}
                    $mb={[16, 0]}
                  >
                    <LearningThemeFilters
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
            />
          </GridArea>
        </Grid>
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

      const curriculumData = isSlugLegacy(programmeSlug)
        ? await curriculumApi.unitListing({
            programmeSlug,
          })
        : await curriculumApi2023.unitListing({
            programmeSlug,
          });

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
    },
  });
};

export default UnitListingPage;
