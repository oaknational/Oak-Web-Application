import { FC } from "react";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { Span } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import {
  LessonShareCanonicalLinkProps,
  LessonShareLinkProps,
} from "@/common-lib/urls";

export const LessonOverviewHeaderShareAllButton: FC<
  LessonOverviewHeaderProps
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
    isShareable,
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
        iconBackground={isShareable ? "black" : "grey60"}
        icon="arrow-right"
        size="large"
        $iconPosition="trailing"
        label={`Share activities with pupils`}
        disabled={!isShareable}
        onClick={onClickShareAll}
      />
      <Flex $mt={[12, 0]}>
        {!isShareable && (
          <Span $color={"grey50"} $font={"body-3"}>
            Share function coming soon...
          </Span>
        )}
      </Flex>
    </Flex>
  );
};
