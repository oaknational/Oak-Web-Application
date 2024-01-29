import React, { useRef } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import {
  getCommonPathway,
  getPageLinksForLesson,
  getBreadcrumbsForLessonPathway,
  getLessonOverviewBreadCrumb,
  createAttributionObject,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  LessonOverviewCanonical,
  LessonOverviewInPathway,
  SpecialistLessonOverview,
} from "@/components/TeacherComponents/types/lesson.types";
import Flex from "@/components/SharedComponents/Flex";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Typography, { Heading } from "@/components/SharedComponents/Typography";
import LessonOverviewPresentation from "@/components/TeacherComponents/LessonOverviewPresentation";
import LessonOverviewVideo from "@/components/TeacherComponents/LessonOverviewVideo";
import QuizContainerNew from "@/components/TeacherComponents/LessonOverviewQuizContainer";
import Box from "@/components/SharedComponents/Box";
import useAnalytics from "@/context/Analytics/useAnalytics";
import type {
  KeyStageTitleValueType,
  DownloadResourceButtonNameValueType,
} from "@/browser-lib/avo/Avo";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import LessonDetails from "@/components/TeacherComponents/LessonOverviewDetails";
import { LessonItemContainer } from "@/components/TeacherComponents/LessonItemContainer";
import HeaderLesson from "@/components/TeacherComponents/LessonOverviewHeader";
import { useCurrentSection } from "@/components/TeacherComponents/helpers/lessonHelpers/useCurrentSection";
import LessonOverviewAnchorLinks from "@/components/TeacherComponents/LessonOverviewAnchorLinks";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { GridArea } from "@/components/SharedComponents/Grid.deprecated/GridArea.deprecated.stories";
import { LEGACY_COHORT } from "@/config/cohort";

export type LessonOverviewProps = {
  lesson:
    | LessonOverviewCanonical
    | LessonOverviewInPathway
    | SpecialistLessonOverview;
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
    lessonCohort,
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

  const trackShareAll = () => {
    track.lessonShareStarted({
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      keyStageSlug: keyStageSlug || "",
      subjectTitle: subjectTitle || "",
      subjectSlug: subjectSlug || "",
      unitName: unitTitle || "",
      unitSlug: unitSlug || "",
      lessonName: lessonTitle,
      lessonSlug: lessonSlug,
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

  const isLegacyLicense = !lessonCohort || lessonCohort === LEGACY_COHORT;

  const starterQuizImageAttribution = createAttributionObject(starterQuiz);

  const exitQuizImageAttribution = createAttributionObject(exitQuiz);

  return (
    <MathJaxProvider>
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
        isLegacyLesson={isLegacyLicense}
        onClickDownloadAll={() => {
          trackDownloadResourceButtonClicked({
            downloadResourceButtonName: "all",
          });
        }}
        onClickShareAll={trackShareAll}
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
          <OakGrid $mt={["space-between-l"]}>
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
                <LessonOverviewAnchorLinks
                  links={pageLinks}
                  currentSectionId={currentSectionId}
                />
              </Flex>
            </GridArea>
            <OakGridArea $colSpan={[12, 9]}>
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
                    <LessonOverviewPresentation
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
                    shareable={isLegacyLicense}
                    slugs={slugs}
                    title={"Video"}
                    anchorId="video"
                    isFinalElement={
                      pageLinks.findIndex((p) => p.label === "Video") ===
                      pageLinks.length - 1
                    }
                  >
                    <LessonOverviewVideo
                      video={videoMuxPlaybackId}
                      signLanguageVideo={videoWithSignLanguageMuxPlaybackId}
                      title={lessonTitle}
                      transcriptSentences={transcriptSentences}
                      isLegacy={isLegacyLicense}
                    />
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Worksheet") && (
                  <LessonItemContainer
                    ref={worksheetSectionRef}
                    title={"Worksheet"}
                    anchorId="worksheet"
                    downloadable={true}
                    shareable={isLegacyLicense}
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
                    <LessonOverviewPresentation
                      asset={worksheetUrl}
                      title={lessonTitle}
                      isWorksheetLandscape={!!isWorksheetLandscape}
                      isWorksheet={true}
                    />
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Starter quiz") && (
                  <LessonItemContainer
                    ref={starterQuizSectionRef}
                    title={"Starter quiz"}
                    shareable={isLegacyLicense}
                    anchorId="starter-quiz"
                    downloadable={true}
                    onDownloadButtonClick={() => {
                      trackDownloadResourceButtonClicked({
                        downloadResourceButtonName: "starter quiz",
                      });
                    }}
                    slugs={slugs}
                    isFinalElement={
                      pageLinks.findIndex((p) => p.label === "Starter quiz") ===
                      pageLinks.length - 1
                    }
                  >
                    {starterQuiz && (
                      <QuizContainerNew
                        questions={starterQuiz}
                        imageAttribution={starterQuizImageAttribution}
                      />
                    )}
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Exit quiz") && (
                  <LessonItemContainer
                    ref={exitQuizSectionRef}
                    title={"Exit quiz"}
                    anchorId="exit-quiz"
                    downloadable={true}
                    shareable={isLegacyLicense}
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
                    {exitQuiz && (
                      <QuizContainerNew
                        questions={exitQuiz}
                        imageAttribution={exitQuizImageAttribution}
                      />
                    )}
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Additional material") && (
                  <LessonItemContainer
                    ref={additionalMaterialSectionRef}
                    title={"Additional material"}
                    anchorId="additional-material"
                    downloadable={true}
                    shareable={isLegacyLicense}
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
            </OakGridArea>
          </OakGrid>
        )}
      </MaxWidth>
    </MathJaxProvider>
  );
}
