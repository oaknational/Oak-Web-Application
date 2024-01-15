import { FC, useId } from "react";
import { useTheme } from "styled-components";

import Flex from "@/components/SharedComponents/Flex";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import UnitList from "@/components/UnitAndLessonLists/UnitList";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import Box from "@/components/SharedComponents/Box";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import { Heading, P } from "@/components/SharedComponents/Typography";
import TabularNav from "@/components/TabularNav";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import HeaderListing from "@/components/TeacherComponents/HeaderListing/HeaderListing";

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
  developmentalStageSlug: string;
  developmentalStageTitle: string;
  // keyStageTitle: KeyStageTitleValueType;
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

  const theme = useTheme();

  const HEADER_HEIGHT = theme.header.height;

  const paginationProps = usePagination({
    totalResults: 10, //unitsFilteredByLearningTheme.length,
    pageSize: RESULTS_PER_PAGE,
    items: units, //unitsFilteredByLearningTheme,
  });

  /**
   */

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
        ]}
        background={"lavender30"}
        subjectSlug={subjectSlug}
        subjectTitle={subjectTitle}
        subjectIconBackgroundColor="lavender"
        keyStageSlug="ks1"
        keyStageTitle="KS1"
        title={"Communication and language"}
        programmeFactor="Communication and language"
      />

      <MaxWidth $ph={16}>
        <Grid>
          <GridArea $order={[0, 2]} $colSpan={[12, 4, 3]} $pl={[32]}>
            <Box
              $display={["none", "block"]}
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $mt={[0, 32]}
              $pt={[48]}
            >
              {themes?.length > 1 && (
                <Flex $flexDirection={"column"}>
                  <P id={themeId} $color={"black"} $font="body-3" $mb={16}>
                    Filter by thread
                  </P>
                </Flex>
              )}
            </Box>
          </GridArea>
          <GridArea $order={[1, 0]} $colSpan={[12, 8, 9]}>
            <Flex
              $flexDirection={["column-reverse", "column"]}
              $pt={[48]}
              $mt={[0, 32]}
            >
              <Flex $minWidth={120} $mb={24} $position={"relative"}>
                <Heading $font={"heading-5"} tag={"h2"}>
                  {`Units`}
                </Heading>
              </Flex>
              {developmentalStage.length > 0 && (
                <nav aria-label="tiers" data-testid="tiers-nav">
                  <TabularNav
                    $mb={[10, 24]}
                    label="tiers"
                    $flexDirection={["column", "row"]}
                    $alignItems={["flex-start", "center"]}
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
            </Flex>
            <UnitList
              {...curriculumData}
              currentPageItems={currentPageItems}
              paginationProps={paginationProps}
              onClick={() => {}}
              isSpecialist={true}
            />
          </GridArea>
        </Grid>
      </MaxWidth>
    </>
  );
};

export default SpecialistUnitListing;
