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
} from "../../../../../node-lib/isr";
import type { KeyStageTitleValueType } from "../../../../../browser-lib/avo/Avo";
import AppLayout from "../../../../../components/AppLayout";
import Flex from "../../../../../components/Flex";
import MaxWidth from "../../../../../components/MaxWidth/MaxWidth";
import { getSeoProps } from "../../../../../browser-lib/seo/getSeoProps";
import usePagination from "../../../../../components/Pagination/usePagination";
import curriculumApi, {
  UnitListingData,
} from "../../../../../node-lib/curriculum-api";
import UnitList from "../../../../../components/UnitAndLessonLists/UnitList";
import Grid, { GridArea } from "../../../../../components/Grid";
import Box from "../../../../../components/Box";
import LearningThemeFilters from "../../../../../components/Filters/LearningThemeFilters";
import MobileFilters from "../../../../../components/MobileFilters";
import { Heading } from "../../../../../components/Typography";
import TabularNav from "../../../../../components/TabularNav";
import { RESULTS_PER_PAGE } from "../../../../../utils/resultsPerPage";
import { ViewType } from "../../../../../common-lib/urls";
import getPageProps from "../../../../../node-lib/getPageProps";
import curriculumApi2023 from "../../../../../node-lib/curriculum-api-2023";
import { filterLearningTheme } from "../../../../../utils/filterLearningTheme/filterLearningTheme";

import HeaderListing from "@/components/HeaderListing/HeaderListing";

export type UnitListingPageProps = {
  curriculumData: UnitListingData;
  viewType: ViewType;
};

const UnitListingPage: NextPage<UnitListingPageProps> = ({
  curriculumData,
  viewType,
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
    learningThemes,
    examBoardTitle,
  } = curriculumData;

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
            oakLinkProps: { page: "home", viewType: "teachers" },
            label: "Home",
          },
          {
            oakLinkProps: {
              page: "subject-index",
              viewType: "teachers",
              keyStageSlug,
            },
            label: keyStageTitle,
          },
          {
            oakLinkProps: {
              page: "unit-index",
              viewType: "teachers",
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
        isNew={viewType === "teachers-2023"}
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
                    Learning themes
                  </Heading>
                  <LearningThemeFilters
                    labelledBy={learningThemesId}
                    learningThemes={learningThemes}
                    selectedThemeSlug={themeSlug ? themeSlug : "all"}
                    linkProps={{
                      page: "unit-index",
                      viewType: "teachers",
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

          <GridArea $order={[1, 0]} $colSpan={[12, 8, 9]} $mt={[16, 56]}>
            <Flex $flexDirection={["column-reverse", "column"]}>
              <Flex
                $flexDirection={"row"}
                $minWidth={"100%"}
                $justifyContent={"space-between"}
                $position={"relative"}
                $alignItems={"center"}
                $mb={16}
              >
                <Flex $position={["absolute", "relative"]}>
                  <Heading $font={["heading-6", "heading-5"]} tag={"h2"}>
                    {`Units (${unitsFilteredByLearningTheme.length})`}
                  </Heading>
                </Flex>
                {learningThemes?.length > 1 && (
                  <MobileFilters
                    providedId={learningThemesFilterId}
                    label="Learning themes"
                    $mt={0}
                  >
                    <LearningThemeFilters
                      labelledBy={learningThemesFilterId}
                      learningThemes={learningThemes}
                      selectedThemeSlug={themeSlug ? themeSlug : "all"}
                      linkProps={{
                        page: "unit-index",
                        viewType: "teachers",
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
                    $mb={[10, 16]}
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
                        viewType: "teachers",
                        isCurrent: tierSlug === slug,
                        currentStyles: ["color", "text-underline"],
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
  viewType: ViewType;
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

      const curriculumData =
        context?.params?.viewType === "teachers-2023"
          ? await curriculumApi2023.unitListing({
              programmeSlug,
            })
          : await curriculumApi.unitListing({
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
          viewType: context?.params?.viewType,
        },
      };

      return results;
    },
  });
};

export default UnitListingPage;
