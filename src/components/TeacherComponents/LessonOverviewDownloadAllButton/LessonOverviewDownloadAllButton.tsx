import { ComponentProps, FC } from "react";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type LessonOverviewDownloadAllButtonProps = Pick<
  LessonOverviewHeaderProps,
  | "expired"
  | "showDownloadAll"
  | "programmeSlug"
  | "lessonSlug"
  | "unitSlug"
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
    geoRestricted,
    loginRequired,
    sizeVariant = "small",
    width = "spacing-160",
  } = props;
  const { lessonResourceDownloadStarted } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );
  const preselected = "all";

  if (expired || !showDownloadAll || !programmeSlug || !unitSlug) {
    return null;
  }

  const href = resolveOakHref({
    page: "lesson-downloads",
    lessonSlug,
    unitSlug,
    programmeSlug,
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
        onClick: () =>
          lessonResourceDownloadStarted({ downloadResourceButtonName: "all" }),
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
