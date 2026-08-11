import { OakTertiaryButton } from "@oaknational/oak-components";
import React, { FC } from "react";

import { resolveOakHref } from "@/common-lib/urls";

type LessonPlayAllButtonProps = {
  lessonSlug: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  isCanonical?: boolean;
  onTrackingCallback?: () => void;
};

const LessonPlayAllButton: FC<LessonPlayAllButtonProps> = ({
  unitSlug,
  lessonSlug,
  programmeSlug,
  isCanonical,
  onTrackingCallback,
}) => {
  return (
    <OakTertiaryButton
      element="a"
      rel="nofollow"
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
      onClick={() => {
        if (onTrackingCallback) {
          onTrackingCallback();
        }
      }}
    >
      Play all
    </OakTertiaryButton>
  );
};

export default LessonPlayAllButton;
