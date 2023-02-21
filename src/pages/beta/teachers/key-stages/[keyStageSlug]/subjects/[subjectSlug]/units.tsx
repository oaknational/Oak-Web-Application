import React from "react";
import { useTheme } from "styled-components";
import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";

import AppLayout from "../../../../../../../components/AppLayout";
import Flex from "../../../../../../../components/Flex";
import MaxWidth from "../../../../../../../components/MaxWidth/MaxWidth";
import TitleCard from "../../../../../../../components/Card/TitleCard";
import { getSeoProps } from "../../../../../../../browser-lib/seo/getSeoProps";
import usePagination from "../../../../../../../components/Pagination/usePagination";
import curriculumApi, {
  TeachersKeyStageSubjectUnitsData,
} from "../../../../../../../node-lib/curriculum-api";
import UnitList from "../../../../../../../components/UnitAndLessonLists/UnitList";
import Grid, { GridArea } from "../../../../../../../components/Grid";
import Box from "../../../../../../../components/Box";
import LearningThemeFilters from "../../../../../../../components/Filters/LearningThemeFilters";
import MobileFilters from "../../../../../../../components/MobileFilters";
import { Heading } from "../../../../../../../components/Typography";
import TabularNav from "../../../../../../../components/TabularNav";

export type SubjectUnitsListPageProps = {
  curriculumData: TeachersKeyStageSubjectUnitsData;
  learningThemeSlug: string | null;
};

const SubjectUnitsListPage: NextPage<SubjectUnitsListPageProps> = ({
  curriculumData,
  learningThemeSlug,
}) => {
  const {
    keyStageTitle,
    keyStageSlug,
    subjectTitle,
    subjectSlug,
    units,
    learningThemes,
    tierSlug,
    tiers,
  } = curriculumData;

  const paginationProps = usePagination({
    totalResults: curriculumData.units.length,
    pageSize: 20,
    items: units,
  });

  const { currentPageItems } = paginationProps;
  const theme = useTheme();
  const HEADER_HEIGHT = theme.header.height;
  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Units", // @todo add real data
        description: "Subject units",
      })}
    >
      <MaxWidth $ph={16}>
        {/* not part of mvp page, add later */}
        {/* <Box $mv={[24, 48]}>
          <Breadcrumbs
            breadcrumbs={[
              { href: "/", label: "Home" },
              { href: keyStageSlug, label: keyStageTitle },
              { href: subjectSlug, label: subjectTitle, disabled: true },
            ]}
          />
        </Box> */}

        <TitleCard
          page={"subject"}
          keyStage={keyStageTitle}
          keyStageSlug={keyStageSlug}
          title={subjectTitle}
          iconName={"Rocket"}
          $mt={48}
          $mb={24}
          $alignSelf={"flex-start"}
        />
        {/* not part of mvp page, add later */}
        {/* <Flex $mb={64} $display={"inline-flex"}>
          <ButtonAsLink
            variant="minimal"
            page={null}
            href={"/"}
            icon={"Download"}
            $iconPosition={"trailing"}
            label="Curriculum download (PDF)"
            iconBackground="teachersHighlight"
          />
        </Flex> */}

        <Grid>
          <GridArea $order={[0, 2]} $colSpan={[12, 4, 3]} $pl={[32]}>
            <Box
              $display={["none", "block"]}
              $position={[null, "sticky"]}
              $top={[null, HEADER_HEIGHT]}
              $mt={[0, 24]}
              $pt={[48]}
            >
              {learningThemes.length > 1 && (
                <Flex $flexDirection={"column"}>
                  <Heading tag="h3" $font="body-3" $mb={16}>
                    Learning themes
                  </Heading>
                  <LearningThemeFilters
                    labelledBy={"Learning themes"}
                    learningThemes={learningThemes}
                    selectedThemeSlug={
                      learningThemeSlug ? learningThemeSlug : "all"
                    }
                    linkProps={{
                      page: "unit-index",
                      keyStage: keyStageSlug,
                      subject: subjectSlug,
                      search: { ["tier"]: tierSlug },
                    }}
                  />
                </Flex>
              )}
            </Box>
          </GridArea>
          <GridArea $order={[1, 0]} $colSpan={[12, 8, 9]} $mt={[16, 72]}>
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
                    Units
                  </Heading>
                </Flex>
                {learningThemes.length > 1 && (
                  <MobileFilters label="Learning themes" $mt={0}>
                    <LearningThemeFilters
                      labelledBy={"Learning themes filter"}
                      learningThemes={learningThemes}
                      selectedThemeSlug={
                        learningThemeSlug ? learningThemeSlug : "all"
                      }
                      linkProps={{
                        page: "unit-index",
                        keyStage: keyStageSlug,
                        subject: subjectSlug,
                        search: { ["tier"]: tierSlug },
                      }}
                    />
                  </MobileFilters>
                )}
              </Flex>

              {tiers.length > 0 && (
                <nav aria-label="tiers">
                  <TabularNav
                    $mb={[10, 16]}
                    label="tiers"
                    links={tiers.map(({ title, slug, unitCount }) => ({
                      label: `${title} (${unitCount})`,
                      keyStage: keyStageSlug,
                      subject: subjectSlug,
                      search: { tier: slug },
                      page: "unit-index",
                      isCurrent: slug === tierSlug,
                    }))}
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
  subjectSlug: string;
  keyStageSlug: string;
};

export const getServerSideProps: GetServerSideProps<
  SubjectUnitsListPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("No context.params");
  }
  const { subjectSlug, keyStageSlug } = context.params;
  const { tier } = context.query;
  const learningTheme = context.query["learning-theme"]
    ? context.query["learning-theme"]
    : null;

  const learningThemeSlug = Array.isArray(learningTheme)
    ? learningTheme[0]
      ? learningTheme[0]
      : null
    : learningTheme;
  const tierSlug = Array.isArray(tier) ? tier[0] : tier;

  const curriculumData = await curriculumApi.teachersKeyStageSubjectUnits({
    subjectSlug,
    keyStageSlug,
    tierSlug,
    learningThemeSlug,
  });

  const results: GetServerSidePropsResult<SubjectUnitsListPageProps> = {
    props: {
      curriculumData,
      learningThemeSlug,
    },
  };
  return results;
};

export default SubjectUnitsListPage;
