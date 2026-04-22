"use client";

import {
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
} from "@oaknational/oak-components";

import { CurrentSectionIdProvider } from "./CurrentSectionIdProvider";
import LessonActionsBar from "./LessonShareBar/LessonActionsBar";
import LessonOverviewSideNav from "./LessonOverviewSideNav";

import PreviousNextNav from "@/components/TeacherComponents/PreviousNextNav/PreviousNextNav";
import { resolveOakHref } from "@/common-lib/urls";
import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import {
  getMediaClipLabel,
  getPageLinksWithSubheadingsForLesson,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { DownloadResourceButtonNameValueType } from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getAnalyticsBrowseData } from "@/components/TeacherComponents/helpers/getAnalyticsBrowseData";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";
import ComplexCopyrightRestrictionBanner from "@/components/TeacherComponents/ComplexCopyrightRestrictionBanner/ComplexCopyrightRestrictionBanner";
import { RestrictedContentPrompt } from "@/components/TeacherComponents/RestrictedContentPrompt/RestrictedContentPrompt";

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
    actions,
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
    contentRestricted,
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
  const showPupilShare =
    !contentRestricted && !expired && !actions?.disablePupilShare;

  return (
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
            <LessonActionsBar
              showPupilShare={showPupilShare}
              showCreateWithAi={!contentRestricted}
              lessonSlug={lessonSlug}
              unitSlug={unitSlug}
              programmeSlug={programmeSlug}
            />
          </OakGridArea>
          <OakGridArea
            $colSpan={[12, 8]}
            $colStart={[1, 5]}
            $rowStart={2}
            id="lesson-content"
          >
            {pageLinks.map((pageLink) => (
              <OakBox
                key={pageLink.anchorId}
                id={pageLink.anchorId}
                style={{ height: 500 }}
                className="anchor-section"
              >
                <OakHeading tag="h2">{pageLink.label}</OakHeading>
              </OakBox>
            ))}
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
          )}
        </OakGrid>
      </OakBox>
      {contentRestricted && !showGeoBlocked && <RestrictedContentPrompt />}
    </CurrentSectionIdProvider>
  );
}
