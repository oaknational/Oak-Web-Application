import { FC } from "react";

import { LessonOverviewHeaderProps as LessonOverviewHeaderDownloadAllButtonProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";

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
    geoRestricted,
    loginRequired,
  } = props;

  const preselected = "all";

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
          downloads: "downloads",
          query: { preselected },
        })
      : programmeSlug && unitSlug && !isSpecialist && !isCanonical
        ? resolveOakHref({
            page: "lesson-downloads",
            lessonSlug,
            unitSlug,
            programmeSlug,
            downloads: "downloads",
            query: { preselected },
          })
        : resolveOakHref({
            page: "lesson-downloads-canonical",
            lessonSlug,
            downloads: "downloads",
            query: { preselected },
          });

  return (
    <LoginRequiredButton
      rel="nofollow"
      loginRequired={loginRequired ?? false}
      geoRestricted={geoRestricted ?? false}
      onboardingProps={{ name: "Download all" }}
      signUpProps={{ name: "Download all" }}
      actionProps={{
        name: "Download all",
        onClick: onClickDownloadAll,
        isActionGeorestricted: true,
        shouldHidewhenGeoRestricted: true,
        href: href,
      }}
      sizeVariant="small"
      element="a"
      data-testid="download-all-button"
      iconName="download"
      isTrailingIcon
      aria-label="Download all"
    />
  );
};
