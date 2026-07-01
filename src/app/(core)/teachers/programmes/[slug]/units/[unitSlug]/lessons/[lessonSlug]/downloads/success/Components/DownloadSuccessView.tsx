"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakIcon,
  OakSpan,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { LessonList } from "@/app/(core)/teachers/programmes/[slug]/units/[unitSlug]/lessons/Components/LessonList";
import { DownloadSuccessHeader } from "@/app/(core)/teachers/programmes/[slug]/units/[unitSlug]/lessons/[lessonSlug]/Components/DownloadSuccessHeader/DownloadSuccessHeader";
import UnitDownloadButton, {
  useUnitDownloadButtonState,
} from "@/components/TeacherComponents/UnitDownloadButton/UnitDownloadButton";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import type { LessonListSchema } from "@/node-lib/curriculum-api-2023/shared.schema";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import { getUnitDownloadFileId } from "@/utils/getUnitDownloadFileId";

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
  keyStageSlug: string;
  keyStageTitle: string;
  subjectSlug: string;
  subjectTitle: string;
};

export type DownloadSuccessViewProps = {
  lesson: DownloadSuccessViewLesson;
  ctaVariant: "control" | "test";
};

// Oak-components is a little out of sync with Figma
// with letter-spacing on headings. Applying a temporary
// fix here until we update the tokens to match.
const TightenedOakSpan = styled(OakSpan)`
  letter-spacing: -0.64px;
`;

export function DownloadSuccessView({
  lesson,
  ctaVariant,
}: Readonly<DownloadSuccessViewProps>) {
  const {
    lessonTitle,
    lessonSlug,
    programmeSlug,
    unitSlug,
    unitTitle,
    lessonReleaseDate,
    lessons,
    unitvariantId,
    keyStageSlug,
    keyStageTitle,
    subjectSlug,
    subjectTitle,
  } = lesson;

  const { track } = useAnalytics();
  const { onwardContentSelected, unitDownloadInitiated } = track;

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
            lessonName: lessonTitle,
            unitName: unitTitle,
            unitSlug,
            lessonSlug,
            onwardIntent: "view-lesson",
            lessonReleaseCohort: "2023-2026",
            lessonReleaseDate: lessonReleaseDate,
          })
        }
        backgroundColorLevel={1}
        returnTo="lesson"
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
            {ctaVariant === "test" ? (
              <OakFlex $mh="auto" $alignItems="center" $gap="spacing-12">
                <OakIcon
                  iconName="arrow-down"
                  $colorFilter="text-success"
                  $width="spacing-48"
                  $height="spacing-48"
                />
                <TightenedOakSpan $font="heading-4">
                  Everything you need to plan a unit in one click
                </TightenedOakSpan>
                <OakIcon
                  iconName="arrow-down"
                  $colorFilter="text-success"
                  $width="spacing-48"
                  $height="spacing-48"
                />
              </OakFlex>
            ) : (
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
            )}
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
                  onDownloadSuccess={() => {
                    unitDownloadInitiated({
                      platform: "owa",
                      product: "teacher lesson resources",
                      engagementIntent: "use",
                      componentType: "unit_download_button",
                      eventVersion: "2.0.0",
                      analyticsUseCase: "Teacher",
                      unitName: unitTitle,
                      unitSlug,
                      keyStageSlug,
                      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
                      subjectSlug,
                      subjectTitle,
                    });
                  }}
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
