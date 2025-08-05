import { FC } from "react";
import { OakSmallSecondaryButton } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";
import { invariant } from "@/utils/invariant";

export const LessonOverviewHeaderShareAllButton: FC<
  LessonOverviewHeaderProps
> = (props) => {
  const {
    lessonSlug,
    unitSlug,
    programmeSlug,
    isShareable,
    onClickShareAll,
    isSpecialist,
    isCanonical,
    geoRestricted,
    loginRequired,
  } = props;
  const featureFlagEnabled = useFeatureFlagEnabled(
    "teachers-copyright-restrictions",
  );
  if (featureFlagEnabled && (geoRestricted || loginRequired)) return null;

  const preselected = "all";

  const href = (() => {
    if (isCanonical) {
      return resolveOakHref({
        page: "lesson-share-canonical",
        lessonSlug,
        query: { preselected },
      });
    }

    invariant(typeof unitSlug === "string", "unitSlug is required");
    invariant(typeof programmeSlug === "string", "programmeSlug is required");

    if (isSpecialist) {
      return resolveOakHref({
        page: "specialist-lesson-share",
        lessonSlug,
        unitSlug,
        programmeSlug,
        query: { preselected },
      });
    }

    return resolveOakHref({
      page: "lesson-share",
      lessonSlug,
      unitSlug,
      programmeSlug,
      query: { preselected },
    });
  })();

  if (!isShareable || !href) {
    return (
      <OakSmallSecondaryButton
        iconName="arrow-right"
        isTrailingIcon
        disabled={true}
        data-testid="share-all-button"
      >
        Share activities with pupils
      </OakSmallSecondaryButton>
    );
  }

  return (
    <OakSmallSecondaryButton
      element="a"
      href={href}
      onClick={onClickShareAll}
      data-testid="share-all-button"
      iconName="arrow-right"
      isTrailingIcon
      aria-label="Share all resources"
    >
      Share all activities with pupils
    </OakSmallSecondaryButton>
  );
};
