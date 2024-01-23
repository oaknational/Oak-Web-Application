import { FC } from "react";

import { LessonOverviewHeaderProps } from "@/components/TeacherComponents/LessonOverviewHeader";
import { LessonOverviewHeaderDownloadAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderDownloadAllButton";
import { LessonOverviewHeaderShareAllButton } from "@/components/TeacherComponents/LessonOverviewHeaderShareAllButton";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import SubjectIconBrushBorders from "@/components/TeacherComponents/SubjectIconBrushBorders";
import { Heading, P, Span } from "@/components/SharedComponents/Typography";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
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
      <Grid>
        <GridArea $justifyContent={"center"} $colSpan={[12, 3]}>
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
        </GridArea>
        <GridArea
          $justifyContent={"center"}
          $colSpan={[12, 9]}
          $alignItems={"flex-start"}
        >
          <Flex $flexDirection={"column"} $gap={8}>
            {(examBoardTitle || yearTitle || tierTitle) && (
              <Span $color={"grey60"} $font={"heading-light-7"}>
                <LessonMetadata
                  examBoardTitle={examBoardTitle}
                  yearTitle={yearTitle}
                  tierTitle={tierTitle}
                />
              </Span>
            )}

            <Flex $flexDirection={"column"} $gap={24}>
              <Heading tag={"h1"} $font={"heading-3"}>
                {lessonTitle}
              </Heading>
              {pupilLessonOutcome && (
                <Box $maxWidth={740}>
                  <P $font={"body-2"}>{pupilLessonOutcome}</P>
                </Box>
              )}
              <Flex $gap={24}>
                <LessonOverviewHeaderDownloadAllButton {...props} />
                <LessonOverviewHeaderShareAllButton {...props} />
              </Flex>
            </Flex>
          </Flex>
        </GridArea>
      </Grid>
    </Box>
  );
};
