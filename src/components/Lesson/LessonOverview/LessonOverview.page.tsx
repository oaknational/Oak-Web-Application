import React, { useRef } from "react";

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
import Typography, { Heading } from "@/components/Typography";
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
import HeaderLesson from "@/components/HeaderLesson";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { useCurrentSection } from "@/components/Lesson/useCurrentSection";
import LessonAnchorLinks from "@/components/Lesson/LessonAnchorLinks/LessonAnchorLinks";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";

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
  const slideDeckSectionRef = useRef<HTMLDivElement>(null);
  const lessonDetailsSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const worksheetSectionRef = useRef<HTMLDivElement>(null);
  const starterQuizSectionRef = useRef<HTMLDivElement>(null);
  const exitQuizSectionRef = useRef<HTMLDivElement>(null);
  const additionalMaterialSectionRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    "slide-deck": slideDeckSectionRef,
    "lesson-details": lessonDetailsSectionRef,
    video: videoSectionRef,
    worksheet: worksheetSectionRef,
    "starter-quiz": starterQuizSectionRef,
    "exit-quiz": exitQuizSectionRef,
    "additional-material": additionalMaterialSectionRef,
  };

  const { currentSectionId } = useCurrentSection({ sectionRefs });

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
        isNew={!isLegacyLicense}
      />
      <MaxWidth $ph={16} $pb={80}>
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
              <Flex
                as="nav"
                aria-label="page navigation"
                $flexDirection={"column"}
                $alignItems={"flex-start"}
                $gap={[8]}
                $pr={[16]}
              >
                <LessonAnchorLinks
                  links={pageLinks}
                  currentSectionId={currentSectionId}
                />
              </Flex>
            </GridArea>
            <GridArea $colSpan={[12, 9]}>
              <Flex $flexDirection={"column"} $position={"relative"}>
                {pageLinks.find((p) => p.label === "Slide deck") && (
                  <LessonItemContainer
                    ref={slideDeckSectionRef}
                    title={"Slide deck"}
                    downloadable={true}
                    onDownloadButtonClick={() => {
                      trackDownloadResourceButtonClicked({
                        downloadResourceButtonName: "slide deck",
                      });
                    }}
                    slugs={slugs}
                    anchorId="slide-deck"
                  >
                    <OverviewPresentation
                      asset={presentationUrl}
                      title={lessonTitle}
                      isWorksheet={false}
                    />
                  </LessonItemContainer>
                )}

                <LessonItemContainer
                  ref={lessonDetailsSectionRef}
                  title={"Lesson details"}
                  anchorId="lesson-details"
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
                  <LessonItemContainer
                    ref={videoSectionRef}
                    title={"Video"}
                    anchorId="video"
                    isFinalElement={
                      pageLinks.findIndex((p) => p.label === "Video") ===
                      pageLinks.length - 1
                    }
                  >
                    <OverviewVideo
                      video={videoMuxPlaybackId}
                      signLanguageVideo={videoWithSignLanguageMuxPlaybackId}
                      title={lessonTitle}
                      transcriptSentences={transcriptSentences}
                      isLegacy={isSlugLegacy(
                        programmeSlug ?? subjectSlug ?? "",
                      )}
                    />
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Worksheet") && (
                  <LessonItemContainer
                    ref={worksheetSectionRef}
                    title={"Worksheet"}
                    anchorId="worksheet"
                    downloadable={true}
                    onDownloadButtonClick={() => {
                      trackDownloadResourceButtonClicked({
                        downloadResourceButtonName: "worksheet",
                      });
                    }}
                    slugs={slugs}
                    isFinalElement={
                      pageLinks.findIndex((p) => p.label === "Worksheet") ===
                      pageLinks.length - 1
                    }
                  >
                    <OverviewPresentation
                      asset={worksheetUrl}
                      title={lessonTitle}
                      isWorksheetLandscape={!!isWorksheetLandscape}
                      isWorksheet={true}
                    />
                  </LessonItemContainer>
                )}
                <MathJaxProvider>
                  {pageLinks.find((p) => p.label === "Starter quiz") && (
                    <LessonItemContainer
                      ref={starterQuizSectionRef}
                      title={"Starter quiz"}
                      anchorId="starter-quiz"
                      downloadable={true}
                      onDownloadButtonClick={() => {
                        trackDownloadResourceButtonClicked({
                          downloadResourceButtonName: "starter quiz",
                        });
                      }}
                      slugs={slugs}
                      isFinalElement={
                        pageLinks.findIndex(
                          (p) => p.label === "Starter quiz",
                        ) ===
                        pageLinks.length - 1
                      }
                    >
                      {starterQuiz && (
                        <QuizContainerNew questions={starterQuiz} />
                      )}
                    </LessonItemContainer>
                  )}
                  {pageLinks.find((p) => p.label === "Exit quiz") && (
                    <LessonItemContainer
                      ref={exitQuizSectionRef}
                      title={"Exit quiz"}
                      anchorId="exit-quiz"
                      downloadable={true}
                      onDownloadButtonClick={() => {
                        trackDownloadResourceButtonClicked({
                          downloadResourceButtonName: "exit quiz",
                        });
                      }}
                      slugs={slugs}
                      isFinalElement={
                        pageLinks.findIndex((p) => p.label === "Exit quiz") ===
                        pageLinks.length - 1
                      }
                    >
                      {exitQuiz && <QuizContainerNew questions={exitQuiz} />}
                    </LessonItemContainer>
                  )}
                </MathJaxProvider>
                {pageLinks.find((p) => p.label === "Additional material") && (
                  <LessonItemContainer
                    ref={additionalMaterialSectionRef}
                    title={"Additional material"}
                    anchorId="additional-material"
                    downloadable={true}
                    onDownloadButtonClick={() => {
                      trackDownloadResourceButtonClicked({
                        downloadResourceButtonName: "additional material",
                      });
                    }}
                    slugs={slugs}
                    isFinalElement={
                      pageLinks.findIndex(
                        (p) => p.label === "Additional material",
                      ) ===
                      pageLinks.length - 1
                    }
                  >
                    <Typography $font={"body-1"}>
                      We're sorry, but preview is not currently available.
                      Download to see additional material.
                    </Typography>
                    {/* 
                    Temporary fix for additional material due to unexpected poor rendering of google docs
                    <OverviewPresentation
                      asset={additionalMaterialUrl}
                      isAdditionalMaterial={true}
                      title={lessonTitle}
                      isWorksheetLandscape={isWorksheetLandscape}
                      isWorksheet={true}
                    /> */}
                  </LessonItemContainer>
                )}
              </Flex>
            </GridArea>
          </Grid>
        )}
      </MaxWidth>
    </>
  );
}
