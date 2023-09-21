import { FC } from "react";

import Flex from "../Flex";
import ButtonAsLink from "../Button/ButtonAsLink";

import { HeaderLessonProps } from "./HeaderLesson";

import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

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

  return (
    <Flex>
      {!expired && hasDownloadableResources && (
        <ButtonAsLink
          $ml={4}
          icon={"download"}
          iconBackground="black"
          label="Download all resources"
          page={"lesson-downloads"}
          size={"large"}
          variant="brush"
          $iconPosition={"trailing"}
          data-testid={"download-all-button"}
          query={{
            preselected: "all",
          }}
          programmeSlug={programmeSlug}
          lessonSlug={lessonSlug}
          unitSlug={unitSlug}
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
      )}
    </Flex>
  );
};
