import { FC } from "react";
import {
  OakHeading,
  OakP,
  OakSpan,
  OakFlex,
  OakBox,
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
    isNew,
    subjectIconBackgroundColor,
    isSpecialist,
    isEYFS,
  } = props;

  return (
    <Flex $flexDirection={"column"} $display={["flex", "none"]} $gap={24}>
      <OakFlex>
        <OakBox $mr="space-between-s" $height="all-spacing-13">
          <SubjectIconBrushBorders
            subjectSlug={subjectSlug}
            isNew={isNew}
            color={subjectIconBackgroundColor}
          />
        </OakBox>
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
      {!isSpecialist && !isEYFS && (
        <LessonOverviewHeaderShareAllButton {...props} />
      )}
    </Flex>
  );
};
