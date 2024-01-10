import { FC } from "react";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import {
  LessonDownloadsCanonicalLinkProps,
  LessonDownloadsLinkProps,
} from "@/common-lib/urls";
import Box, { BoxProps } from "@/components/SharedComponents/Box";

export const HeaderDownloadAllButton: FC<
  LessonOverviewHeaderProps & BoxProps
> = (props) => {
  const {
    subjectSlug,
    lessonTitle,
    expired,
    hasDownloadableResources,
    programmeSlug,
    lessonSlug,
    unitSlug,
    keyStageSlug,
    keyStageTitle,
    unitTitle,
    subjectTitle,
    track,
    analyticsUseCase,
    onClickDownloadAll,
    ...boxProps
  } = props;

  const preselected = "all";

  if (expired || !hasDownloadableResources) {
    return null;
  }

  const linkProps:
    | LessonDownloadsLinkProps
    | LessonDownloadsCanonicalLinkProps =
    programmeSlug && unitSlug
      ? {
          page: "lesson-downloads",
          lessonSlug,
          unitSlug,
          programmeSlug,
          query: { preselected },
        }
      : {
          page: "lesson-downloads-canonical",
          lessonSlug,
          query: { preselected },
        };

  return (
    <Box {...boxProps}>
      <ButtonAsLink
        {...linkProps}
        data-testid={"download-all-button"}
        variant="brush"
        iconBackground="black"
        icon="arrow-right"
        size="large"
        $iconPosition="trailing"
        label={`Download all resources`}
        onClick={onClickDownloadAll}
      />
    </Box>
  );
};
