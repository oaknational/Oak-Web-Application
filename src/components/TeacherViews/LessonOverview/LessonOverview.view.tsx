import React, { useRef, Fragment } from "react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
} from "@oaknational/oak-components";

import { hasLessonMathJax } from "./hasLessonMathJax";

import {
  getPageLinksForLesson,
  getBreadcrumbsForLessonPathway,
  getLessonOverviewBreadCrumb,
  createAttributionObject,
  getBreadcrumbsForSpecialistLessonPathway,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  LessonOverviewAll,
  SpecialistLessonPathway,
  getPathway,
  lessonIsSpecialist,
} from "@/components/TeacherComponents/types/lesson.types";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
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
import { LEGACY_COHORT, NEW_COHORT } from "@/config/cohort";
import { keyLearningPoint } from "@/node-lib/curriculum-api-2023/shared.schema";
import { LessonOverviewDownloads } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import {
  checkIsResourceCopyrightRestricted,
  getIsResourceDownloadable,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadsCopyright";
import NewContentBanner from "@/components/TeacherComponents/NewContentBanner/NewContentBanner";
import { GridArea } from "@/components/SharedComponents/Grid.deprecated";

export type LessonOverviewProps = {
  lesson: LessonOverviewAll & { downloads: LessonOverviewDownloads };
};

// helper function to remove key learning points from the header in legacy lessons
export const getDedupedPupilLessonOutcome = (
  plo: string | null | undefined,
  klp: keyLearningPoint[] | null | undefined,
) => {
  if (klp && plo) {
    return klp.some((klpItem) => klpItem.keyLearningPoint === plo) ? null : plo;
  }
  return plo;
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
    pupilLessonOutcome,
    lessonCohort,
    downloads,
    copyrightContent,
    isSpecialist,
    updatedAt,
    isCanonical,
  } = lesson;
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();
  const commonPathway = getPathway(lesson);

  const {
    keyStageSlug,
    keyStageTitle,
    subjectTitle,
    subjectSlug,
    unitTitle,
    unitSlug,
    programmeSlug,
  } = commonPathway;

  const isLegacyLicense = !lessonCohort || lessonCohort === LEGACY_COHORT;
  const isNew = lessonCohort === NEW_COHORT;
  const isMathJaxLesson = hasLessonMathJax(
    lesson,
    subjectSlug,
    isLegacyLicense,
  );

  const MathJaxLessonProvider = isMathJaxLesson ? MathJaxProvider : Fragment;

  const trackDownloadResourceButtonClicked = ({
    downloadResourceButtonName,
  }: {
    downloadResourceButtonName: DownloadResourceButtonNameValueType;
  }) => {
    track.lessonResourceDownloadStarted({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "use",
      componentType: "lesson_download_button",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      downloadResourceButtonName,
      keyStageSlug: keyStageSlug,
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      subjectSlug: subjectSlug,
      subjectTitle: subjectTitle,
      unitSlug: unitSlug,
      unitName: unitTitle,
      lessonSlug: lessonSlug,
      lessonName: lessonTitle,
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
  const pageLinks = getPageLinksForLesson(lesson, copyrightContent);
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

  const starterQuizImageAttribution = createAttributionObject(starterQuiz);

  const exitQuizImageAttribution = createAttributionObject(exitQuiz);

  const downloadsFilteredByCopyright = downloads.filter(
    (d) =>
      d.exists === true &&
      !checkIsResourceCopyrightRestricted(d.type, copyrightContent),
  );

  const showDownloadAll = downloadsFilteredByCopyright.length > 0;
  const showShare =
    !isSpecialist && keyStageSlug !== "early-years-foundation-stage";

  return (
    <MathJaxLessonProvider>
      <HeaderLesson
        {...lesson}
        {...commonPathway}
        breadcrumbs={
          !lessonIsSpecialist(lesson)
            ? [
                ...getBreadcrumbsForLessonPathway(commonPathway),
                getLessonOverviewBreadCrumb({
                  lessonTitle,
                  lessonSlug,
                  unitSlug,
                  programmeSlug,
                  disabled: true,
                  isCanonical,
                }),
              ]
            : [
                ...getBreadcrumbsForSpecialistLessonPathway(
                  commonPathway as SpecialistLessonPathway,
                ),
              ]
        }
        background={"pink30"}
        subjectIconBackgroundColor={"pink"}
        track={track}
        analyticsUseCase={analyticsUseCase}
        isNew={isNew}
        isShareable={!expired}
        onClickDownloadAll={() => {
          trackDownloadResourceButtonClicked({
            downloadResourceButtonName: "all",
          });
        }}
        onClickShareAll={trackShareAll}
        pupilLessonOutcome={getDedupedPupilLessonOutcome(
          pupilLessonOutcome,
          keyLearningPoints,
        )}
        showDownloadAll={showDownloadAll}
        showShare={showShare}
      />
      <MaxWidth $ph={16} $pb={80}>
        <NewContentBanner
          keyStageSlug={keyStageSlug ?? ""}
          subjectSlug={subjectSlug ?? ""}
          subjectTitle={subjectTitle ? subjectTitle.toLowerCase() : ""}
          programmeSlug={programmeSlug ?? ""}
          isLegacy={lessonCohort === LEGACY_COHORT}
        />
        {expired ? (
          <Box $pa={16} $mb={64}>
            <OakHeading $font={"heading-7"} tag={"h2"} $mb="space-between-s">
              No lesson available
            </OakHeading>
            <OakTypography $font={"body-1"}>
              Sorry, this lesson no longer exists.
            </OakTypography>
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
              <OakFlex
                as="nav"
                aria-label="page navigation"
                $flexDirection={"column"}
                $alignItems={"flex-start"}
                $gap={["all-spacing-2"]}
                $pr={["inner-padding-m"]}
              >
                <LessonOverviewAnchorLinks
                  links={pageLinks}
                  currentSectionId={currentSectionId}
                />
              </OakFlex>
            </GridArea>
            <OakGridArea $colSpan={[12, 9]}>
              <OakFlex $flexDirection={"column"} $position={"relative"}>
                {pageLinks.find((p) => p.label === "Slide deck") &&
                  !checkIsResourceCopyrightRestricted(
                    "presentation",
                    copyrightContent,
                  ) && (
                    <LessonItemContainer
                      isSpecialist={isSpecialist}
                      ref={slideDeckSectionRef}
                      title={"Slide deck"}
                      downloadable={getIsResourceDownloadable(
                        "presentation",
                        downloads,
                        copyrightContent,
                      )}
                      onDownloadButtonClick={() => {
                        trackDownloadResourceButtonClicked({
                          downloadResourceButtonName: "slide deck",
                        });
                      }}
                      slugs={slugs}
                      anchorId="slide-deck"
                      pageLinks={pageLinks}
                    >
                      <LessonOverviewPresentation
                        asset={presentationUrl}
                        title={lessonTitle}
                        isWorksheet={false}
                      />
                    </LessonItemContainer>
                  )}
                <LessonItemContainer
                  isSpecialist={isSpecialist}
                  ref={lessonDetailsSectionRef}
                  title={"Lesson details"}
                  anchorId="lesson-details"
                  pageLinks={pageLinks}
                >
                  <LessonDetails
                    keyLearningPoints={keyLearningPoints}
                    commonMisconceptions={misconceptionsAndCommonMistakes}
                    keyWords={
                      lessonKeywords?.length ? lessonKeywords : undefined
                    }
                    teacherTips={teacherTips}
                    equipmentAndResources={lessonEquipmentAndResources}
                    contentGuidance={contentGuidance}
                    supervisionLevel={supervisionLevel}
                    isLegacyLicense={isLegacyLicense}
                    isMathJaxLesson={isMathJaxLesson}
                    updatedAt={updatedAt}
                  />
                </LessonItemContainer>

                {pageLinks.find((p) => p.label === "Video") && (
                  <LessonItemContainer
                    isSpecialist={isSpecialist}
                    ref={videoSectionRef}
                    shareable={isLegacyLicense && showShare}
                    slugs={slugs}
                    title={"Video"}
                    anchorId="video"
                    isFinalElement={
                      pageLinks.findIndex((p) => p.label === "Video") ===
                      pageLinks.length - 1
                    }
                    pageLinks={pageLinks}
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
                    isSpecialist={isSpecialist}
                    ref={worksheetSectionRef}
                    title={"Worksheet"}
                    anchorId="worksheet"
                    pageLinks={pageLinks}
                    downloadable={
                      getIsResourceDownloadable(
                        "worksheet-pdf",
                        downloads,
                        copyrightContent,
                      ) ||
                      getIsResourceDownloadable(
                        "worksheet-pptx",
                        downloads,
                        copyrightContent,
                      )
                    }
                    shareable={isLegacyLicense && showShare}
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
                    isSpecialist={isSpecialist}
                    ref={starterQuizSectionRef}
                    title={"Starter quiz"}
                    shareable={isLegacyLicense && showShare}
                    anchorId="starter-quiz"
                    pageLinks={pageLinks}
                    downloadable={
                      getIsResourceDownloadable(
                        "intro-quiz-answers",
                        downloads,
                        copyrightContent,
                      ) ||
                      getIsResourceDownloadable(
                        "intro-quiz-questions",
                        downloads,
                        copyrightContent,
                      )
                    }
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
                        isMathJaxLesson={isMathJaxLesson}
                      />
                    )}
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Exit quiz") && (
                  <LessonItemContainer
                    isSpecialist={isSpecialist}
                    ref={exitQuizSectionRef}
                    pageLinks={pageLinks}
                    title={"Exit quiz"}
                    anchorId="exit-quiz"
                    downloadable={
                      getIsResourceDownloadable(
                        "exit-quiz-answers",
                        downloads,
                        copyrightContent,
                      ) ||
                      getIsResourceDownloadable(
                        "exit-quiz-questions",
                        downloads,
                        copyrightContent,
                      )
                    }
                    shareable={isLegacyLicense && showShare}
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
                        isMathJaxLesson={isMathJaxLesson}
                      />
                    )}
                  </LessonItemContainer>
                )}
                {pageLinks.find((p) => p.label === "Additional material") && (
                  <LessonItemContainer
                    isSpecialist={isSpecialist}
                    ref={additionalMaterialSectionRef}
                    pageLinks={pageLinks}
                    title={"Additional material"}
                    anchorId="additional-material"
                    downloadable={
                      getIsResourceDownloadable(
                        "supplementary-docx",
                        downloads,
                        copyrightContent,
                      ) ||
                      getIsResourceDownloadable(
                        "supplementary-pdf",
                        downloads,
                        copyrightContent,
                      )
                    }
                    shareable={isLegacyLicense && showShare}
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
                    <OakTypography $font={"body-1"}>
                      We're sorry, but preview is not currently available.
                      Download to see additional material.
                    </OakTypography>
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
              </OakFlex>
            </OakGridArea>
          </OakGrid>
        )}
      </MaxWidth>
    </MathJaxLessonProvider>
  );
}
