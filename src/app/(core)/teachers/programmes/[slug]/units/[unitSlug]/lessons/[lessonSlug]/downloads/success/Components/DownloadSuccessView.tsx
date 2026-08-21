"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakIcon,
  OakSpan,
} from "@oaknational/oak-components";

import { LessonList } from "@/app/(core)/teachers/programmes/[slug]/units/[unitSlug]/lessons/Components/LessonList";
import { DownloadSuccessHeader } from "@/app/(core)/teachers/programmes/[slug]/units/[unitSlug]/lessons/[lessonSlug]/Components/DownloadSuccessHeader/DownloadSuccessHeader";
import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "@/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton";
import { resolveOakHref } from "@/common-lib/urls";
import type { LessonListSchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { getUnitDownloadFileId } from "@/utils/getUnitDownloadFileId";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { useCaptureFeatureFlag } from "@/utils/posthogExperiments/useCaptureFeatureFlag";

type DownloadSuccessViewLesson = {
  lessonTitle: string;
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  unitTitle: string;
  unitDescription: string | null;
  lessonReleaseDate: string;
  lessons: LessonListSchema;
  unitvariantId: number;
};

export type DownloadSuccessViewProps = {
  lesson: DownloadSuccessViewLesson;
  /** Enabled on the `variant` route, disabled on the control route */
  showCompactHeader?: boolean;
};

export function DownloadSuccessView({
  lesson,
  showCompactHeader = false,
}: Readonly<DownloadSuccessViewProps>) {
  useCaptureFeatureFlag("download-success-header-compact");

  const {
    lessonSlug,
    programmeSlug,
    unitSlug,
    unitTitle,
    lessons,
    unitvariantId,
  } = lesson;

  const { unitDownloaded, onwardContentSelected } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );

  const {
    setShowDownloadMessage,
    setDownloadError,
    setDownloadInProgress,
    downloadInProgress,
    setShowIncompleteMessage,
  } = useUnitDownloadButtonState();

  const isGeorestrictedUnit = lessons.some(
    (l) => "geoRestricted" in l && l.geoRestricted,
  );

  return (
    <>
      <DownloadSuccessHeader
        href={resolveOakHref({
          page: "lesson-overview",
          lessonSlug,
          programmeSlug,
          unitSlug,
        })}
        onBackClick={() =>
          onwardContentSelected({
            onwardIntent: "view-lesson",
          })
        }
        backgroundColorLevel={1}
        returnTo="lesson"
        showCompactHeader={showCompactHeader}
      />
      <OakBox $ph={["spacing-20", "spacing-40"]}>
        <OakGrid
          $pt="spacing-72"
          $pb="spacing-80"
          $mh="auto"
          $maxWidth="spacing-1280"
          $cg="spacing-12"
        >
          <OakGridArea $colSpan={[12, 8]} $colStart={[1, 3]} $gap="spacing-48">
            <OakFlex
              $font="heading-light-6"
              $mh="auto"
              $alignItems="center"
              $gap="spacing-12"
            >
              <OakIcon iconName="arrow-down" $colorFilter="text-success" />
              <span>
                <OakSpan $font="heading-6">Ready to keep going?</OakSpan>{" "}
                Explore the lessons in this unit sequence.
              </span>
              <OakIcon iconName="arrow-down" $colorFilter="text-success" />
            </OakFlex>
            <LessonList
              programmeSlug={lesson.programmeSlug}
              unitSlug={lesson.unitSlug}
              unitTitle={lesson.unitTitle}
              unitDescription={lesson.unitDescription}
              lessons={lessons}
              lessonCount={lessons.length}
              selectedLessonIndex={
                lessons.findIndex((l) => l.lessonSlug === lessonSlug) + 1
              }
              headerCtaSlot={
                <UnitDownloadButton
                  setDownloadError={setDownloadError}
                  setDownloadInProgress={setDownloadInProgress}
                  setShowDownloadMessage={setShowDownloadMessage}
                  setShowIncompleteMessage={setShowIncompleteMessage}
                  downloadInProgress={downloadInProgress}
                  unitFileId={getUnitDownloadFileId(unitTitle, unitvariantId)}
                  onDownloadSuccess={() => unitDownloaded()}
                  showNewTag={false}
                  geoRestricted={isGeorestrictedUnit}
                  size="small"
                  ariaLabel="Download complete unit"
                  buttonLabel={
                    <OakSpan>
                      <OakSpan>Download </OakSpan>
                      <OakBox $display={["none", "none", "inline"]}>
                        complete unit
                      </OakBox>
                    </OakSpan>
                  }
                />
              }
            />
          </OakGridArea>
        </OakGrid>
      </OakBox>
    </>
  );
}
