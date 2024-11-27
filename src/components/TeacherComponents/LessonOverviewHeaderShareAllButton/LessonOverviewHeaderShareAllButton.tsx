import { FC } from "react";
import { OakSmallSecondaryButton } from "@oaknational/oak-components";

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
  } = props;

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
    <OakSmallSecondaryButton
      iconName="arrow-right"
      isTrailingIcon
      disabled
      data-testid="share-all-button"
    >
      Share activities with pupils
    </OakSmallSecondaryButton>;
  }

  return (
    <OakSmallSecondaryButton
      element="a"
      href={href}
      iconName="arrow-right"
      isTrailingIcon
      onClick={onClickShareAll}
      data-testid="share-all-button"
    >
      Share activities with pupils
    </OakSmallSecondaryButton>
  );
};
