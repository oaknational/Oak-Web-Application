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
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../node-lib/isr";
import useTrackPageView from "../../../../../hooks/useTrackPageView";
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
  } = curriculumData;

  const router = useRouter();
  const learningThemeSlug = router.query["learning-theme"]?.toString();

  useTrackPageView({ pageName: "Unit Listing" });

  const unitsFilteredByLearningTheme = learningThemeSlug
    ? units.filter((unit) => unit.themeSlug === learningThemeSlug)
    : units;

  const paginationProps = usePagination({
    totalResults: unitsFilteredByLearningTheme.length,
    pageSize: 20,
    items: unitsFilteredByLearningTheme,
  });

  const { currentPageItems } = paginationProps;
  const theme = useTheme();

  const HEADER_HEIGHT = theme.header.height;

  const learningThemesId = useId();
  const learningThemesFilterId = useId();

  const tiersSEO = {
    ...getSeoProps({
      title: `${keyStageTitle} ${subjectTitle} tiers`,
      description: `We have resources for tiers: ${tiers
        .map((tier) => tier.tierTitle)
        .join(", ")}`,
    }),
    ...{ noFollow: true, noIndex: true },
  };

  const unitsSEO = {
    ...getSeoProps({
      title: "Units", // @todo add real data
      description: "Programme units",
    }),
    ...{ noFollow: true, noIndex: true },
  };

  return (
    <AppLayout seoProps={tierSlug ? tiersSEO : unitsSEO}>
      <MaxWidth $ph={16}>
        <Box $mv={[24, 48]}>
          {" "}
          <Breadcrumbs
            breadcrumbs={[
              { oakLinkProps: { page: "beta-teachers-home" }, label: "Home" },
              {
                oakLinkProps: { page: "subject-index", slug: keyStageSlug },
                label: keyStageTitle,
              },
              {
                oakLinkProps: {
                  page: "unit-index",
                  keyStage: keyStageSlug,
                  subject: subjectSlug,
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
          title={subjectTitle}
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
                    selectedThemeSlug={
                      learningThemeSlug ? learningThemeSlug : "all"
                    }
                    linkProps={{
                      page: "programme",
                      programme: programmeSlug,
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
                    Units
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
                      selectedThemeSlug={
                        learningThemeSlug ? learningThemeSlug : "all"
                      }
                      linkProps={{
                        page: "programme",
                        programme: programmeSlug,
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
                        unitCount,
                        tierProgrammeSlug,
                      }) => ({
                        label: `${title} (${unitCount})`,
                        programme: tierProgrammeSlug,
                        page: "programme",
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
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const { programmes } = await curriculumApi.unitListingPaths();
  const paths = programmes.map((params) => ({ params: params }));

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
  if (!context.params) {
    throw new Error("No context.params");
  }
  const { programmeSlug } = context.params;

  const curriculumData = await curriculumApi.unitListing({
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

  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default UnitListingPage;
