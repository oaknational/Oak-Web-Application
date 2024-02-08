import { FC } from "react";
import {
  OakGrid,
  OakGridArea,
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

export const LessonOverviewHeaderDesktop: FC<LessonOverviewHeaderProps> = (
  props,
) => {
  const {
    subjectSlug,
    yearTitle,
    tierTitle,
    examBoardTitle,
    lessonTitle,
    isLegacyLesson,
    subjectIconBackgroundColor,
    pupilLessonOutcome,
  } = props;

  return (
    <Box $display={["none", "grid"]}>
      <OakGrid>
        <OakGridArea $justifyContent={"center"} $colSpan={[12, 3]}>
          <Flex $height={[172, 172, 200]} $width={[172, 172, 200]}>
            <SubjectIconBrushBorders
              subjectSlug={subjectSlug}
              height={96}
              width={96}
              $maxHeight={140}
              $maxWidth={140}
              $ma={"auto"}
              color={subjectIconBackgroundColor}
              isLegacyLesson={isLegacyLesson}
            />
          </Flex>
        </OakGridArea>
        <OakGridArea
          $justifyContent={"center"}
          $colSpan={[12, 9]}
          $alignItems={"flex-start"}
        >
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

            <OakFlex $flexDirection={"column"} $gap="all-spacing-6">
              <OakHeading tag={"h1"} $font={"heading-3"}>
                {lessonTitle}
              </OakHeading>
              {pupilLessonOutcome && (
                <Box $maxWidth={740}>
                  <OakP $font={"body-2"}>{pupilLessonOutcome}</OakP>
                </Box>
              )}
              <OakFlex $gap="all-spacing-6">
                <LessonOverviewHeaderDownloadAllButton {...props} />
                <LessonOverviewHeaderShareAllButton {...props} />
              </OakFlex>
            </OakFlex>
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </Box>
  );
};
