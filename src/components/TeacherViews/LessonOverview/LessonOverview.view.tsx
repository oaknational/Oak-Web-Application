import React, { useRef, Fragment } from "react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakFlex,
  OakBox,
  OakMaxWidth,
  OakLink,
  OakSpan,
} from "@oaknational/oak-components";
import {
  useFeatureFlagEnabled,
  useFeatureFlagVariantKey,
} from "posthog-js/react";
import { useUser } from "@clerk/nextjs";

import { getContainerId } from "../../TeacherComponents/LessonItemContainer/LessonItemContainer";

import { hasLessonMathJax } from "./hasLessonMathJax";

import {
  getBreadcrumbsForLessonPathway,
  getLessonOverviewBreadCrumb,
  createAttributionObject,
  getBreadcrumbsForSpecialistLessonPathway,
  getMediaClipLabel,
  lessonIsSpecialist,
  getPathway,
  getPageLinksWithSubheadingsForLesson,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  LessonOverviewAll,
  SpecialistLessonPathway,
} from "@/components/TeacherComponents/types/lesson.types";
import LessonOverviewPresentation from "@/components/TeacherComponents/LessonOverviewPresentation";
import LessonOverviewVideo from "@/components/TeacherComponents/LessonOverviewVideo";
import QuizContainerNew from "@/components/TeacherComponents/LessonOverviewQuizContainer";
import useAnalytics from "@/context/Analytics/useAnalytics";
import type {
  KeyStageTitleValueType,
  DownloadResourceButtonNameValueType,
  PathwayValueType,
  ExamBoardValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import LessonDetails from "@/components/TeacherComponents/LessonOverviewDetails";
import { LessonItemContainer } from "@/components/TeacherComponents/LessonItemContainer";
import HeaderLesson from "@/components/TeacherComponents/LessonOverviewHeader";
import { useCurrentSection } from "@/components/TeacherComponents/helpers/lessonHelpers/useCurrentSection";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { LEGACY_COHORT, NEW_COHORT } from "@/config/cohort";
import { keyLearningPoint } from "@/node-lib/curriculum-api-2023/shared.schema";
import { LessonOverviewDownloads } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import {
  checkIsResourceCopyrightRestricted,
  getIsResourceDownloadable,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadsCopyright";
import { ExpiringBanner } from "@/components/SharedComponents/ExpiringBanner";
import LessonOverviewMediaClips, {
  TrackingCallbackProps,
} from "@/components/TeacherComponents/LessonOverviewMediaClips";
import LessonOverviewDocPresentation from "@/components/TeacherComponents/LessonOverviewDocPresentation";
import { TeacherNoteInline } from "@/components/TeacherComponents/TeacherNoteInline/TeacherNoteInline";
import LessonOverviewSideNavAnchorLinks from "@/components/TeacherComponents/LessonOverviewSideNavAnchorLinks";
import { RestrictedSignInPrompt } from "@/components/TeacherComponents/RestrictedSignInPrompt/RestrictedSignInPrompt";
import AnchorTarget from "@/components/SharedComponents/AnchorTarget";

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
    lessonReleaseDate,
    loginRequired,
    geoRestricted,
  } = lesson;
  const { isSignedIn } = useUser();
  const copyrightFeatureFlagEnabled =
    useFeatureFlagEnabled("teachers-copyright-restrictions") ?? false;
  const contentRestricted =
    copyrightFeatureFlagEnabled &&
    !isSignedIn &&
    (loginRequired || geoRestricted);

  const isSubHeader =
    useFeatureFlagVariantKey("lesson-overview-subheader-experiment") === "test";

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
    yearTitle,
    examBoardSlug,
    examBoardTitle,
    tierTitle,
    subjectParent,
    pathwayTitle,
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
      keyStageSlug,
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      subjectSlug,
      subjectTitle,
      unitSlug,
      unitName: unitTitle,
      lessonSlug,
      lessonName: lessonTitle,
      pathway: pathwayTitle as PathwayValueType,
      examBoard: examBoardTitle as ExamBoardValueType,
      tierName: tierTitle as TierNameValueType,
      lessonReleaseCohort: lesson.isLegacy ? "2020-2023" : "2023-2026",
      lessonReleaseDate: lessonReleaseDate ?? "unreleased",
    });
  };

  const trackMediaClipsButtonClicked = ({
    mediaClipsButtonName,
    learningCycle,
  }: TrackingCallbackProps) => {
    track.lessonMediaClipsStarted({
      platform: "owa",
      product: "media clips",
      engagementIntent: "use",
      componentType: "go_to_media_clips_page_button",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      mediaClipsButtonName,
      keyStageSlug,
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      subjectSlug,
      subjectTitle,
      unitSlug,
      unitName: unitTitle,
      lessonSlug,
      lessonName: lessonTitle,
      pathway: pathwayTitle as PathwayValueType,
      tierName: null,
      yearGroupName: null,
      yearGroupSlug: null,
      examBoard: null,
      learningCycle,
      releaseGroup: lesson.isLegacy ? "legacy" : "2023",
      phase: null,
      lessonReleaseCohort: lesson.isLegacy ? "2020-2023" : "2023-2026",
      lessonReleaseDate: lessonReleaseDate ?? "unreleased",
    });
  };

  const trackShareAll = () => {
    track.lessonShareStarted({
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      keyStageSlug,
      subjectTitle,
      subjectSlug,
      unitName: unitTitle,
      unitSlug,
      lessonName: lessonTitle,
      lessonSlug,
      lessonReleaseCohort: lesson.isLegacy ? "2020-2023" : "2023-2026",
      lessonReleaseDate: lessonReleaseDate ?? "unreleased",
    });
  };

  const slugs = { unitSlug, lessonSlug, programmeSlug };

  const slideDeckSectionRef = useRef<HTMLDivElement>(null);
  const lessonDetailsSectionRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const worksheetSectionRef = useRef<HTMLDivElement>(null);
  const starterQuizSectionRef = useRef<HTMLDivElement>(null);
  const exitQuizSectionRef = useRef<HTMLDivElement>(null);
  const additionalMaterialSectionRef = useRef<HTMLDivElement>(null);
  const lessonGuideSectionRef = useRef<HTMLDivElement>(null);
  const lessonMediaClipsSectionRef = useRef<HTMLDivElement>(null);
  const quizSectionRef = useRef<HTMLDivElement>(null);
  const restrictedContentRef = useRef<HTMLDivElement>(null);

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
    quiz: quizSectionRef,
    "restricted-content": restrictedContentRef,
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

  const pageLinks = getPageLinksWithSubheadingsForLesson(
    lesson,
    copyrightContent,
    mediaClipLabel,
  );
  const presentationTitle = "Lesson slides";
  const quizDownloadTitle = "quiz pdf";

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
                <LessonOverviewSideNavAnchorLinks
                  contentRestricted={contentRestricted}
                  links={pageLinks}
                  currentSectionId={currentSectionId}
                />
              </OakFlex>
            </OakGridArea>

            <OakGridArea $colSpan={[12, 9]}>
              <OakFlex $flexDirection={"column"} $position={"relative"}>
                <OakBox $pb={"inner-padding-m"}>
                  <ExpiringBanner
                    isOpen={actions?.displayExpiringBanner}
                    isResourcesMessage={true}
                    onwardHref={unitListingHref}
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
                      downloadable={getIsResourceDownloadable(
                        "lesson-guide-pdf",
                        downloads,
                        copyrightContent,
                      )}
                      onDownloadButtonClick={() => {
                        trackDownloadResourceButtonClicked({
                          downloadResourceButtonName: "lesson guide",
                        });
                      }}
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

                {pageLinks.find((p) => p.label === presentationTitle) &&
                  !contentRestricted &&
                  !checkIsResourceCopyrightRestricted(
                    "presentation",
                    copyrightContent,
                  ) && (
                    <LessonItemContainer
                      isSpecialist={isSpecialist}
                      ref={slideDeckSectionRef}
                      title={presentationTitle}
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
                      subheader={
                        isSubHeader
                          ? "We break learning into key concepts using learning cycles, each with clear explanations, checks for understanding, and practice tasks with feedback — all in downloadable slides ready to adapt."
                          : undefined
                      }
                    >
                      <LessonOverviewPresentation
                        asset={presentationUrl}
                        title={lessonTitle}
                        isWorksheet={false}
                      />
                    </LessonItemContainer>
                  )}
                {pageLinks.find((p) => p.label === mediaClipLabel) &&
                  !contentRestricted &&
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
                      onPlayALLMediaClipButtonClick={() => {
                        trackMediaClipsButtonClicked({
                          mediaClipsButtonName: "play all",
                        });
                      }}
                      isCanonical={isCanonical}
                    >
                      <LessonOverviewMediaClips
                        lessonSlug={lessonSlug}
                        learningCycleVideos={lessonMediaClips}
                        isCanonical={isCanonical}
                        unitSlug={unitSlug ?? null}
                        programmeSlug={programmeSlug ?? null}
                        lessonOutline={lessonOutline}
                        isPELesson={actions?.displayPETitle}
                        isMFL={actions?.displayVocabButton}
                        onTrackingCallback={trackMediaClipsButtonClicked}
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
                    displayVocab={actions?.displayVocabButton}
                    updatedAt={updatedAt}
                    additionalFiles={additionalFiles}
                    year={yearTitle}
                    subject={subjectTitle}
                    keystage={keyStageTitle}
                    unit={unitTitle}
                    lesson={lessonTitle}
                    examBoardSlug={examBoardSlug}
                    subjectSlug={subjectSlug}
                    subjectParent={subjectParent}
                    disablePupilLink={actions?.disablePupilShare}
                  />
                </LessonItemContainer>

                {pageLinks.find((p) => p.label === "Lesson video") &&
                  !contentRestricted && (
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
                      subheader={
                        isSubHeader ? (
                          <OakSpan>
                            Our video supports your planning with teaching tips,
                            modelled explanations, and inspiration from other
                            teachers.{" "}
                            {showShare ? (
                              <OakSpan>
                                You can also share the{" "}
                                <OakLink
                                  href={`/pupils/lessons/${lessonSlug}/video`}
                                >
                                  online pupil version
                                </OakLink>{" "}
                                of this lesson for homework or revision to keep
                                learning on track.{" "}
                              </OakSpan>
                            ) : (
                              ""
                            )}
                          </OakSpan>
                        ) : undefined
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
                {pageLinks.find((p) => p.label === "Worksheet") &&
                  !contentRestricted && (
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
                      subheader={
                        isSubHeader
                          ? "The practice tasks in the lesson slides are also available as an editable worksheet ready to download in PowerPoint format."
                          : undefined
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
                <OakFlex
                  $flexDirection="column"
                  $position={"relative"}
                  tabIndex={-1}
                >
                  <AnchorTarget
                    id={"quiz"}
                    $paddingTop={24}
                    ref={quizSectionRef}
                  />
                  {pageLinks.find(
                    (p) =>
                      p.anchorId === "quiz" || p.anchorId === "starter-quiz",
                  ) &&
                    !contentRestricted && (
                      <LessonItemContainer
                        isSpecialist={isSpecialist}
                        ref={
                          pageLinks.find((p) => p.anchorId === "starter-quiz")
                            ? starterQuizSectionRef
                            : undefined
                        }
                        title={"Prior knowledge starter quiz"}
                        downloadTitle={quizDownloadTitle}
                        shareable={isLegacyLicense && showShare}
                        anchorId={"starter-quiz"}
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
                          pageLinks.findIndex(
                            (p) => p.anchorId === "starter-quiz",
                          ) ===
                          pageLinks.length - 1
                        }
                        subheader={
                          isSubHeader
                            ? "This starter quiz will check that your pupils have the necessary prior knowledge and can access it for this lesson."
                            : undefined
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
                  {pageLinks.find(
                    (p) => p.anchorId === "exit-quiz" || p.anchorId === "quiz",
                  ) &&
                    !contentRestricted && (
                      <LessonItemContainer
                        isSpecialist={isSpecialist}
                        ref={
                          pageLinks.find((p) => p.anchorId === "exit-quiz")
                            ? exitQuizSectionRef
                            : undefined
                        }
                        pageLinks={pageLinks}
                        title={"Assessment exit quiz"}
                        downloadTitle={quizDownloadTitle}
                        anchorId={"exit-quiz"}
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
                          pageLinks.findIndex((p) => p.label === "Quizzes") ===
                          pageLinks.length - 1
                        }
                        subheader={
                          isSubHeader
                            ? "This quiz will test your pupils’ understanding of the key learning points at the end of the lesson and can also be used later for retrieval practice."
                            : undefined
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
                </OakFlex>

                {pageLinks.find((p) => p.label === "Additional material") &&
                  additionalMaterialUrl &&
                  !contentRestricted && (
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
                      subheader={
                        isSubHeader
                          ? "This lesson includes an editable additional material you can use during teaching."
                          : undefined
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
        {contentRestricted && (
          <OakBox
            $position={"relative"}
            id={getContainerId("restricted-content")}
          >
            <AnchorTarget
              tabIndex={-1}
              id="restricted-content"
              ref={restrictedContentRef}
            />
            <RestrictedSignInPrompt />
          </OakBox>
        )}
      </OakMaxWidth>
    </MathJaxLessonProvider>
  );
}
