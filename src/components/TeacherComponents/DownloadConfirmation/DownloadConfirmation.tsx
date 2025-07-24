import { FC, useRef, useEffect } from "react";
import {
  OakHeading,
  OakSpan,
  OakBox,
  OakIcon,
  OakLink,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useOakConsent } from "@oaknational/oak-consent-client";

import { useTeacherShareButton } from "../TeacherShareButton/useTeacherShareButton";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import DownloadConfirmationNextLessonContainer from "@/components/TeacherComponents/DownloadConfirmationNextLessonContainer";
import { NextLesson } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { useShareExperiment } from "@/pages-helpers/teacher/share-experiments/useShareExperiment";
import { TeacherShareButton } from "@/components/TeacherComponents/TeacherShareButton/TeacherShareButton";
import { CurriculumTrackingProps } from "@/pages-helpers/teacher/share-experiments/shareExperimentTypes";
import { OnwardContentSelectedProperties } from "@/browser-lib/avo/Avo";
import { resolveOakHref } from "@/common-lib/urls";

type DownloadConfirmationProps = {
  lessonSlug: string | null;
  lessonTitle: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  isCanonical: boolean;
  unitTitle?: string | null;
  nextLessons?: NextLesson[];
  onwardContentSelected: (
    properties: Omit<
      OnwardContentSelectedProperties,
      "lessonReleaseDate" | "lessonReleaseCohort"
    >,
  ) => void;
  isSpecialist?: boolean;
  keyStageSlug: CurriculumTrackingProps["keyStageSlug"];
  keyStageTitle: CurriculumTrackingProps["keyStageTitle"];
  subjectSlug: CurriculumTrackingProps["subjectSlug"];
  subjectTitle: CurriculumTrackingProps["subjectTitle"];
  isLegacy: boolean;
  lessonReleaseDate: string;
};

const DownloadConfirmation: FC<DownloadConfirmationProps> = ({
  lessonSlug,
  lessonTitle,
  programmeSlug,
  unitSlug,
  isCanonical,
  unitTitle,
  nextLessons,
  onwardContentSelected,
  isSpecialist = false,
  keyStageSlug,
  keyStageTitle,
  subjectSlug,
  subjectTitle,
  lessonReleaseDate,
  isLegacy,
}) => {
  const displayNextLessonContainer =
    !isCanonical && unitSlug && programmeSlug && unitTitle;
  const isNextLessonsAvailable = nextLessons && nextLessons.length > 0;

  const { state } = useOakConsent();
  const cookiesNotAccepted = !!state.policyConsents.find(
    (policy) =>
      policy.consentState === "denied" || policy.consentState === "pending",
  );

  const focusRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    focusRef.current?.focus();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (lessonSlug === null) {
    throw new Error("lessonSlug is required");
  }

  // create a share URL which points at the lesson overview page
  const pathElems = window.location.href.split("/");
  const shareBaseUrl = pathElems
    .splice(0, pathElems.indexOf(lessonSlug) + 1)
    .join("/");

  const { shareUrl, shareActivated } = useShareExperiment({
    programmeSlug: isCanonical ? undefined : (programmeSlug ?? undefined),
    source: isCanonical ? "download-canonical" : "download-browse",
    shareBaseUrl,
    curriculumTrackingProps: {
      lessonName: lessonTitle,
      lessonSlug: lessonSlug,
      unitSlug: isCanonical ? null : unitSlug,
      unitName: unitTitle ?? "",
      keyStageSlug,
      keyStageTitle,
      subjectSlug,
      subjectTitle,
      lessonReleaseDate,
      lessonReleaseCohort: isLegacy ? "2020-2023" : "2023-2026",
    },
    overrideExistingShareId: true,
  });

  const { handleClick } = useTeacherShareButton({
    shareUrl,
    shareActivated,
  });

  const teacherShareButton = (
    <TeacherShareButton
      label="Share resources with colleague"
      shareUrl={shareUrl}
      handleClick={handleClick}
      variant="primary"
    />
  );

  return (
    <>
      <Flex
        $flexDirection={["column", "row"]}
        $alignItems={["flex-start", "center"]}
        $gap={[24, 24, 120]}
        $mb={[56, 0]}
      >
        <Flex
          $alignItems={"center"}
          $justifyContent={"center"}
          $height={[140, 400]}
          $width={[140, 400]}
          $position={"relative"}
        >
          <OakIcon
            iconName="tick-mark-happiness"
            $height={"100%"}
            $width={"100%"}
          />
        </Flex>

        <Flex
          $flexDirection={"column"}
          $gap={24}
          $alignItems={"flex-start"}
          $maxWidth={600}
        >
          {unitSlug && unitTitle && programmeSlug ? (
            <OakTertiaryButton
              {...focusRef}
              tabIndex={0}
              element="a"
              href={resolveOakHref({
                page: isSpecialist
                  ? "specialist-lesson-overview"
                  : "lesson-overview",
                lessonSlug: lessonSlug,
                programmeSlug: programmeSlug,
                unitSlug: unitSlug,
              })}
              iconName="chevron-left"
              data-testid="back-to-lesson-link"
              onClick={() =>
                onwardContentSelected({
                  lessonName: lessonTitle,
                  unitName: unitTitle,
                  unitSlug: unitSlug,
                  lessonSlug: lessonSlug,
                  onwardIntent: "view-lesson",
                })
              }
            >
              Back to lesson
            </OakTertiaryButton>
          ) : (
            <OakTertiaryButton
              {...focusRef}
              element="a"
              href={resolveOakHref({
                page: "lesson-overview-canonical",
                lessonSlug: lessonSlug,
              })}
              iconName="chevron-left"
              data-testid="back-to-lesson-link"
              onClick={() => {
                onwardContentSelected({
                  lessonName: lessonTitle,
                  unitName: "",
                  unitSlug: "",
                  lessonSlug: lessonSlug,
                  onwardIntent: "view-lesson",
                });
              }}
            >
              Back to lesson
            </OakTertiaryButton>
          )}

          <OakHeading tag="h1" $font={["heading-4", "heading-3"]}>
            Thanks for downloading
          </OakHeading>

          <OakBox $font={["heading-light-6", "heading-light-5"]}>
            <OakSpan>Our resources work best if you </OakSpan>
            <OakLink
              href={
                "https://support.thenational.academy/how-to-install-the-google-fonts-lexend-and-kalan"
              }
              target={"_blank"}
              aria-label={
                "install the Google Fonts 'Lexend' and 'Kalam' (opens in a new tab)"
              }
              iconName={"external"}
              isTrailingIcon={true}
              iconHeight={"all-spacing-6"}
              iconWidth={"all-spacing-6"}
            >
              install the Google Fonts ‘Lexend’ and ‘Kalam’
            </OakLink>
            <OakSpan>
              .{" "}
              {cookiesNotAccepted
                ? ""
                : "Click the question mark in the bottom-right of the page if you need extra help with this."}
            </OakSpan>
          </OakBox>
          {teacherShareButton}
        </Flex>
      </Flex>

      {displayNextLessonContainer && isNextLessonsAvailable && (
        <DownloadConfirmationNextLessonContainer
          programmeSlug={programmeSlug}
          unitSlug={unitSlug}
          unitTitle={unitTitle}
          nextLessons={nextLessons}
          onwardContentSelected={onwardContentSelected}
        />
      )}
    </>
  );
};

export default DownloadConfirmation;
