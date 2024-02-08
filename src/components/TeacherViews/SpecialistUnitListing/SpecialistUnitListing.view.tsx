import { FC, useId } from "react";
import { useTheme } from "styled-components";
import { useRouter } from "next/router";
import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
} from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import UnitList from "@/components/TeacherComponents/UnitList";
import Box from "@/components/SharedComponents/Box";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import TabularNav from "@/components/SharedComponents/TabularNav";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import HeaderListing from "@/components/TeacherComponents/HeaderListing/HeaderListing";
import LearningThemeFilters from "@/components/TeacherComponents/UnitsLearningThemeFilters";
import MobileFilters from "@/components/SharedComponents/MobileFilters";

type SpecialistPageData = {
  curriculumData: SpecialistUnitListingData;
};

export type SpecialistUnitListingData = {
  units: SpecialistUnit[];
  developmentalStage: DevelopmentalStage[];
  programmeSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  themes: Theme[];
  developmentalStageSlug: string;
};
export type DevelopmentalStage = {
  slug: string;
  title: string;
  unitCount: number;
  lessonCount: number;
};

export type SpecialistUnit = IndividualSpecialistUnit[];

export type IndividualSpecialistUnit = {
  slug: string;
  title: string;
  nullTitle: string;
  programmeSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  lessonCount: number;
  unitStudyOrder: number;
  expired: boolean;
  expiredLessonCount: number;
  themeSlug: string | null;
  themeTitle: string | null;
  developmentalStageSlug?: string;
  developmentalStageTitle?: string;
};

export type Theme = {
  themeSlug: string | null;
  themeTitle: string | null;
};

const SpecialistUnitListing: FC<SpecialistPageData> = ({ curriculumData }) => {
  const {
    units,
    developmentalStage,
    themes,
    developmentalStageSlug,
    subjectSlug,
    subjectTitle,
  } = curriculumData;

  const themeId = useId();
  const learningThemesId = useId();

  const router = useRouter();
  const themeSlug = router.query["learning-theme"]?.toString();

  const theme = useTheme();

  const HEADER_HEIGHT = theme.header.height;

  const paginationProps = usePagination({
    totalResults: 10, //unitsFilteredByLearningTheme.length,
    pageSize: RESULTS_PER_PAGE,
    items: units, //unitsFilteredByLearningTheme,
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
              {themes?.length > 1 && (
                <Flex $flexDirection={"column"}>
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
                    learningThemes={themes}
                    selectedThemeSlug={themeSlug ? themeSlug : "all"}
                    linkProps={{
                      page: "specialist-unit-index",
                      programmeSlug: subjectSlug,
                    }}
                  />
                </Flex>
              )}
            </Box>
          </OakGridArea>
          <OakGridArea $order={[1, 0]} $colSpan={[12, 8, 9]}>
            <Flex
              $flexDirection={["column-reverse", "column"]}
              $pt={[48]}
              $mt={[0, 32]}
            >
              <Flex $minWidth={120} $mb={24} $position={"relative"}>
                <OakHeading $font={"heading-5"} tag={"h2"}>
                  {`Units`}
                </OakHeading>
              </Flex>
              {developmentalStage.length > 0 && (
                <nav aria-label="tiers" data-testid="developmental-nav">
                  <TabularNav
                    $mb={[10, 24]}
                    label="themes"
                    $gap={[12, 0]}
                    links={developmentalStage.map(
                      ({ title, slug, lessonCount }) => ({
                        label: `${title} (${lessonCount})`,
                        programmeSlug: slug,
                        page: "specialist-unit-index",
                        isCurrent: developmentalStageSlug === slug,
                        currentStyles: ["underline"],
                      }),
                    )}
                  />
                </nav>
              )}
              {themes.length > 1 && (
                <MobileFilters
                  providedId={learningThemesId}
                  label="Filter by thread"
                  $mt={0}
                  $mb={[16, 0]}
                  iconBackground="white"
                >
                  <LearningThemeFilters
                    labelledBy={learningThemesId}
                    learningThemes={themes}
                    selectedThemeSlug={themeSlug ? themeSlug : "all"}
                    linkProps={{
                      page: "specialist-unit-index",
                      programmeSlug: subjectSlug,
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
