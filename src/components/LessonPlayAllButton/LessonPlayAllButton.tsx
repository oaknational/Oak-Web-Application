import { OakTertiaryButton } from "@oaknational/oak-components";
import React, { FC } from "react";

import { resolveOakHref } from "@/common-lib/urls";

type LessonPlayAllButtonProps = {
  lessonSlug: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  isCanonical?: boolean;
};

const LessonPlayAllButton: FC<LessonPlayAllButtonProps> = ({
  unitSlug,
  lessonSlug,
  programmeSlug,
  isCanonical,
}) => {
  return (
    <OakTertiaryButton
      element="a"
      href={
        !isCanonical && programmeSlug && unitSlug
          ? resolveOakHref({
              page: "lesson-media",
              lessonSlug: lessonSlug,
              programmeSlug: programmeSlug,
              unitSlug: unitSlug,
            })
          : resolveOakHref({
              page: "lesson-media-canonical",
              lessonSlug: lessonSlug,
            })
      }
      isTrailingIcon
      iconName="arrow-right"
    >
      Play all
    </OakTertiaryButton>
  );
};

export default LessonPlayAllButton;
