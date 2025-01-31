import React, { useRef, Fragment, useState } from "react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
  OakBox,
  OakMaxWidth,
} from "@oaknational/oak-components";

import { hasLessonMathJax } from "./hasLessonMathJax";

import {
  getPageLinksForLesson,
  getBreadcrumbsForLessonPathway,
  getLessonOverviewBreadCrumb,
  createAttributionObject,
  getBreadcrumbsForSpecialistLessonPathway,
  getMediaClipLabel,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  LessonOverviewAll,
  SpecialistLessonPathway,
  getPathway,
  lessonIsSpecialist,
} from "@/components/TeacherComponents/types/lesson.types";
import LessonOverviewPresentation from "@/components/TeacherComponents/LessonOverviewPresentation";
import LessonOverviewVideo from "@/components/TeacherComponents/LessonOverviewVideo";
import QuizContainerNew from "@/components/TeacherComponents/LessonOverviewQuizContainer";
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
import { ExpiringBanner } from "@/components/SharedComponents/ExpiringBanner";
import LessonOverviewMediaClips from "@/components/TeacherComponents/LessonOverviewMediaClips";
import LessonOverviewDocPresentation from "@/components/TeacherComponents/LessonOverviewDocPresentation";
import { TeacherNoteInline } from "@/components/TeacherComponents/TeacherNoteInline/TeacherNoteInline";

export type LessonOverviewProps = {
  lesson: LessonOverviewAll & { downloads: LessonOverviewDownloads } & {
    teacherShareButton?: React.ReactNode;
    teacherNoteHtml?: string;
    teacherNoteError?: string | null;
  };
} & { isBeta: boolean };

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
    lessonGuideUrl,
    teacherShareButton,
    additionalMaterialUrl,
    actions,
    hasMediaClips,
    lessonMediaClips,
    teacherNoteHtml,
    teacherNoteError,
    additionalFiles,
    lessonOutline,
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

  const mediaClipLabel = subjectSlug
    ? getMediaClipLabel(subjectSlug)
    : "Video & audio clips";

  const MathJaxLessonProvider = isMathJaxLesson ? MathJaxProvider : Fragment;

  const [showExpiredLessonsBanner, setShowExpiredLessonsBanner] =
    useState<boolean>(actions?.displayExpiringBanner);

  const unitListingHref = `/teachers/key-stages/${keyStageSlug}/subjects/${subjectSlug}/programmes`;

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
  const pageLinks = getPageLinksForLesson(
    lesson,
    copyrightContent,
    mediaClipLabel,
  );

  const slideDeckSectionRef = useRef<HTMLDivElement>(null);
  const lessonDetailsSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const worksheetSectionRef = useRef<HTMLDivElement>(null);
  const starterQuizSectionRef = useRef<HTMLDivElement>(null);
  const exitQuizSectionRef = useRef<HTMLDivElement>(null);
  const additionalMaterialSectionRef = useRef<HTMLDivElement>(null);
  const lessonGuideSectionRef = useRef<HTMLDivElement>(null);
  const lessonMediaClipsSectionRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    "lesson-guide": lessonGuideSectionRef,
    "slide-deck": slideDeckSectionRef,
    "lesson-details": lessonDetailsSectionRef,
    video: videoSectionRef,
    worksheet: worksheetSectionRef,
    "starter-quiz": starterQuizSectionRef,
    "exit-quiz": exitQuizSectionRef,
    "additional-material": additionalMaterialSectionRef,
    "media-clips": lessonMediaClipsSectionRef,
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
    !isSpecialist &&
    keyStageSlug !== "early-years-foundation-stage" &&
    !actions?.disablePupilShare;

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
        isShareable={!expired && !actions?.disablePupilShare}
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
        teacherShareButton={teacherShareButton}
      />
      <OakMaxWidth $ph={"inner-padding-m"} $pb={"inner-padding-xl8"}>
        {expired ? (
          <OakBox $pa={"inner-padding-m"} $mb={"space-between-xxl"}>
            <OakHeading $font={"heading-7"} tag={"h2"} $mb="space-between-s">
              No lesson available
            </OakHeading>
            <OakTypography $font={"body-1"}>
              Sorry, this lesson no longer exists.
            </OakTypography>
          </OakBox>
        ) : (
          <OakGrid $mt={["space-between-l"]}>
            <OakGridArea
              $colSpan={[12, 3]}
              $alignSelf={"start"}
              $position={"sticky"}
              $display={["none", "block"]}
              $top={"all-spacing-14"} // FIXME: ideally we'd dynamically calculate this based on the height of the header using the next allowed size. This could be achieved with a new helperFunction get nextAvailableSize
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
            </OakGridArea>

            <OakGridArea $colSpan={[12, 9]}>
              <OakFlex $flexDirection={"column"} $position={"relative"}>
                <OakBox $pb={"inner-padding-m"}>
                  <ExpiringBanner
                    isOpen={showExpiredLessonsBanner}
                    isResourcesMessage={true}
                    onwardHref={unitListingHref}
                    onClose={() => {
                      setShowExpiredLessonsBanner(false);
                    }}
                  />
                </OakBox>

                <TeacherNoteInline
                  unsafeHtml={teacherNoteHtml}
                  error={teacherNoteError}
                />

                {pageLinks.find((p) => p.label === "Lesson guide") &&
                  lessonGuideUrl && (
                    <LessonItemContainer
                      isSpecialist={isSpecialist}
                      ref={lessonGuideSectionRef}
                      title={"Lesson guide"}
                      //Defaulted to false until download ticket implementation
                      downloadable={false}
                      // Avo types need to be updated to include lesson guide
                      // onDownloadButtonClick={() => {
                      //   trackDownloadResourceButtonClicked({
                      //     downloadResourceButtonName: "lesson guide",
                      //   });
                      // }}
                      slugs={slugs}
                      anchorId="lesson-guide"
                      pageLinks={pageLinks}
                    >
                      <LessonOverviewDocPresentation
                        asset={lessonGuideUrl}
                        title={lessonTitle}
                        isWorksheetLandscape={true}
                        docType="lesson guide"
                      />
                    </LessonItemContainer>
                  )}

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
                {pageLinks.find((p) => p.label === mediaClipLabel) &&
                  lessonMediaClips &&
                  hasMediaClips && (
                    <LessonItemContainer
                      title={mediaClipLabel}
                      ref={lessonMediaClipsSectionRef}
                      anchorId="media-clips"
                      isSpecialist={isSpecialist}
                      slugs={slugs}
                      pageLinks={pageLinks}
                      displayMediaClipButton={true}
                      isCanonical={isCanonical}
                    >
                      <LessonOverviewMediaClips
                        lessonSlug={lessonSlug}
                        learningCycleVideos={lessonMediaClips}
                        isCanonical={isCanonical}
                        unitSlug={unitSlug ?? null}
                        programmeSlug={programmeSlug ?? null}
                        lessonOutline={lessonOutline}
                        isPELesson={actions.displayPETitle}
                      />
                    </LessonItemContainer>
                  )}

                <LessonItemContainer
                  isSpecialist={isSpecialist}
                  ref={lessonDetailsSectionRef}
                  title={"Lesson details"}
                  anchorId="lesson-details"
                  slugs={slugs}
                  pageLinks={pageLinks}
                >
                  <LessonDetails
                    keyLearningPoints={keyLearningPoints}
                    commonMisconceptions={misconceptionsAndCommonMistakes}
                    keyWords={
                      lessonKeywords?.length ? lessonKeywords : undefined
                    }
                    slugs={slugs}
                    teacherTips={teacherTips}
                    equipmentAndResources={lessonEquipmentAndResources}
                    contentGuidance={contentGuidance}
                    supervisionLevel={supervisionLevel}
                    isLegacyLicense={isLegacyLicense}
                    isMathJaxLesson={isMathJaxLesson}
                    hasVocabAndTranscripts={Boolean(additionalMaterialUrl)}
                    displayVocab={actions.displayVocabButton}
                    updatedAt={updatedAt}
                    additionalFiles={additionalFiles}
                  />
                </LessonItemContainer>

                {pageLinks.find((p) => p.label === "Lesson video") && (
                  <LessonItemContainer
                    isSpecialist={isSpecialist}
                    ref={videoSectionRef}
                    shareable={isLegacyLicense && showShare}
                    slugs={slugs}
                    title={"Lesson video"}
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
                {pageLinks.find((p) => p.label === "Additional material") &&
                  additionalMaterialUrl && (
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
                      <LessonOverviewDocPresentation
                        asset={additionalMaterialUrl}
                        title={lessonTitle}
                        isWorksheetLandscape={false}
                        docType="additional material"
                      />
                    </LessonItemContainer>
                  )}
              </OakFlex>
            </OakGridArea>
          </OakGrid>
        )}
      </OakMaxWidth>
    </MathJaxLessonProvider>
  );
}
