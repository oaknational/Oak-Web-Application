import { FC } from "react";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import {
  LessonShareCanonicalLinkProps,
  LessonShareLinkProps,
  SpecialistLessonShareLinkProps,
} from "@/common-lib/urls";

export const LessonOverviewHeaderShareAllButton: FC<
  LessonOverviewHeaderProps
> = (props) => {
  const {
    subjectSlug,
    lessonTitle,
    expired,
    programmeSlug,
    lessonSlug,
    unitSlug,
    keyStageSlug,
    keyStageTitle,
    unitTitle,
    subjectTitle,
    track,
    analyticsUseCase,
    isShareable,
    onClickShareAll,
    isSpecialist,
    pathways,
    ...boxProps
  } = props;
  const preselected = "all";

  // Find the first non-null programmeSlug in pathways
  const firstProgrammeSlug = pathways.find((pathway) => pathway.programmeSlug)
    ?.programmeSlug;

  const effectiveProgrammeSlug = programmeSlug || firstProgrammeSlug;

  const linkProps:
    | LessonShareLinkProps
    | LessonShareCanonicalLinkProps
    | SpecialistLessonShareLinkProps =
    programmeSlug && unitSlug && isSpecialist
      ? {
          page: "specialist-lesson-share",
          lessonSlug,
          unitSlug,
          programmeSlug,
          query: { preselected },
        }
      : effectiveProgrammeSlug && unitSlug && !isSpecialist
        ? {
            page: "lesson-share",
            lessonSlug,
            unitSlug,
            programmeSlug: effectiveProgrammeSlug,
            query: { preselected },
          }
        : {
            page: "lesson-share-canonical",
            lessonSlug,
            query: { preselected },
          };

  return (
    <Flex
      $display={["block", "flex"]}
      $gap={12}
      $flexDirection={"column"}
      {...boxProps}
    >
      <ButtonAsLink
        {...linkProps}
        data-testid={"share-all-button"}
        variant="brush"
        iconBackground={isShareable ? "black" : "grey60"}
        icon="arrow-right"
        size="large"
        $iconPosition="trailing"
        label={`Share activities with pupils`}
        disabled={!isShareable}
        onClick={onClickShareAll}
      />
    </Flex>
  );
};
