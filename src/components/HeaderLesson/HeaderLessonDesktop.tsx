import { FC } from "react";

import { HeaderLessonProps } from "./HeaderLesson";
import { HeaderDownloadAllButton } from "./HeaderDownloadAllButton";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import SubjectIconBrushBorders from "@/components/SubjectIconBrushBorders";
import { Heading, P, Span } from "@/components/Typography";
import Grid, { GridArea } from "@/components/Grid";
import LessonMetadata from "@/components/LessonMetadata";

export const HeaderLessonDesktop: FC<HeaderLessonProps> = (props) => {
  const {
    subjectSlug,
    yearTitle,
    tierTitle,
    examBoardTitle,
    lessonTitle,
    isNew,
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
              isNew={isNew}
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
              <Span $color={"oakGrey4"} $font={"heading-light-7"}>
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
              <HeaderDownloadAllButton {...props} />
            </Flex>
          </Flex>
        </GridArea>
      </Grid>
    </Box>
  );
};
