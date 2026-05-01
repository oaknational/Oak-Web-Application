"use client";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakIcon,
  OakLink,
  OakP,
  OakSpan,
  OakTertiaryInvertedButton,
} from "@oaknational/oak-components";
import { useOakConsent } from "@oaknational/oak-consent-client";

import { Header } from "@/components/TeacherComponents/Header/Header";
import {
  LessonList,
  type LessonListProps,
} from "@/app/(core)/programmes/[subjectPhaseSlug]/units/[unitSlug]/lessons/Components/LessonList";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import type { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

export type DownloadConfirmationProps = {
  lesson: LessonDownloadsPageData;
};

function lessonDownloadsToLessonListProps(
  lesson: LessonDownloadsPageData,
  unitLessons: NonNullable<LessonDownloadsPageData["lessons"]>,
): LessonListProps {
  return {
    programmeSlug: lesson.programmeSlug,
    unitSlug: lesson.unitSlug,
    unitTitle: lesson.unitTitle ?? "",
    unitDescription: lesson.unitDescription ?? null,
    subjectTitle: lesson.subjectTitle,
    subjectSlug: lesson.subjectSlug,
    keyStageSlug: lesson.keyStageSlug,
    keyStageTitle: lesson.keyStageTitle,
    lessons: unitLessons,
    lessonCount: unitLessons.length,
  };
}

export function DownloadConfirmation({ lesson }: DownloadConfirmationProps) {
  const {
    lessonTitle,
    lessonSlug,
    programmeSlug,
    unitSlug,
    unitTitle,
    lessonReleaseDate,
    lessons,
  } = lesson;

  const { track } = useAnalytics();
  const { onwardContentSelected } = track;

  const { getConsent } = useOakConsent();
  const cookiesNotAccepted = getConsent(ServicePolicyMap.GLEAP) === "denied";

  const listReady = lessons !== undefined && programmeSlug && unitSlug;

  return (
    <>
      <Header
        layoutVariant="large"
        heroImage={getCloudinaryImageUrl(
          "v1777386544/svg-illustrations/download-confirmation-Illustration_z1sczk.svg",
        )}
        heading="Thanks for downloading!"
        backgroundColorLevel={1}
        useSubduedBackground
        headerSlot={
          unitSlug && unitTitle && programmeSlug ? (
            <OakTertiaryInvertedButton
              tabIndex={0}
              element="a"
              href={resolveOakHref({
                page: "integrated-lesson-overview",
                lessonSlug,
                programmeSlug,
                unitSlug,
              })}
              iconName="chevron-left"
              data-testid="back-to-lesson-link"
              onClick={() =>
                onwardContentSelected({
                  lessonName: lessonTitle,
                  unitName: unitTitle ?? "",
                  unitSlug: unitSlug ?? "",
                  lessonSlug,
                  onwardIntent: "view-lesson",
                  lessonReleaseCohort: "2023-2026",
                  lessonReleaseDate: lessonReleaseDate ?? "unreleased",
                })
              }
            >
              Back to lesson
            </OakTertiaryInvertedButton>
          ) : null
        }
        summary={
          <>
            <OakP $textWrap="pretty" $mb="spacing-24" $font="body-2">
              We hope you find the resources useful. Click the question mark in
              the bottom-right corner to share your feedback.
            </OakP>
            <OakFlex $gap="spacing-8" $alignItems="center">
              <OakIcon
                iconName="info"
                iconWidth="spacing-20"
                iconHeight="spacing-20"
              />
              <OakBox $textWrap="pretty" $font="body-3">
                Our resources work best if you{" "}
                <OakLink
                  href={resolveOakHref({ page: "help-font" })}
                  target="_blank"
                  aria-label={
                    "install the Google Fonts 'Lexend' and 'Kalam' (opens in a new tab)"
                  }
                  iconHeight="spacing-24"
                  iconWidth="spacing-24"
                >
                  install the Google Fonts &lsquo;Lexend&rsquo; and
                  &lsquo;Kalam&rsquo;
                </OakLink>
                .
                {cookiesNotAccepted
                  ? ""
                  : " Click the question mark in the bottom-right of the page if you need extra help with this."}
              </OakBox>
            </OakFlex>
          </>
        }
      />
      <OakBox $ph={["spacing-20", "spacing-40"]}>
        <OakGrid
          $pt="spacing-72"
          $pb="spacing-80"
          $mh="auto"
          $maxWidth="spacing-1280"
          $cg="spacing-12"
        >
          {listReady ? (
            <OakGridArea
              $colSpan={[12, 8]}
              $colStart={[1, 2]}
              $gap="spacing-48"
            >
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
                {...lessonDownloadsToLessonListProps(lesson, lessons)}
              />
            </OakGridArea>
          ) : null}
        </OakGrid>
      </OakBox>
    </>
  );
}
