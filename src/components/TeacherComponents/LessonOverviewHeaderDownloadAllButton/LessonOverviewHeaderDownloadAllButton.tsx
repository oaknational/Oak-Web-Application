import { FC } from "react";
import { useUser } from "@clerk/nextjs";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { OakFlex, OakSmallPrimaryButton } from "@oaknational/oak-components";

import { LessonOverviewHeaderProps as LessonOverviewHeaderDownloadAllButtonProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";

export const LessonOverviewHeaderDownloadAllButton: FC<
  LessonOverviewHeaderDownloadAllButtonProps
> = (props) => {
  const {
    expired,
    showDownloadAll,
    programmeSlug,
    lessonSlug,
    unitSlug,
    onClickDownloadAll,
    isSpecialist,
    isCanonical,
  } = props;

  const preselected = "all";
  const downloads =
    useFeatureFlagVariantKey("teacher-download-auth") === "with-login"
      ? "downloads-auth"
      : "downloads";

  const { isSignedIn } = useUser();

  const displaySignInMessage = downloads === "downloads-auth" && !isSignedIn;

  if (expired || !showDownloadAll) {
    return null;
  }

  const href =
    programmeSlug && unitSlug && isSpecialist
      ? resolveOakHref({
          page: "specialist-lesson-downloads",
          lessonSlug,
          unitSlug,
          programmeSlug,
          downloads,
          query: { preselected },
        })
      : programmeSlug && unitSlug && !isSpecialist && !isCanonical
        ? resolveOakHref({
            page: "lesson-downloads",
            lessonSlug,
            unitSlug,
            programmeSlug,
            downloads,
            query: { preselected },
          })
        : resolveOakHref({
            page: "lesson-downloads-canonical",
            lessonSlug,
            downloads,
            query: { preselected },
          });

  return (
    <OakSmallPrimaryButton
      element="a"
      data-testid="download-all-button"
      href={href}
      iconName="arrow-right"
      isTrailingIcon
      aria-label={
        displaySignInMessage ? `Sign in to download` : `Download all resources`
      }
      onClick={onClickDownloadAll}
    >
      Download all resources
    </OakSmallPrimaryButton>
  );
};
