import { FC } from "react";
import {
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
} from "@oaknational/oak-components";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { LessonOverviewHeaderDownloadAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderDownloadAllButton";
import { LessonOverviewHeaderShareAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderShareAllButton";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import LessonMetadata from "@/components/SharedComponents/LessonMetadata";

export const LessonOverviewHeaderMobile: FC<LessonOverviewHeaderProps> = (
  props,
) => {
  const {
    subjectSlug,
    yearTitle,
    examBoardTitle,
    tierTitle,
    lessonTitle,
    pupilLessonOutcome,
    isLegacyLesson,
    subjectIconBackgroundColor,
  } = props;

  return (
    <Flex $flexDirection={"column"} $display={["flex", "none"]} $gap={24}>
      <OakFlex>
        <Box $maxHeight={80} $maxWidth={80} $mr={16}>
          <SubjectIconBrushBorders
            subjectSlug={subjectSlug}
            height={20}
            width={20}
            $ma={"auto"}
            isLegacyLesson={isLegacyLesson}
            color={subjectIconBackgroundColor}
          />
        </Box>
        <OakFlex $flexDirection={"column"} $gap="all-spacing-2">
          {(examBoardTitle || yearTitle || tierTitle) && (
            <OakSpan $color={"grey60"} $font={"heading-light-7"}>
              <LessonMetadata
                examBoardTitle={examBoardTitle}
                yearTitle={yearTitle}
                tierTitle={tierTitle}
              />
            </OakSpan>
          )}

          <OakHeading tag={"h1"} $font={"heading-5"}>
            {lessonTitle}
          </OakHeading>
        </OakFlex>
      </OakFlex>
      {pupilLessonOutcome && (
        <Box>
          <OakP $font={"body-3"}>{pupilLessonOutcome}</OakP>
        </Box>
      )}
      <LessonOverviewHeaderDownloadAllButton {...props} />
      <LessonOverviewHeaderShareAllButton {...props} />
    </Flex>
  );
};
