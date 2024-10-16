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
    unitTitle,
    subjectTitle,
    track,
    analyticsUseCase,
    isShareable,
    onClickShareAll,
    isSpecialist,
    isCanonical,
    ...boxProps
  } = props;

  const preselected = "all";

  const linkProps:
    | LessonShareLinkProps
    | LessonShareCanonicalLinkProps
    | SpecialistLessonShareLinkProps = isCanonical
    ? ({
        page: "lesson-share-canonical",
        lessonSlug,
        query: { preselected },
      } as LessonShareCanonicalLinkProps)
    : isSpecialist
      ? ({
          page: "specialist-lesson-share",
          lessonSlug,
          unitSlug,
          programmeSlug,
          query: { preselected },
        } as SpecialistLessonShareLinkProps)
      : ({
          page: "lesson-share",
          lessonSlug,
          unitSlug,
          programmeSlug,
          query: { preselected },
        } as LessonShareLinkProps);

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
