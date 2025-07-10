import { FC, useId } from "react";
import { useTheme } from "styled-components";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakFlex,
  OakBox,
  OakMaxWidth,
} from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import UnitList from "@/components/TeacherComponents/UnitList";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import TabularNav from "@/components/SharedComponents/TabularNav";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import HeaderListing from "@/components/TeacherComponents/HeaderListing/HeaderListing";
import LearningThemeFilters from "@/components/TeacherComponents/UnitsLearningThemeFilters";
import filterUnits from "@/utils/filterUnits/filterUnits";
import { SpecialistUnitListingData } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import MobileUnitFilters from "@/components/TeacherComponents/MobileUnitFilters";
import { useUnitFilterState } from "@/hooks/useUnitFilterState";

type SpecialistPageData = {
  curriculumData: SpecialistUnitListingData;
};

const SpecialistUnitListing: FC<SpecialistPageData> = ({ curriculumData }) => {
  const {
    units,
    developmentStage,
    learningThemes,
    developmentStageSlug,
    subjectSlug,
    subjectTitle,
    programmeSlug,
  } = curriculumData;
  const themeId = useId();
  const learningThemesId = useId();

  const {
    isMobileFilterDrawerOpen,
    setIsMobileFilterDrawerOpen,
    handleUpdateActiveFilters,
    handleSubmitFilterQuery,
    handleUpdateAndSubmitFilterQuery,
    appliedThemeSlug,
    appliedCategorySlug,
    appliedyearGroupSlug,
    incomingCategorySlug,
    incomingThemeSlug,
    incomingYearSlug,
  } = useUnitFilterState({ isUnitListing: false });

  const unitsFilteredByLearningTheme = filterUnits({
    themeSlug: appliedThemeSlug,
    categorySlug: appliedCategorySlug,
    yearGroup: appliedyearGroupSlug,
    units,
  });

  const theme = useTheme();

  const HEADER_HEIGHT = theme.header.height;

  const paginationProps = usePagination({
    totalResults: unitsFilteredByLearningTheme.length,
    pageSize: RESULTS_PER_PAGE,
    items: unitsFilteredByLearningTheme,
  });

  const { currentPageItems } = paginationProps;

  return (
    <>
      <HeaderListing
        breadcrumbs={[
          {
            oakLinkProps: { page: "home" },
            label: "Home",
          },
          {
            oakLinkProps: {
              page: "specialist-subject-index",
            },
            label: "Specialist and therapies",
          },
          {
            oakLinkProps: {
              page: "specialist-unit-index",
              programmeSlug: programmeSlug,
            },
            label: subjectTitle,
            disabled: true,
          },
        ]}
        background={"lavender30"}
        subjectSlug={subjectSlug}
        subjectTitle={subjectTitle}
        subjectIconBackgroundColor="lavender"
        title={subjectTitle}
        programmeFactor="Specialist and therapies"
        isNew={false}
      />

      <OakMaxWidth $ph={"inner-padding-m"}>
        <OakGrid data-testid="specialist-unit-grid">
          <OakGridArea
            $order={[0, 2]}
            $colSpan={[12, 12, 3]}
            $display={["block", "none", "block"]}
            $pl={[undefined, "inner-padding-xl"]}
          >
            <OakBox
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $mt={[
                "space-between-none",
                "space-between-none",
                "space-between-m2",
              ]}
              $pt={["inner-padding-xl", "inner-padding-xl4"]}
            >
              {learningThemes?.length > 1 && (
                <OakFlex
                  $display={["none", "none", "block"]}
                  $flexDirection={"column"}
                >
                  <OakP
                    id={themeId}
                    $color={"black"}
                    $font="body-3"
                    $mb="space-between-s"
                  >
                    Filter by thread
                  </OakP>
                  <LearningThemeFilters
                    labelledBy={learningThemesId}
                    selectedThemeSlug={incomingThemeSlug}
                    idSuffix="desktop"
                    learningThemes={learningThemes}
                    setTheme={(theme) =>
                      handleUpdateAndSubmitFilterQuery({ theme })
                    }
                  />
                </OakFlex>
              )}
              <OakFlex $justifyContent={["flex-end", undefined]}>
                {learningThemes.length > 1 && (
                  <OakFlex $display={["auto", "none", "none"]}>
                    <MobileUnitFilters
                      {...curriculumData}
                      numberOfUnits={unitsFilteredByLearningTheme.length}
                      learningThemesFilterId={learningThemesId}
                      updateActiveFilters={handleUpdateActiveFilters}
                      incomingThemeSlug={incomingThemeSlug}
                      incomingCategorySlug={incomingCategorySlug}
                      incomingYearGroupSlug={incomingYearSlug}
                      isOpen={isMobileFilterDrawerOpen}
                      setIsOpen={setIsMobileFilterDrawerOpen}
                      handleSubmitQuery={handleSubmitFilterQuery}
                    />
                  </OakFlex>
                )}
              </OakFlex>
            </OakBox>
          </OakGridArea>
          <OakGridArea $order={[1, 0]} $colSpan={[12, 12, 9]}>
            <Flex $flexDirection={["column-reverse", "column"]} $pt={[24, 48]}>
              <OakFlex
                $minWidth="all-spacing-16"
                $mb="space-between-m"
                $position={"relative"}
                $justifyContent={[
                  "space-between",
                  "space-between",
                  "flex-start",
                ]}
              >
                <OakHeading $font={"heading-5"} tag={"h2"}>
                  {`Units`}
                </OakHeading>
                {learningThemes.length > 1 && (
                  <OakFlex $display={["none", "block", "none"]}>
                    <MobileUnitFilters
                      {...curriculumData}
                      numberOfUnits={unitsFilteredByLearningTheme.length}
                      learningThemesFilterId={learningThemesId}
                      updateActiveFilters={handleUpdateActiveFilters}
                      incomingThemeSlug={incomingThemeSlug}
                      incomingCategorySlug={incomingCategorySlug}
                      incomingYearGroupSlug={incomingYearSlug}
                      isOpen={isMobileFilterDrawerOpen}
                      setIsOpen={setIsMobileFilterDrawerOpen}
                      handleSubmitQuery={handleSubmitFilterQuery}
                    />
                  </OakFlex>
                )}
              </OakFlex>
              {developmentStage.length > 0 && (
                <nav
                  aria-label="development stages"
                  data-testid="development-nav"
                >
                  <TabularNav
                    $mb={[10, 24]}
                    label="themes"
                    $flexWrap={"wrap"}
                    $gap={[12, 0]}
                    links={developmentStage.map(
                      ({ title, slug, lessonCount, programmeSlug }) => ({
                        label: `${title} (${lessonCount})`,
                        programmeSlug: programmeSlug,
                        page: "specialist-unit-index",
                        isCurrent: developmentStageSlug === slug,
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
              onClick={() => {}}
            />
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </>
  );
};

export default SpecialistUnitListing;
