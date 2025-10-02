import React, { useId, useState, useRef, useEffect } from "react";
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
  OakThemeProvider,
  oakDefaultTheme,
  OakFlex,
  OakMaxWidth,
} from "@oaknational/oak-components";
import { z } from "zod";

import { examboards, tierSlugs } from "@oaknational/oak-curriculum-schema";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import type { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import UnitList from "@/components/TeacherComponents/UnitList";
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
import {
  UnitListingData,
  Tiers,
} from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";
import NewContentBanner from "@/components/TeacherComponents/NewContentBanner/NewContentBanner";
import PaginationHead from "@/components/SharedComponents/Pagination/PaginationHead";
import MobileUnitFilters from "@/components/TeacherComponents/MobileUnitFilters";
import DesktopUnitFilters from "@/components/TeacherComponents/DesktopUnitFilters/DesktopUnitFilters";
import RelatedSubjectsBanner from "@/components/TeacherComponents/RelatedSubjectsBanner/RelatedSubjectsBanner";
import { isUnitListData } from "@/components/TeacherComponents/UnitList/helpers";
import { useUnitFilterState } from "@/hooks/useUnitFilterState";

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
    subjectCategories,
    yearGroups,
    pathwayTitle,
    relatedSubjects,
    phase,
  } = curriculumData;

  const { track } = useAnalytics();

  const learningThemes = curriculumData.learningThemes ?? [];

  const [skipFiltersButton, setSkipFiltersButton] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const isFiltersAvailable =
    yearGroups.length > 1 ||
    subjectCategories.length > 1 ||
    learningThemes.length > 1;

  const {
    appliedThemeSlug,
    appliedCategorySlug,
    appliedyearGroupSlug,
    isMobileFilterDrawerOpen,
    setIsMobileFilterDrawerOpen,
    handleUpdateActiveFilters,
    handleUpdateAndSubmitFilterQuery,
    handleSubmitFilterQuery,
    incomingCategorySlug,
    incomingThemeSlug,
    incomingYearSlug,
  } = useUnitFilterState({ isUnitListing: isUnitListData(curriculumData) });

  // TODO: extract to state
  useEffect(() => {
    if (appliedCategorySlug || appliedyearGroupSlug) {
      if (filtersRef.current) {
        filtersRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [appliedCategorySlug, appliedyearGroupSlug]);

  const filteredUnits = filterUnits({
    themeSlug: appliedThemeSlug,
    categorySlug: appliedCategorySlug,
    yearGroup: appliedyearGroupSlug,
    units,
  });

  const filteredAndSortedUnits = filteredUnits.sort((a, b) => {
    const aGroupUnitsAs = a[0]?.groupUnitsAs ?? "";
    const bGroupUnitsAs = b[0]?.groupUnitsAs ?? "";
    return bGroupUnitsAs.localeCompare(aGroupUnitsAs);
  });

  const paginationProps = usePagination({
    totalResults: filteredAndSortedUnits.length,
    pageSize: RESULTS_PER_PAGE,
    items: filteredAndSortedUnits,
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
    tiers: Tiers,
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
        keyStageSlug,
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        subjectTitle,
        subjectSlug,
        yearGroupName: props.yearTitle ?? "",
        yearGroupSlug: (props as UnitListItemProps).yearSlug,
        tierName: tier ?? null,
        examBoard: examBoardTitle,
        pathway: pathwayTitle,
      });
    }
  };

  const MobileUnitFilterButton = () => {
    return isFiltersAvailable ? (
      <OakBox $display={["auto", "auto", "none"]}>
        <MobileUnitFilters
          {...curriculumData}
          numberOfUnits={filteredAndSortedUnits.length}
          learningThemesFilterId={learningThemesFilterId}
          updateActiveFilters={handleUpdateActiveFilters}
          incomingThemeSlug={incomingThemeSlug}
          incomingCategorySlug={incomingCategorySlug}
          incomingYearGroupSlug={incomingYearSlug}
          isOpen={isMobileFilterDrawerOpen}
          setIsOpen={setIsMobileFilterDrawerOpen}
          handleSubmitQuery={handleSubmitFilterQuery}
        />
      </OakBox>
    ) : null;
  };

  const TierTabsOrUnitCountHeader = () => {
    return tiers.length > 0 ? (
      <nav aria-label="tiers" data-testid="tiers-nav">
        <TabularNav
          $mb={["space-between-xs", "space-between-xs", "space-between-m"]}
          label="tiers"
          links={tiers.map(
            ({ tierTitle: title, tierSlug: slug, tierProgrammeSlug }) => ({
              label: title,
              programmeSlug: tierProgrammeSlug,
              page: "unit-index",
              isCurrent: tierSlug === slug,
              currentStyles: ["underline"],
            }),
          )}
        />
      </nav>
    ) : (
      <OakFlex
        $minWidth={"all-spacing-16"}
        $mb={"space-between-s"}
        $position={"relative"}
      >
        <OakHeading $font={"heading-5"} tag={"h2"}>
          {`Units (${filteredAndSortedUnits.length})`}
        </OakHeading>
      </OakFlex>
    );
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
          title={`${subjectTitle} ${examBoardTitle ? examBoardTitle + " " : ""}${pathwayTitle ?? ""}`}
          programmeFactor={toSentenceCase(keyStageTitle)}
          isNew={hasNewContent ?? false}
          hasCurriculumDownload={isSlugLegacy(programmeSlug)}
          subjectDescriptionUnitListingData={curriculumData}
          {...curriculumData}
        />
        <OakMaxWidth $ph={"inner-padding-m"}>
          {/* Legacy content banner, only shown on certain legacy unit listing pages  */}
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
            {/* Desktop filters side bar */}
            <OakGridArea
              $order={[0, 2, 2]}
              $colSpan={[12, 12, 3]}
              $pl={["inner-padding-xl"]}
            >
              <DesktopUnitFilters
                showFilters={isFiltersAvailable}
                onFocus={() => setSkipFiltersButton(true)}
                onBlur={() => setSkipFiltersButton(false)}
                yearGroups={yearGroups}
                subjectCategories={subjectCategories}
                learningThemes={learningThemes}
                filtersRef={filtersRef}
                skipFiltersButton={skipFiltersButton}
                learningThemesId={learningThemesId}
                updateQuery={handleUpdateAndSubmitFilterQuery}
                incomingCategorySlug={incomingCategorySlug}
                incomingThemeSlug={incomingThemeSlug}
                incomingYearSlug={incomingYearSlug}
              />
              <OakFlex $display={["none", "none", "flex"]}>
                {relatedSubjects?.map((subjectSlug) => (
                  <RelatedSubjectsBanner
                    key={subjectSlug}
                    subjectSlug={subjectSlug}
                    keyStageSlug={keyStageSlug}
                    phase={phase}
                    isDesktop={true}
                  />
                ))}
              </OakFlex>
            </OakGridArea>

            {/* Header Row */}
            <OakGridArea
              $order={[1, 1, 0]}
              $colSpan={[12, 12, 9]}
              $mt={"space-between-m2"}
            >
              <OakFlex
                $flexDirection={["column-reverse", "column-reverse", "column"]}
              >
                <OakFlex
                  $justifyContent={"space-between"}
                  $flexDirection={"row"}
                  $minWidth={["100%", "auto"]}
                  $position={"relative"}
                >
                  <TierTabsOrUnitCountHeader />
                  <MobileUnitFilterButton />
                </OakFlex>
              </OakFlex>

              {/* Main Content */}
              {currentPageItems.length >= 1 ? (
                <UnitList
                  {...curriculumData}
                  currentPageItems={currentPageItems}
                  paginationProps={paginationProps}
                  filteredUnits={filteredAndSortedUnits}
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
          <OakFlex $display={["flex", "flex", "none"]} $mb="space-between-xl">
            {relatedSubjects?.map((subjectSlug) => (
              <RelatedSubjectsBanner
                key={subjectSlug}
                subjectSlug={subjectSlug}
                keyStageSlug={keyStageSlug}
                phase={phase}
                isDesktop={false}
              />
            ))}
          </OakFlex>
        </OakMaxWidth>
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

export const getLegacyProgrammeSlug = (
  programmeSlug: string,
  examBoardSlug: string | null,
) =>
  examBoardSlug && programmeSlug.endsWith(examBoardSlug)
    ? programmeSlug.split(examBoardSlug).join("l")
    : programmeSlug + "-l";

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
        const curriculumData =
          await curriculumApi2023.teachersPreviewUnitListing({
            programmeSlug,
          });

        if (!curriculumData) {
          return {
            notFound: true,
          };
        }

        // need to account for if it's already a legacy programme
        const isLegacy = isSlugLegacy(programmeSlug);
        const legacyCurriculumData = isLegacy
          ? null
          : await curriculumApi2023.teachersPreviewUnitListing({
              programmeSlug: getLegacyProgrammeSlug(
                programmeSlug,
                curriculumData.examBoardSlug,
              ),
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
