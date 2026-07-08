"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakInlineBanner,
} from "@oaknational/oak-components";
import { Fragment, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { CurrentSectionIdProvider } from "./CurrentSectionIdProvider";
import LessonOverviewSideNav from "./LessonOverviewSideNav";
import { getLessonResources } from "./getLessonResources";
import { LessonItem } from "./LessonItem";
import LessonActionsBar from "./LessonActionsBar/LessonActionsBar";
import { LessonSeoHelper } from "./LessonSeoHelper/LessonSeoHelper";

import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import PreviousNextNav from "@/components/TeacherComponents/PreviousNextNav/PreviousNextNav";
import { resolveOakHref } from "@/common-lib/urls";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import { TeachingMaterialTypeValueType } from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getAnalyticsBrowseData } from "@/components/TeacherComponents/helpers/getAnalyticsBrowseData";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { TrackingCallbackProps } from "@/components/TeacherComponents/LessonOverviewMediaClips";
import { hasLessonMathJax } from "@/components/TeacherViews/LessonOverview/hasLessonMathJax";
import { getSideNavLinksFromResources } from "@/components/TeacherComponents/LessonOverviewSideNavAnchorLinks/LessonOverviewSideNavAnchorLinks";
import ComplexCopyrightRestrictionBanner from "@/components/TeacherComponents/ComplexCopyrightRestrictionBanner/ComplexCopyrightRestrictionBanner";
import { RestrictedContentPrompt } from "@/components/TeacherComponents/RestrictedContentPrompt/RestrictedContentPrompt";
import { useTeacherBrowseAnalyticsStore } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export default function LessonView(
  props: Readonly<TeachersLessonOverviewPageData>,
) {
  const {
    programmeSlug,
    unitSlug,
    lessonSlug,
    subjectSlug,
    previousLesson,
    nextLesson,
    loginRequired,
    geoRestricted,
    expired,
    lessonReleaseDate,
    lessonTitle,
    keyStageTitle,
    keyStageSlug,
    subjectTitle,
    unitTitle,
    year,
    yearGroupTitle,
    examBoardTitle,
    examBoardSlug,
    tierTitle,
    pathwayTitle,
    phaseSlug,
    actions,
    subjectCategories,
    excludedFromTeachingMaterials,
  } = props;

  const {
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showGeoBlocked,
    showSignedInNotOnboarded,
  } = useComplexCopyright({
    loginRequired,
    geoRestricted,
  });

  const contentRestricted =
    showSignedOutGeoRestricted ||
    showSignedOutLoginRequired ||
    showGeoBlocked ||
    showSignedInNotOnboarded;

  const { track } = useAnalytics();
  const { isSignedIn } = useUser();
  const copyrightState = useComplexCopyright({
    loginRequired,
    geoRestricted,
  });
  const isMathJaxLesson = hasLessonMathJax(props, props.subjectSlug, false);
  const MathJaxLessonProvider = isMathJaxLesson ? MathJaxProvider : Fragment;
  const { trackLessonResourceDownloadStarted } = useTeacherBrowseAnalyticsStore(
    (s) => s.actions,
  );

  const browsePathwayData = getAnalyticsBrowseData({
    keyStageSlug,
    keyStageTitle,
    subjectSlug,
    subjectTitle,
    unitSlug,
    unitTitle,
    year,
    yearTitle: yearGroupTitle,
    examBoardTitle,
    tierTitle,
    pathwayTitle,
    lessonSlug,
    lessonName: lessonTitle,
    lessonReleaseDate,
    isLegacy: false,
  });

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
      learningCycle,
      ...browsePathwayData,
    });
  };

  const trackShare = () => {
    track.lessonShareStarted(browsePathwayData);
  };

  const lessonResources = getLessonResources({
    browsePathwayData,
    data: props,
    copyrightState,
    isMathJaxLesson,
    trackMediaClipsButtonClicked,
    contentRestricted,
  });

  const showPupilShare =
    !contentRestricted && !expired && !actions?.disablePupilShare;

  const isHeatwaveBannerEnabled =
    useFeatureFlagEnabled("heatwave-banner") ?? false;
  const [heatwaveBannerDismissed, setHeatwaveBannerDismissed] = useState(false);
  const showHeatwaveBanner =
    isHeatwaveBannerEnabled && showPupilShare && !heatwaveBannerDismissed;

  return (
    <MathJaxLessonProvider>
      <CurrentSectionIdProvider>
        <OakBox $ph={["spacing-20", "spacing-40"]}>
          <OakGrid
            $cg="spacing-16"
            $rg="spacing-32"
            $mb={["spacing-0", "spacing-48"]}
            $mh="auto"
            $mt={["spacing-48", "spacing-56"]}
            $width={"100%"}
            $maxWidth={"spacing-1280"}
          >
            {!contentRestricted && (
              <OakGridArea
                $colSpan={[12, 4]}
                $colStart={1}
                $rowStart={[2, 1, 2]}
                $rowSpan={[1, 2, 1]}
                $position="relative"
                $display={["none", "block"]}
              >
                <OakBox
                  $position="absolute"
                  $zIndex="in-front"
                  $top="spacing-0"
                  $left="spacing-0"
                >
                  <SkipLink href="#lesson-content">
                    Skip to lesson content
                  </SkipLink>
                </OakBox>
                <LessonOverviewSideNav
                  links={getSideNavLinksFromResources(lessonResources)}
                  contentRestricted={contentRestricted}
                  downloadAllButtonProps={{
                    lessonSlug,
                    programmeSlug,
                    unitSlug,
                    showDownloadAll: true,
                    onClickDownloadAll: () => {
                      trackLessonResourceDownloadStarted("all");
                    },
                    geoRestricted,
                    loginRequired,
                    expired,
                  }}
                />
              </OakGridArea>
            )}
            <OakGridArea
              $colSpan={[12, 8, 12]}
              $colStart={[1, 5, 1]}
              $rowStart={1}
            >
              <ComplexCopyrightRestrictionBanner
                isGeorestricted={geoRestricted}
                isLoginRequired={loginRequired}
                lessonName={lessonTitle}
                lessonSlug={lessonSlug}
                unitName={unitTitle}
                unitSlug={unitSlug}
                isLessonLegacy={false}
                componentType="lesson_overview"
              />
              {showHeatwaveBanner && (
                <OakInlineBanner
                  type="info"
                  icon="info"
                  title="Disruption this week due to hot weather? Set this lesson as remote work"
                  message={
                    <>
                      Click the {"\u2018"}
                      <strong>Share lesson with pupils</strong>
                      {"\u2019"} button below to share directly, or via
                      Microsoft Teams or Google Classroom
                    </>
                  }
                  canDismiss
                  onDismiss={() => setHeatwaveBannerDismissed(true)}
                  isOpen={true}
                  $maxWidth="fit-content"
                  $mb="spacing-16"
                />
              )}
              <LessonActionsBar
                showPupilShare={showPupilShare}
                createWithAiProps={
                  contentRestricted || excludedFromTeachingMaterials
                    ? undefined
                    : {
                        lessonSlug,
                        programmeSlug,
                        keyStageSlug,
                        subjectCategories,
                        actions,
                        subjectSlug,
                        trackCreateWithAiButtonClicked: () =>
                          track.createTeachingMaterialsInitiated({
                            platform: "owa",
                            product: "teacher lesson resources",
                            engagementIntent: "use",
                            componentType: "create_more_with_ai_button",
                            eventVersion: "2.0.0",
                            analyticsUseCase: "Teacher",
                            isLoggedIn: isSignedIn ?? false,
                          }),
                        trackTeachingMaterialsSelected: (
                          teachingMaterialType: TeachingMaterialTypeValueType,
                        ) => {
                          track.teachingMaterialsSelected({
                            platform: "owa",
                            product: "teacher lesson resources",
                            engagementIntent: "use",
                            componentType: "create_more_with_ai_dropdown",
                            eventVersion: "2.0.0",
                            analyticsUseCase: "Teacher",
                            interactionId: "",
                            teachingMaterialType: teachingMaterialType,
                          });
                        },
                      }
                }
                lessonSlug={lessonSlug}
                unitSlug={unitSlug}
                programmeSlug={programmeSlug}
                onClickShare={trackShare}
              />
            </OakGridArea>
            <OakGridArea
              $colSpan={[12, 8]}
              $colStart={[1, 5]}
              $rowStart={2}
              id="lesson-content"
            >
              <OakFlex
                $flexDirection={"column"}
                $gap={["spacing-56", "spacing-80"]}
              >
                {lessonResources.map((resource) => (
                  <LessonItem
                    slugs={{
                      lessonSlug,
                      unitSlug,
                      programmeSlug,
                    }}
                    resource={resource}
                    key={resource.resourceType}
                    onDownloadButtonClick={(props) =>
                      trackLessonResourceDownloadStarted(
                        props.downloadResourceButtonName,
                      )
                    }
                    onMediaClipsButtonClick={trackMediaClipsButtonClicked}
                  />
                ))}

                {!contentRestricted && (
                  <LessonSeoHelper
                    loginRequired={loginRequired}
                    geoRestricted={geoRestricted}
                    lessonSlug={lessonSlug}
                    year={year}
                    programmeSlug={programmeSlug}
                    unitSlug={unitSlug}
                    subject={subjectTitle}
                    phaseSlug={phaseSlug}
                    unit={unitTitle}
                    keystage={keyStageTitle}
                    examBoardSlug={examBoardSlug}
                    subjectSlug={subjectSlug}
                    disablePupilLink={
                      geoRestricted ||
                      loginRequired ||
                      actions?.disablePupilShare
                    }
                    lesson={lessonTitle}
                    keystageSlug={keyStageSlug}
                  />
                )}
              </OakFlex>
            </OakGridArea>

            {!contentRestricted && (
              <OakGridArea
                $colSpan={12}
                $colStart={1}
                $rowStart={3}
                $mb={"spacing-48"}
              >
                <PreviousNextNav
                  backgroundColorLevel={1}
                  navItemType="lesson"
                  previous={
                    previousLesson
                      ? {
                          href: resolveOakHref({
                            page: "lesson-overview",
                            programmeSlug,
                            unitSlug,
                            lessonSlug: previousLesson.lessonSlug,
                          }),
                          title: previousLesson.lessonTitle,
                          index: previousLesson.lessonIndex,
                        }
                      : undefined
                  }
                  next={
                    nextLesson
                      ? {
                          href: resolveOakHref({
                            page: "lesson-overview",
                            programmeSlug,
                            unitSlug,
                            lessonSlug: nextLesson.lessonSlug,
                          }),
                          title: nextLesson.lessonTitle,
                          index: nextLesson.lessonIndex,
                        }
                      : undefined
                  }
                />
              </OakGridArea>
            )}
          </OakGrid>
        </OakBox>
        {contentRestricted && !showGeoBlocked && <RestrictedContentPrompt />}
      </CurrentSectionIdProvider>
    </MathJaxLessonProvider>
  );
}
