import { FC } from "react";

import { HeaderLessonProps } from "./HeaderLesson";

import ButtonAsLink from "@/components/Button/ButtonAsLink";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import {
  LessonDownloadsCanonicalLinkProps,
  LessonDownloadsLinkProps,
} from "@/common-lib/urls";
import Box from "@/components/Box";

export const HeaderDownloadAllButton: FC<HeaderLessonProps> = (props) => {
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
    <Box>
      <ButtonAsLink
        {...linkProps}
        data-testid={"download-all-button"}
        variant="brush"
        iconBackground="black"
        icon="download"
        size="large"
        $iconPosition="trailing"
        label={`Download all resources`}
        onClick={() => {
          track.downloadResourceButtonClicked({
            keyStageTitle: keyStageTitle as KeyStageTitleValueType,
            keyStageSlug,
            subjectTitle,
            subjectSlug,
            unitName: unitTitle,
            unitSlug,
            lessonName: lessonTitle,
            lessonSlug,
            downloadResourceButtonName: "all",
            analyticsUseCase,
          });
        }}
      />
    </Box>
  );
};
