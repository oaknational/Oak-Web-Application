import React, { useId, useState } from "react";
import { useRouter } from "next/router";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakSecondaryButton,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";
import { examboards, tierSlugs } from "@oaknational/oak-curriculum-schema";
import { z } from "zod";
import styled from "styled-components";

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
import UnitsLearningThemeFilters from "@/components/TeacherComponents/UnitsLearningThemeFilters";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import TabularNav from "@/components/SharedComponents/TabularNav";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import filterUnits from "@/utils/filterUnits/filterUnits";
import HeaderListing from "@/components/TeacherComponents/HeaderListing/HeaderListing";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { UnitListItemProps } from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import { SpecialistUnit } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";
import NewContentBanner from "@/components/TeacherComponents/NewContentBanner/NewContentBanner";
import PaginationHead from "@/components/SharedComponents/Pagination/PaginationHead";
import { TierSchema } from "@/node-lib/curriculum-api-2023/queries/unitListing/tiers/tiers.schema";
import SubjectCategoryFilters from "@/components/TeacherComponents/SubjectCategoryFilters";
import YearGroupFilters from "@/components/TeacherComponents/YearGroupFilters";

export type UnitListingPageProps = {
  curriculumData: UnitListingData;
};

const StyledFieldset = styled.fieldset`
  border: 0px;
  margin: 0;
  padding: 0;
`;

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
    subjectCategories,
    yearGroups,
  } = curriculumData;

  const { track } = useAnalytics();

  const learningThemes = curriculumData.learningThemes ?? [];

  const router = useRouter();
  const themeSlug = router.query["learning-theme"]?.toString();
  const categorySlug = router.query["category"]?.toString();
  const yearGroupSlug = router.query["year"]?.toString();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [skipFiltersButton, setSkipFiltersButton] = useState(false);

  const filteredUnits = filterUnits(
    themeSlug,
    categorySlug,
    yearGroupSlug,
    units,
  );
  const paginationProps = usePagination({
    totalResults: filteredUnits.length,
    pageSize: RESULTS_PER_PAGE,
    items: filteredUnits,
  });

  const {
    paginationTitle,
    prevPageUrlObject,
    nextPageUrlObject,
    currentPageItems,
    isLastPage,
    isFirstPage,
  } = paginationProps;

  const learningThemesId = useId();
  const learningThemesFilterId = useId();

  const unitsSEO = {
    ...getSeoProps({
      title: `Free ${keyStageSlug.toUpperCase()} ${subjectTitle} teaching resources${paginationTitle}`,
      description: `Get fully sequenced teaching resources and lesson plans in ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
    }),
  };

  const trackUnitSelected = (
    props: UnitListItemProps | SpecialistUnit,
    examBoardTitle: z.infer<typeof examboards> | null,
    tierSlug: z.infer<typeof tierSlugs> | null,
    tiers: TierSchema,
  ) => {
    // Temporary until tracking for specialist units
    const isSpecialistUnit = (
      x: UnitListItemProps | SpecialistUnit,
    ): x is SpecialistUnit => {
      return "developmentStageTitle" in x;
    };

    if (!isSpecialistUnit(props)) {
      const tier = tiers.find((t) => t.tierSlug === tierSlug)?.tierTitle;
      return track.unitAccessed({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "refine",
        componentType: "unit_card",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        unitName: props.title,
        unitSlug: props.slug,
        keyStageSlug: keyStageSlug,
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        subjectTitle: subjectTitle,
        subjectSlug: subjectSlug,
        yearGroupName: props.yearTitle,
        yearGroupSlug: (props as UnitListItemProps).year,
        tierName: tier ?? null,
        examBoard: examBoardTitle,
      });
    }
  };

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <AppLayout seoProps={unitsSEO}>
        <PaginationHead
          prevPageUrlObject={prevPageUrlObject}
          nextPageUrlObject={nextPageUrlObject}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
        />
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
            <OakGridArea $colSpan={[12, 12, 9]}>
              <NewContentBanner
                keyStageSlug={keyStageSlug}
                subjectSlug={subjectSlug}
                subjectTitle={subjectTitle.toLowerCase()}
                programmeSlug={programmeSlug}
                isUnitListing={true}
                isLegacy={isSlugLegacy(programmeSlug)}
              />
            </OakGridArea>
          </OakGrid>
          <OakGrid>
            <OakGridArea
              $order={[0, 2, 2]}
              $colSpan={[12, 12, 3]}
              $pl={["inner-padding-xl"]}
            >
              <OakBox
                $display={["none", "none", "block"]}
                $position={[null, null, "sticky"]}
                $pt={["inner-padding-xl4"]}
                $maxWidth={"all-spacing-20"}
              >
                <StyledFieldset>
                  <OakHeading
                    tag="h3"
                    $font="heading-6"
                    $mb={"space-between-ssx"}
                  >
                    Filters
                  </OakHeading>
                  <OakBox $mb={skipFiltersButton ? "space-between-xs" : "auto"}>
                    <OakSecondaryButton
                      element="a"
                      aria-label="Skip to units"
                      href="#unit-list"
                      onFocus={() => setSkipFiltersButton(true)}
                      onBlur={() => setSkipFiltersButton(false)}
                    >
                      Skip to units
                    </OakSecondaryButton>
                  </OakBox>
                  {yearGroups.length > 1 && (
                    <YearGroupFilters
                      yearGroups={yearGroups}
                      screenVal="desktop"
                      browseRefined={track.browseRefined}
                    />
                  )}
                  {subjectCategories && subjectCategories.length > 1 && (
                    <SubjectCategoryFilters
                      screenVal="desktop"
                      subjectCategories={subjectCategories}
                      categorySlug={categorySlug}
                      browseRefined={track.browseRefined}
                      setSelectedCategory={setSelectedCategory}
                    />
                  )}
                  {learningThemes?.length > 1 && (
                    <Flex $flexDirection={"column"}>
                      <OakHeading
                        id={learningThemesId}
                        tag="h3"
                        $font="heading-7"
                        $mb="space-between-s"
                      >
                        {/* Though still called "Learning themes" internally, these should be referred to as "Threads" in user facing displays */}
                        Threads
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
                          keyStageTitle:
                            keyStageTitle as KeyStageTitleValueType,
                          subjectTitle,
                          subjectSlug,
                        }}
                      />
                    </Flex>
                  )}
                </StyledFieldset>
              </OakBox>
            </OakGridArea>

            <OakGridArea
              $order={[1, 1, 0]}
              $colSpan={[12, 12, 9]}
              $mt={"space-between-m2"}
            >
              <Flex
                $flexDirection={["column-reverse", "column-reverse", "column"]}
              >
                <Flex
                  $flexDirection={"row"}
                  $minWidth={["100%", "auto"]}
                  $justifyContent={"space-between"}
                  $position={"relative"}
                  $alignItems={"center"}
                >
                  {tiers.length === 0 && (
                    <Flex $minWidth={120} $mb={16} $position={"relative"}>
                      <OakHeading $font={"heading-5"} tag={"h2"}>
                        {`Units (${filteredUnits.length})`}
                      </OakHeading>
                    </Flex>
                  )}

                  <MobileFilters
                    $position={tiers.length === 0 ? "absolute" : "relative"}
                    providedId={learningThemesFilterId}
                    label="Filters"
                    $mt={0}
                    $mb={[16, 16, 0]}
                    applyForTablet
                  >
                    <StyledFieldset>
                      {yearGroups.length > 1 && (
                        <YearGroupFilters
                          screenVal="mobile"
                          yearGroups={yearGroups}
                          browseRefined={track.browseRefined}
                        />
                      )}
                      {subjectCategories && subjectCategories.length > 1 && (
                        <SubjectCategoryFilters
                          screenVal="mobile"
                          setSelectedCategory={setSelectedCategory}
                          subjectCategories={subjectCategories}
                          categorySlug={categorySlug}
                          browseRefined={track.browseRefined}
                        />
                      )}
                      {learningThemes.length > 1 && (
                        <>
                          <OakHeading
                            tag="h3"
                            $font="heading-7"
                            $mb={"space-between-m"}
                          >
                            Threads
                          </OakHeading>

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
                              keyStageTitle:
                                keyStageTitle as KeyStageTitleValueType,
                              subjectTitle,
                              subjectSlug,
                            }}
                          />
                        </>
                      )}
                    </StyledFieldset>
                  </MobileFilters>
                </Flex>

                {tiers.length > 0 && currentPageItems.length >= 1 && (
                  <nav aria-label="tiers" data-testid="tiers-nav">
                    <TabularNav
                      $mb={[10, 10, 24]}
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
              {currentPageItems.length >= 1 ? (
                <UnitList
                  {...curriculumData}
                  currentPageItems={currentPageItems}
                  paginationProps={paginationProps}
                  selectedCategory={selectedCategory}
                  filteredUnits={filteredUnits}
                  onClick={(props) =>
                    trackUnitSelected(
                      props,
                      curriculumData.examBoardTitle,
                      curriculumData.tierSlug,
                      curriculumData.tiers,
                    )
                  }
                />
              ) : (
                <OakHeading
                  tag="h3"
                  $font={"heading-light-6"}
                  $mb={"space-between-m2"}
                >
                  No results. Please try removing some filters.
                </OakHeading>
              )}
            </OakGridArea>
          </OakGrid>
        </MaxWidth>
      </AppLayout>
    </OakThemeProvider>
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

        if (!curriculumData) {
          return {
            notFound: true,
          };
        }

        const legacyCurriculumData = await curriculumApi2023.unitListing({
          programmeSlug: programmeSlug + "-l",
        });

        if (legacyCurriculumData) {
          curriculumData.units = [
            ...curriculumData.units,
            ...legacyCurriculumData.units,
          ];
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
