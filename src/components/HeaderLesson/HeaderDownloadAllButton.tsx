import { FC } from "react";

import ButtonAsLink, { ButtonAsLinkProps } from "../Button/ButtonAsLink";

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

  const buttonProps: Pick<
    ButtonAsLinkProps,
    | "variant"
    | "iconBackground"
    | "icon"
    | "$iconPosition"
    | "label"
    | "onClick"
    | "size"
    | "$ml"
  > = {
    variant: "brush",
    iconBackground: "black",
    icon: "download",
    size: "large",
    $iconPosition: "trailing",
    $ml: 4,
    onClick: () => {
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
    },
    label: `Download all resources`,
  };

  const preselected = "all";

  if (expired || !hasDownloadableResources) {
    return null;
  }

  if (programmeSlug && unitSlug) {
    // Return link to lesson download page within its learning pathway
    return (
      <ButtonAsLink
        {...buttonProps}
        data-testid={"download-all-button"}
        page="lesson-downloads"
        lessonSlug={lessonSlug}
        unitSlug={unitSlug}
        programmeSlug={programmeSlug}
        query={{ preselected }}
      />
    );
  }

  // Return link to canonical lesson download page
  return (
    <ButtonAsLink
      {...buttonProps}
      data-testid={"download-all-button"}
      page="lesson-downloads-canonical"
      unitSlug={null}
      programmeSlug={null}
      lessonSlug={lessonSlug}
      query={{ preselected }}
    />
  );
};
