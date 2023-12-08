import { FC } from "react";

import Flex from "../Flex";
import { Span } from "../Typography";

import { HeaderLessonProps } from "./HeaderLesson";

import ButtonAsLink from "@/components/Button/ButtonAsLink";
import {
  LessonShareCanonicalLinkProps,
  LessonShareLinkProps,
} from "@/common-lib/urls";

export const HeaderShareAllButton: FC<HeaderLessonProps> = (props) => {
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
    isLegacyLesson,
    onClickShareAll,
    ...boxProps
  } = props;

  const preselected = "all";

  const linkProps: LessonShareLinkProps | LessonShareCanonicalLinkProps =
    programmeSlug && unitSlug
      ? {
          page: "lesson-share",
          lessonSlug,
          unitSlug,
          programmeSlug,
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
        iconBackground={isLegacyLesson ? "black" : "grey60"}
        icon="arrow-right"
        size="large"
        $iconPosition="trailing"
        label={`Share activities with pupils`}
        disabled={!isLegacyLesson}
        onClick={onClickShareAll}
      />
      <Flex $mt={[12, 0]}>
        {!isLegacyLesson && (
          <Span $color={"grey50"} $font={"body-3"}>
            Share function coming soon...
          </Span>
        )}
      </Flex>
    </Flex>
  );
};
