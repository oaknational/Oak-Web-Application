import { FC, useId } from "react";
import { useTheme } from "styled-components";
import { useRouter } from "next/router";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakFlex,
} from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import UnitList from "@/components/TeacherComponents/UnitList";
import Box from "@/components/SharedComponents/Box";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import TabularNav from "@/components/SharedComponents/TabularNav";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import HeaderListing from "@/components/TeacherComponents/HeaderListing/HeaderListing";
import LearningThemeFilters from "@/components/TeacherComponents/UnitsLearningThemeFilters";
import MobileFilters from "@/components/SharedComponents/MobileFilters";
import { filterSpecialistLearningTheme } from "@/utils/filterLearningTheme/filterLearningTheme";
import { SpecialistUnitListingData } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";

type SpecialistPageData = {
  curriculumData: SpecialistUnitListingData;
};

const SpecialistUnitListing: FC<SpecialistPageData> = ({ curriculumData }) => {
  const {
    units,
    developmentalStage,
    learningThemes,
    developmentalStageSlug,
    subjectSlug,
    subjectTitle,
    programmeSlug,
  } = curriculumData;
  const themeId = useId();
  const learningThemesId = useId();

  const router = useRouter();
  const themeSlug = router.query["learning-theme"]?.toString();

  const unitsFilteredByLearningTheme = filterSpecialistLearningTheme(
    themeSlug,
    units,
  );

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
              page: "specialist-programme-index",
              subjectSlug,
            },
            label: "Specialist programmes",
          },
          {
            oakLinkProps: {
              page: "specialist-unit-index",
              programmeSlug: subjectSlug,
            },
            label: subjectTitle,
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

      <MaxWidth $ph={16}>
        <OakGrid data-testid="specialist-unit-grid">
          <OakGridArea
            $order={[0, 2]}
            $colSpan={[12, 4, 3]}
            $pl={["inner-padding-xl"]}
          >
            <Box
              $display={["none", "block"]}
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $mt={[0, 32]}
              $pt={[48]}
            >
              {learningThemes?.length > 1 && (
                <OakFlex $flexDirection={"column"}>
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
                    learningThemes={learningThemes}
                    selectedThemeSlug={themeSlug ? themeSlug : "all"}
                    linkProps={{
                      page: "specialist-unit-index",
                      programmeSlug: programmeSlug,
                    }}
                  />
                </OakFlex>
              )}
            </Box>
          </OakGridArea>
          <OakGridArea $order={[1, 0]} $colSpan={[12, 8, 9]}>
            <Flex
              $flexDirection={["column-reverse", "column"]}
              $pt={[48]}
              $mt={[0, 32]}
            >
              <OakFlex
                $minWidth="all-spacing-16"
                $mb="space-between-m"
                $position={"relative"}
              >
                <OakHeading $font={"heading-5"} tag={"h2"}>
                  {`Units`}
                </OakHeading>
              </OakFlex>
              {developmentalStage.length > 0 && (
                <nav aria-label="tiers" data-testid="developmental-nav">
                  <TabularNav
                    $mb={[10, 24]}
                    label="themes"
                    $gap={[12, 0]}
                    links={developmentalStage.map(
                      ({ title, slug, lessonCount }) => ({
                        label: `${title} (${lessonCount})`,
                        programmeSlug: programmeSlug,
                        page: "specialist-unit-index",
                        isCurrent: developmentalStageSlug === slug,
                        currentStyles: ["underline"],
                      }),
                    )}
                  />
                </nav>
              )}
              {learningThemes.length > 1 && (
                <MobileFilters
                  providedId={learningThemesId}
                  label="Filter by thread"
                  $mt={0}
                  $mb={[16, 0]}
                  iconBackground="white"
                >
                  <LearningThemeFilters
                    labelledBy={learningThemesId}
                    learningThemes={learningThemes}
                    selectedThemeSlug={themeSlug ? themeSlug : "all"}
                    linkProps={{
                      page: "specialist-unit-index",
                      programmeSlug: programmeSlug,
                    }}
                  />
                </MobileFilters>
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
      </MaxWidth>
    </>
  );
};

export default SpecialistUnitListing;
