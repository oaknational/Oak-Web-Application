"use client";

import { Fragment } from "react";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";

import { getLessonResources } from "./getLessonResources";
import { LessonItem } from "./LessonItem";

import PreviousNextNav from "@/components/TeacherComponents/PreviousNextNav/PreviousNextNav";
import { resolveOakHref } from "@/common-lib/urls";
import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { hasLessonMathJax } from "@/components/TeacherViews/LessonOverview/hasLessonMathJax";
import { getAnalyticsBrowseData } from "@/components/TeacherComponents/helpers/getAnalyticsBrowseData";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { DownloadResourceButtonNameValueType } from "@/browser-lib/avo/Avo";
import { TrackingCallbackProps } from "@/components/TeacherComponents/LessonOverviewMediaClips";

export default function LessonView(
  data: Readonly<TeachersLessonOverviewPageData>,
) {
  const { track } = useAnalytics();
  const copyRightState = useComplexCopyright({
    loginRequired: data.loginRequired,
    geoRestricted: data.geoRestricted,
  });
  const isMathJaxLesson = hasLessonMathJax(data, data.subjectSlug, false);
  const MathJaxLessonProvider = isMathJaxLesson ? MathJaxProvider : Fragment;

  const browsePathwayData = getAnalyticsBrowseData({
    keyStageSlug: data.keyStageSlug,
    keyStageTitle: data.keyStageTitle,
    subjectSlug: data.subjectSlug,
    subjectTitle: data.subjectTitle,
    unitSlug: data.unitSlug,
    unitTitle: data.unitTitle,
    year: data.year,
    yearTitle: data.yearTitle,
    examBoardTitle: data.examBoardTitle,
    tierTitle: data.tierTitle,
    pathwayTitle: data.pathwayTitle,
    lessonSlug: data.lessonSlug,
    lessonName: data.lessonTitle,
    lessonReleaseDate: data.lessonReleaseDate,
    isLegacy: false,
  });

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
      ...browsePathwayData,
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
      learningCycle,
      ...browsePathwayData,
    });
  };

  const lessonResources = getLessonResources({
    browsePathwayData,
    downloads: data.downloads,
    data,
    copyRightState,
    isMathJaxLesson,
    trackMediaClipsButtonClicked,
  });

  return (
    <MathJaxLessonProvider>
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
            $colSpan={[12, 3]}
            $alignSelf={"start"}
            $position={"sticky"}
            $display={["none", "block"]}
          >
            {/* anchor links area */}
          </OakGridArea>
          <OakGridArea $colSpan={[12, 9]}>
            <OakFlex $flexDirection={"column"} $gap={"spacing-56"}>
              <OakFlex
                $flexDirection={"column"}
                $gap={["spacing-56", "spacing-80"]}
              >
                {lessonResources.map((resource) => (
                  <LessonItem
                    slugs={{
                      lessonSlug: data.lessonSlug,
                      unitSlug: data.unitSlug,
                      programmeSlug: data.programmeSlug,
                    }}
                    resource={resource}
                    key={resource.key}
                    onDownloadButtonClick={trackDownloadResourceButtonClicked}
                    onMediaClipsButtonClick={trackMediaClipsButtonClicked}
                  />
                ))}
              </OakFlex>
              <PreviousNextNav
                backgroundColorLevel={1}
                currentIndex={data.orderInUnit ?? undefined}
                navItemType="lesson"
                previous={
                  data.previousLesson
                    ? {
                        href: resolveOakHref({
                          page: "integrated-lesson-overview",
                          programmeSlug: data.programmeSlug,
                          unitSlug: data.unitSlug,
                          lessonSlug: data.previousLesson.lessonSlug,
                        }),
                        title: data.previousLesson.lessonTitle,
                        index: data.previousLesson.lessonIndex,
                      }
                    : undefined
                }
                next={
                  data.nextLesson
                    ? {
                        href: resolveOakHref({
                          page: "integrated-lesson-overview",
                          programmeSlug: data.programmeSlug,
                          unitSlug: data.unitSlug,
                          lessonSlug: data.nextLesson.lessonSlug,
                        }),
                        title: data.nextLesson.lessonTitle,
                        index: data.nextLesson.lessonIndex,
                      }
                    : undefined
                }
              />
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </OakBox>
    </MathJaxLessonProvider>
  );
}
