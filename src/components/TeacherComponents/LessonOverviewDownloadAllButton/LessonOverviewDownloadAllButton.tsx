import { ComponentProps, FC } from "react";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";

export type LessonOverviewDownloadAllButtonProps = Pick<
  LessonOverviewHeaderProps,
  | "expired"
  | "showDownloadAll"
  | "programmeSlug"
  | "lessonSlug"
  | "unitSlug"
  | "onClickDownloadAll"
  | "isSpecialist"
  | "isCanonical"
  | "geoRestricted"
  | "loginRequired"
> &
  Pick<ComponentProps<typeof LoginRequiredButton>, "sizeVariant" | "width">;

export const LessonOverviewDownloadAllButton: FC<
  LessonOverviewDownloadAllButtonProps
> = (props) => {
  const {
    expired,
    showDownloadAll,
    programmeSlug,
    lessonSlug,
    unitSlug,
    onClickDownloadAll,
    isSpecialist,
    geoRestricted,
    loginRequired,
    sizeVariant = "small",
    width = "spacing-160",
  } = props;

  const preselected = "all";

  if (expired || !showDownloadAll) {
    return null;
  }

  let href: string;

  if (programmeSlug && unitSlug && isSpecialist) {
    href = resolveOakHref({
      page: "specialist-lesson-downloads",
      lessonSlug,
      unitSlug,
      programmeSlug,
      downloads: "downloads",
      query: { preselected },
    });
  } else {
    href = resolveOakHref({
      page: "lesson-downloads",
      lessonSlug,
      unitSlug,
      programmeSlug,
      downloads: "downloads",
      query: { preselected },
    });
  }

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
      sizeVariant={sizeVariant}
      element="a"
      data-testid="download-all-button"
      iconName="download"
      isTrailingIcon
      aria-label="Download all"
      width={width}
    />
  );
};
