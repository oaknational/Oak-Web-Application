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
import TitleCard from "../../../../../components/Card/SubjectUnitLessonTitleCard";
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
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import CurriculumDownloadButton from "../../../../../components/CurriculumDownloadButtons/CurriculumDownloadButton";
import { RESULTS_PER_PAGE } from "../../../../../utils/resultsPerPage";
import { VIEW_TYPES, ViewType } from "../../../../../common-lib/urls";
import getPageProps from "../../../../../node-lib/getPageProps";
import curriculumApi2023 from "../../../../../node-lib/curriculum-api-2023";

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
    learningThemes,
    totalUnitCount,
    examBoardTitle,
  } = curriculumData;

  const router = useRouter();
  const themeSlug = router.query["learning-theme"]?.toString();

  const unitsFilteredByLearningTheme = themeSlug
    ? units.filter((unit) => unit.themeSlug === themeSlug)
    : units;

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
      <MaxWidth $ph={16}>
        <Box $mv={[24, 48]}>
          <Breadcrumbs
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
          />
        </Box>

        <TitleCard
          page={"subject"}
          keyStage={keyStageTitle}
          keyStageSlug={keyStageSlug}
          title={`${subjectTitle} ${examBoardTitle ? examBoardTitle : ""}`}
          slug={subjectSlug}
          $mt={0}
          $mb={24}
          $alignSelf={"flex-start"}
        />
        <CurriculumDownloadButton
          keyStageSlug={keyStageSlug}
          keyStageTitle={keyStageTitle}
          subjectSlug={subjectSlug}
          subjectTitle={subjectTitle}
          tier={tierSlug}
        />

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
                    {`Units (${totalUnitCount})`}
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
                      })
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

  const { programmes } = await curriculumApi.unitListingPaths();

  const paths = VIEW_TYPES.flatMap((viewType) =>
    programmes.map((programme) => ({
      params: { viewType, programmeSlug: programme.programmeSlug },
    }))
  );
  const config: GetStaticPathsResult<URLParams> = {
    fallback: false,
    paths,
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
        },
      };

      return results;
    },
  });
};

export default UnitListingPage;
