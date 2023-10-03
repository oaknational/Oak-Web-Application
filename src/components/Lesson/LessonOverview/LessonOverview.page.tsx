import React from "react";

import {
  getCommonPathway,
  getPageLinksForLesson,
  getBreadcrumbsForLessonPathway,
  getLessonOverviewBreadCrumb,
} from "../lesson.helpers";
import {
  LessonOverviewCanonical,
  LessonOverviewInPathway,
} from "../lesson.types";

import Flex from "@/components/Flex";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import Typography, { Heading, Hr } from "@/components/Typography";
import Grid, { GridArea } from "@/components/Grid";
import OverviewPresentation from "@/components/Lesson/LessonOverview/OverviewPresentation";
import OverviewVideo from "@/components/Lesson/LessonOverview/OverviewVideo";
import QuizContainerNew from "@/components/QuizContainerNew";
import Box from "@/components/Box";
import useAnalytics from "@/context/Analytics/useAnalytics";
import type {
  KeyStageTitleValueType,
  DownloadResourceButtonNameValueType,
} from "@/browser-lib/avo/Avo";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import LessonDetails from "@/components/LessonDetails/LessonDetails";
import { LessonItemContainer } from "@/components/LessonItemContainer/LessonItemContainer";
import ButtonLinkNav from "@/components/ButtonLinkNav/ButtonLinkNav";
import HeaderLesson from "@/components/HeaderLesson";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export type LessonOverviewProps = {
  lesson: LessonOverviewCanonical | LessonOverviewInPathway;
};

export function LessonOverview({ lesson }: LessonOverviewProps) {
  const {
    lessonTitle,
    lessonSlug,
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
    starterQuiz,
    exitQuiz,
    expired,
    additionalMaterialUrl,
    keyLearningPoints,
  } = lesson;

  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const commonPathway = getCommonPathway(
    lesson.isCanonical ? lesson.pathways : [lesson],
  );

  const {
    keyStageSlug,
    keyStageTitle,
    subjectTitle,
    subjectSlug,
    unitTitle,
    unitSlug,
    programmeSlug,
  } = commonPathway;

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
  const pageLinks = getPageLinksForLesson(lesson);
  const isLegacyLicense = programmeSlug ? isSlugLegacy(programmeSlug) : false;

  return (
    <>
      <HeaderLesson
        {...lesson}
        {...commonPathway}
        breadcrumbs={[
          ...getBreadcrumbsForLessonPathway(commonPathway),
          getLessonOverviewBreadCrumb({
            lessonTitle,
            lessonSlug,
            unitSlug,
            programmeSlug,
            disabled: true,
          }),
        ]}
        background={"pink30"}
        subjectIconBackgroundColor={"pink"}
        track={track}
        analyticsUseCase={analyticsUseCase}
      />
      <MaxWidth $ph={16}>
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
                $pr={[16]}
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
                    isLegacyLicense={isLegacyLicense}
                  />
                </LessonItemContainer>

                {pageLinks.find((p) => p.label === "Video") && (
                  <LessonItemContainer title={"Video"} anchorId="video">
                    <OverviewVideo
                      video={videoMuxPlaybackId}
                      signLanguageVideo={videoWithSignLanguageMuxPlaybackId}
                      title={lessonTitle}
                      transcriptSentences={transcriptSentences}
                      temporaryUsePublicVideos={
                        !isSlugLegacy(programmeSlug ?? "")
                      }
                      isLegacy={isSlugLegacy(
                        programmeSlug ?? subjectSlug ?? "",
                      )}
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
                      isWorksheetLandscape={!!isWorksheetLandscape}
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
                    {starterQuiz && (
                      <QuizContainerNew questions={starterQuiz} />
                    )}
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Exit quiz") && (
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
                    {exitQuiz && <QuizContainerNew questions={exitQuiz} />}
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Additional material") && (
                  <LessonItemContainer
                    title={"Additional material"}
                    anchorId="additionalMaterial"
                    downloadable={true}
                    onDownloadButtonClick={() => {
                      trackDownloadResourceButtonClicked({
                        downloadResourceButtonName: "additional material",
                      });
                    }}
                    slugs={slugs}
                  >
                    <OverviewPresentation
                      asset={additionalMaterialUrl}
                      isAdditionalMaterial={true}
                      title={lessonTitle}
                      isWorksheetLandscape={isWorksheetLandscape}
                      isWorksheet={true}
                    />
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
    </>
  );
}
