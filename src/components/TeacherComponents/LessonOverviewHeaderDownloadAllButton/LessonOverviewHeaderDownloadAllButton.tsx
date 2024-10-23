import { FC } from "react";
import { useUser } from "@clerk/nextjs";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { LessonOverviewHeaderProps as LessonOverviewHeaderDownloadAllButtonProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import {
  LessonDownloadsCanonicalLinkProps,
  LessonDownloadsLinkProps,
  SpecialistLessonDownloadsLinkProps,
} from "@/common-lib/urls";
import Box, { BoxProps } from "@/components/SharedComponents/Box";

export const LessonOverviewHeaderDownloadAllButton: FC<
  LessonOverviewHeaderDownloadAllButtonProps & BoxProps
> = (props) => {
  const {
    subjectSlug,
    lessonTitle,
    expired,
    showDownloadAll,
    programmeSlug,
    lessonSlug,
    unitSlug,
    keyStageSlug,
    keyStageTitle,
    unitTitle,
    subjectTitle,
    track,
    analyticsUseCase,
    onClickDownloadAll,
    isSpecialist,
    isCanonical,
    ...boxProps
  } = props;

  const preselected = "all";
  const downloads =
    useFeatureFlagVariantKey("teacher-download-auth") === "with-login"
      ? "downloads-auth"
      : "downloads";

  const { user, isLoaded } = useUser();

  const displaySignInMessage =
    isLoaded &&
    downloads === "downloads-auth" &&
    !user?.publicMetadata?.owa?.isOnboarded;

  if (expired || !showDownloadAll) {
    return null;
  }

  const linkProps:
    | LessonDownloadsLinkProps
    | SpecialistLessonDownloadsLinkProps
    | LessonDownloadsCanonicalLinkProps =
    programmeSlug && unitSlug && isSpecialist
      ? {
          page: "specialist-lesson-downloads",
          lessonSlug,
          unitSlug,
          programmeSlug,
          downloads,
          query: { preselected },
        }
      : programmeSlug && unitSlug && !isSpecialist && !isCanonical
        ? {
            page: "lesson-downloads",
            lessonSlug,
            unitSlug,
            programmeSlug,
            downloads,
            query: { preselected },
          }
        : {
            page: "lesson-downloads-canonical",
            lessonSlug,
            downloads,
            query: { preselected },
          };

  return (
    <Box {...boxProps}>
      <ButtonAsLink
        {...linkProps}
        data-testid={"download-all-button"}
        variant="brush"
        iconBackground="black"
        icon="arrow-right"
        size="large"
        $iconPosition="trailing"
        label={
          displaySignInMessage
            ? `Sign in to download`
            : `Download all resources`
        }
        onClick={onClickDownloadAll}
      />
    </Box>
  );
};
