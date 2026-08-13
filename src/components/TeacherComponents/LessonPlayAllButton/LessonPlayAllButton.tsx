import { OakTertiaryButton } from "@oaknational/oak-components";
import React, { FC } from "react";

import { resolveOakHref } from "@/common-lib/urls";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

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
  const { lessonMediaClipsStarted } = useTeacherBrowseAnalytics(
    (store) => store.track,
  );

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
      onClick={() =>
        lessonMediaClipsStarted({
          mediaClipsButtonName: "play all",
          learningCycle: null,
        })
      }
    >
      Play all
    </OakTertiaryButton>
  );
};

export default LessonPlayAllButton;
