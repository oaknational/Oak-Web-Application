import { FC } from "react";
import {
  OakSmallPrimaryInvertedButton,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { resolveOakHref } from "@/common-lib/urls";
import { invariant } from "@/utils/invariant";

export type LessonOverviewHeaderShareAllButtonProps = Omit<
  LessonOverviewHeaderProps,
  "isCanonical"
> & {
  variant?: "primary" | "dropdown";
};

export const LessonOverviewHeaderShareAllButton: FC<
  LessonOverviewHeaderShareAllButtonProps
> = (props) => {
  const {
    lessonSlug,
    unitSlug,
    programmeSlug,
    isShareable,
    onClickShareAll,
    isSpecialist,
    geoRestricted,
    loginRequired,
    variant = "primary",
  } = props;

  if (geoRestricted || loginRequired) return null;

  const OakButton =
    variant === "dropdown"
      ? OakSmallPrimaryInvertedButton
      : OakSmallSecondaryButton;

  const preselected = "all";

  const href = (() => {
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
      <OakButton
        iconName="arrow-right"
        isTrailingIcon
        disabled={true}
        data-testid="share-all-button"
      >
        Share activities with pupils
      </OakButton>
    );
  }

  return (
    <OakButton
      rel="nofollow"
      element="a"
      href={href}
      onClick={onClickShareAll}
      data-testid="share-all-button"
      iconName="arrow-right"
      isTrailingIcon
      aria-label="Share all resources"
    >
      Share activities with pupils
    </OakButton>
  );
};
