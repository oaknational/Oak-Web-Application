"use client";

import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
} from "@oaknational/oak-components";

import LessonOverviewSideNav from "./LessonOverviewSideNav";

import PreviousNextNav from "@/components/TeacherComponents/PreviousNextNav/PreviousNextNav";
import { resolveOakHref } from "@/common-lib/urls";
import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import {
  getMediaClipLabel,
  getPageLinksWithSubheadingsForLesson,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { checkIfResourceHasLegacyCopyright } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadsLegacyCopyright";
import { DownloadResourceButtonNameValueType } from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getAnalyticsBrowseData } from "@/components/TeacherComponents/helpers/getAnalyticsBrowseData";

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
    downloads,
    lessonReleaseDate,
    lessonTitle,
    keyStageTitle,
    keyStageSlug,
    subjectTitle,
    unitTitle,
    year,
    yearTitle,
    examBoardTitle,
    tierTitle,
    pathwayTitle,
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

  const mediaClipLabel = subjectSlug
    ? getMediaClipLabel(subjectSlug)
    : "Video & audio clips";

  const pageLinks = getPageLinksWithSubheadingsForLesson(
    props,
    null,
    mediaClipLabel,
  );

  const hasDownloadableAssets = downloads.some((d) => d.exists === true);

  const { track } = useAnalytics();

  const browsePathwayData = getAnalyticsBrowseData({
    keyStageSlug,
    keyStageTitle,
    subjectSlug,
    subjectTitle,
    unitSlug,
    unitTitle,
    year,
    yearTitle,
    examBoardTitle,
    tierTitle,
    pathwayTitle,
    lessonSlug,
    lessonName: lessonTitle,
    lessonReleaseDate,
    isLegacy: false,
  });

  const trackDownloadResourceButtonClicked = (
    downloadResourceButtonName: DownloadResourceButtonNameValueType,
  ) => {
    track.lessonResourceDownloadStarted({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "use",
      componentType: "lesson_download_button",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      downloadResourceButtonName,
      ...browsePathwayData,
    });
  };

  const showDownloadAll = hasDownloadableAssets && !contentRestricted;

  return (
    <OakBox $ph="spacing-40">
      <OakGrid
        $cg="spacing-16"
        $rg="spacing-56"
        $mb={["spacing-0", "spacing-48", "spacing-48"]}
        $mh="auto"
        $mt={["spacing-48", "spacing-56"]}
        $width={"100%"}
        $maxWidth={"spacing-1280"}
      >
        <OakGridArea
          $colSpan={[12, 4, 4]}
          $display={["none", "block", "block"]}
        >
          <LessonOverviewSideNav
            links={pageLinks}
            contentRestricted={contentRestricted}
            downloadAllButtonProps={{
              lessonSlug,
              programmeSlug,
              unitSlug,
              showDownloadAll,
              onClickDownloadAll: () => {
                trackDownloadResourceButtonClicked("all");
              },
              geoRestricted,
              loginRequired,
              expired,
              isSpecialist: false,
              isCanonical: false,
            }}
            currentSectionId={null}
          />
        </OakGridArea>
        <OakGridArea $colSpan={[12, 8, 8]}>
          <OakBox id="slide-deck" style={{ height: 500 }}>
            <OakHeading tag="h2">Slide deck</OakHeading>
          </OakBox>
          <OakBox id="lesson-details" style={{ height: 500 }}>
            <OakHeading tag="h2">Lesson details</OakHeading>
          </OakBox>
          <OakBox id="video" style={{ height: 500 }}>
            <OakHeading tag="h2">Video</OakHeading>
          </OakBox>
          <OakBox id="worksheet" style={{ height: 500 }}>
            <OakHeading tag="h2">Worksheet</OakHeading>
          </OakBox>
          <OakBox id="quiz" style={{ height: 500 }}>
            <OakHeading tag="h2">Quiz</OakHeading>
          </OakBox>
        </OakGridArea>
        <OakGridArea $colSpan={12} $rowStart={[3, 2]} $mb={"spacing-48"}>
          <PreviousNextNav
            backgroundColorLevel={1}
            navItemType="lesson"
            previous={
              previousLesson
                ? {
                    href: resolveOakHref({
                      page: "integrated-lesson-overview",
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
                      page: "integrated-lesson-overview",
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
      </OakGrid>
    </OakBox>
  );
}
