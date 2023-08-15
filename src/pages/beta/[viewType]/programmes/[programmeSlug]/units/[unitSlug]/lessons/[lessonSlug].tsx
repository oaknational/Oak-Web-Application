import React from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import AppLayout from "@/components/AppLayout";
import Flex from "@/components/Flex";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import TitleCard from "@/components/Card/SubjectUnitLessonTitleCard";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Typography, { Heading, Hr } from "@/components/Typography";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Grid, { GridArea } from "@/components/Grid";
import curriculumApi, { LessonOverviewData } from "@/node-lib/curriculum-api";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OverviewPresentation from "@/components/pages/TeachersLessonOverview/OverviewPresentation";
import OverviewVideo from "@/components/pages/TeachersLessonOverview/OverviewVideo";
import QuizContainer from "@/components/QuizContainer";
import Breadcrumbs, { Breadcrumb } from "@/components/Breadcrumbs";
import Box from "@/components/Box";
import useAnalytics from "@/context/Analytics/useAnalytics";
import type {
  KeyStageTitleValueType,
  DownloadResourceButtonNameValueType,
} from "@/browser-lib/avo/Avo";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import { ViewType } from "@/common-lib/urls";
import getPageProps from "@/node-lib/getPageProps";
import LessonDetails from "@/components/LessonDetails/LessonDetails";
import { LessonItemContainer } from "@/components/LessonItemContainer/LessonItemContainer";
import ButtonLinkNav from "@/components/ButtonLinkNav/ButtonLinkNav";

export type LessonOverviewPageProps = {
  curriculumData: LessonOverviewData;
};

// Array to be used in downloads as well to avoid duplication
export const lessonBreadcrumbArray = (
  keyStageTitle: string,
  keyStageSlug: string,
  programmeSlug: string,
  subjectTitle: string,
  unitSlug: string,
  unitTitle: string
): Breadcrumb[] => {
  return [
    {
      oakLinkProps: {
        page: "home",
        viewType: "teachers",
      },
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
    },
    {
      oakLinkProps: {
        page: "lesson-index",
        viewType: "teachers",
        programmeSlug,
        unitSlug,
      },
      label: unitTitle,
    },
  ];
};
const LessonOverviewPage: NextPage<LessonOverviewPageProps> = ({
  curriculumData,
}) => {
  const {
    lessonTitle,
    lessonSlug,
    programmeSlug,
    keyStageTitle,
    keyStageSlug,
    keyLearningPoints,
    subjectSlug,
    subjectTitle,
    supervisionLevel,
    contentGuidance,
    misconceptionsAndCommonMistakes,
    lessonKeywords,
    teacherTips,
    videoMuxPlaybackId,
    videoWithSignLanguageMuxPlaybackId,
    lessonEquipmentAndResources,
    presentationUrl,
    worksheetUrl,
    isWorksheetLandscape,
    transcriptSentences,
    hasCopyrightMaterial,
    hasDownloadableResources,
    introQuiz,
    exitQuiz,
    introQuizInfo,
    exitQuizInfo,
    unitTitle,
    unitSlug,
    expired,
  } = curriculumData;

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const trackDownloadResourceButtonClicked = ({
    downloadResourceButtonName,
  }: {
    downloadResourceButtonName: DownloadResourceButtonNameValueType;
  }) => {
    track.downloadResourceButtonClicked({
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      keyStageSlug,
      subjectTitle,
      subjectSlug,
      unitName: unitTitle,
      unitSlug,
      lessonName: lessonTitle,
      lessonSlug,
      downloadResourceButtonName,
      analyticsUseCase,
    });
  };

  const slugs = { unitSlug, lessonSlug, programmeSlug };

  const pageLinks = [];

  if (presentationUrl && !hasCopyrightMaterial) {
    pageLinks.push({ label: "Slide deck", href: "#slideDeck" });
  }

  pageLinks.push({ label: "Lesson details", href: "#lessonDetails" });

  if (videoMuxPlaybackId) {
    pageLinks.push({ label: "Video", href: "#video" });
  }

  if (worksheetUrl) {
    pageLinks.push({ label: "Worksheet", href: "#worksheet" });
  }

  if (introQuiz.length > 0) {
    pageLinks.push({ label: "Starter quiz", href: "#starterQuiz" });
  }

  if (exitQuiz.length > 0) {
    pageLinks.push({ label: "Exit quiz", href: "#exitQuiz" });
  }

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lessonTitle} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description: "Overview of lesson",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
    >
      <MaxWidth $ph={16}>
        <>
          <Box $mv={[24, 48]}>
            {/* NB. BreadcrumbsConstrainer doesn't play nicely when nested inside a flex box */}
            <Breadcrumbs
              breadcrumbs={[
                ...lessonBreadcrumbArray(
                  keyStageTitle,
                  keyStageSlug,
                  programmeSlug,
                  subjectTitle,
                  unitSlug,
                  unitTitle
                ),
                {
                  oakLinkProps: {
                    page: "lesson-overview",
                    viewType: "teachers",
                    programmeSlug,
                    unitSlug,
                    lessonSlug,
                  },
                  label: lessonTitle,
                  disabled: true,
                },
              ]}
            />
          </Box>

          <Flex $alignItems={"start"} $flexDirection={"column"}>
            <TitleCard
              page={"lesson"}
              keyStage={keyStageTitle}
              keyStageSlug={keyStageSlug}
              subject={subjectTitle}
              subjectSlug={subjectSlug}
              title={lessonTitle}
            />

            {!expired && hasDownloadableResources && (
              <ButtonAsLink
                $mr={24}
                icon="download"
                iconBackground="teachersHighlight"
                label="Download all resources"
                page={"lesson-downloads"}
                viewType="teachers"
                size="small"
                variant="minimal"
                $iconPosition={"trailing"}
                $mt={16}
                data-testid={"download-all-button"}
                query={{
                  preselected: "all",
                }}
                programmeSlug={programmeSlug}
                lessonSlug={lessonSlug}
                unitSlug={unitSlug}
                onClick={() => {
                  trackDownloadResourceButtonClicked({
                    downloadResourceButtonName: "all",
                  });
                }}
              />
            )}
            {/*
          TODO: Uncomment when we have a way to send to pupil
           <Button
            $mr={24}
            icon="send"
            iconBackground="teachersHighlight"
            label="Send to pupil"
            onClick={() => null}
            size="large"
            variant="minimal"
            $iconPosition={"trailing"}
            $mt={16}
          /> */}
          </Flex>
        </>
        {expired ? (
          <Box $pa={16} $mb={64}>
            <Heading $font={"heading-7"} tag={"h2"} $mb={16}>
              No lesson available
            </Heading>
            <Typography $font={"body-1"}>
              Sorry, this lesson no longer exists.
            </Typography>
          </Box>
        ) : (
          <Grid $mt={[48]}>
            <GridArea
              $colSpan={[12, 3]}
              $alignSelf={"start"}
              $position={"sticky"}
              $display={["none", "block"]}
              $top={96} // FIXME: ideally we'd dynamically calculate this based on the height of the header using the next allowed size. This could be achieved with a new helperFunction get nextAvailableSize
            >
              <ButtonLinkNav
                ariaLabel="page navigation"
                buttons={pageLinks}
                $flexDirection={"column"}
                $alignItems={"flex-start"}
                $gap={[8]}
                arrowSuffix
                shallow
              />
            </GridArea>
            <GridArea $colSpan={[12, 9]}>
              <Flex $flexDirection={"column"} $position={"relative"}>
                {pageLinks.find((p) => p.label === "Slide deck") && (
                  <LessonItemContainer
                    title={"Slide deck"}
                    downloadable={true}
                    onDownloadButtonClick={() => {
                      trackDownloadResourceButtonClicked({
                        downloadResourceButtonName: "slide deck",
                      });
                    }}
                    slugs={slugs}
                    anchorId="slideDeck"
                  >
                    <OverviewPresentation
                      asset={presentationUrl}
                      title={lessonTitle}
                      isWorksheet={false}
                    />
                  </LessonItemContainer>
                )}

                <LessonItemContainer
                  title={"Lesson details"}
                  anchorId="lessonDetails"
                >
                  <LessonDetails
                    keyLearningPoints={keyLearningPoints}
                    commonMisconceptions={misconceptionsAndCommonMistakes}
                    keyWords={lessonKeywords}
                    teacherTips={teacherTips}
                    equipmentAndResources={lessonEquipmentAndResources}
                    contentGuidance={contentGuidance}
                    supervisionLevel={supervisionLevel}
                  />
                </LessonItemContainer>

                {pageLinks.find((p) => p.label === "Video") && (
                  <LessonItemContainer title={"Video"} anchorId="video">
                    <OverviewVideo
                      video={videoMuxPlaybackId}
                      signLanguageVideo={videoWithSignLanguageMuxPlaybackId}
                      title={lessonTitle}
                      transcriptSentences={transcriptSentences}
                    />
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Worksheet") && (
                  <LessonItemContainer
                    title={"Worksheet"}
                    anchorId="worksheet"
                    downloadable={true}
                    onDownloadButtonClick={() => {
                      trackDownloadResourceButtonClicked({
                        downloadResourceButtonName: "worksheet",
                      });
                    }}
                    slugs={slugs}
                  >
                    <OverviewPresentation
                      asset={worksheetUrl}
                      title={lessonTitle}
                      isWorksheetLandscape={isWorksheetLandscape}
                      isWorksheet={true}
                    />
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Starter quiz") && (
                  <LessonItemContainer
                    title={"Starter quiz"}
                    anchorId="starterQuiz"
                    downloadable={true}
                    onDownloadButtonClick={() => {
                      trackDownloadResourceButtonClicked({
                        downloadResourceButtonName: "starter quiz",
                      });
                    }}
                    slugs={slugs}
                  >
                    <QuizContainer questions={introQuiz} info={introQuizInfo} />
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Starter quiz") && (
                  <LessonItemContainer
                    title={"Exit quiz"}
                    anchorId="exitQuiz"
                    downloadable={true}
                    onDownloadButtonClick={() => {
                      trackDownloadResourceButtonClicked({
                        downloadResourceButtonName: "exit quiz",
                      });
                    }}
                    slugs={slugs}
                  >
                    <QuizContainer questions={exitQuiz} info={exitQuizInfo} />
                  </LessonItemContainer>
                )}
              </Flex>
            </GridArea>
          </Grid>
        )}
      </MaxWidth>
      {!expired && (
        <>
          <MaxWidth $ph={16}>
            <Hr $color={"oakGrey3"} />
          </MaxWidth>
        </>
      )}
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  unitSlug: string;
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
  LessonOverviewPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "lesson-overview::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, unitSlug, programmeSlug } = context.params;

      const curriculumData =
        context?.params.viewType === "teachers-2023"
          ? await curriculumApi2023.lessonOverview({
              programmeSlug,
              lessonSlug,
              unitSlug,
            })
          : await curriculumApi.lessonOverview({
              programmeSlug,
              lessonSlug,
              unitSlug,
            });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<LessonOverviewPageProps> = {
        props: {
          curriculumData,
        },
      };

      return results;
    },
  });
};

export default LessonOverviewPage;
