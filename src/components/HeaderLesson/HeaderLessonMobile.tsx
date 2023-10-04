import { FC } from "react";

import { HeaderLessonProps } from "./HeaderLesson";
import { HeaderDownloadAllButton } from "./HeaderDownloadAllButton";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import { Heading, P, Span } from "@/components/Typography";
import SubjectIconBrushBorders from "@/components/SubjectIconBrushBorders";
import LessonMetadata from "@/components/LessonMetadata";

export const HeaderLessonMobile: FC<HeaderLessonProps> = (props) => {
  const {
    subjectSlug,
    yearTitle,
    examBoardTitle,
    tierTitle,
    lessonTitle,
    pupilLessonOutcome,
    isNew,
    subjectIconBackgroundColor,
  } = props;

  return (
    <Flex $flexDirection={"column"} $display={["flex", "none"]} $gap={24}>
      <Flex>
        <Box $maxHeight={80} $maxWidth={80} $mr={16}>
          <SubjectIconBrushBorders
            subjectSlug={subjectSlug}
            height={20}
            width={20}
            $ma={"auto"}
            isNew={isNew}
            color={subjectIconBackgroundColor}
          />
        </Box>
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

          <Heading tag={"h1"} $font={"heading-5"}>
            {lessonTitle}
          </Heading>
        </Flex>
      </Flex>
      {pupilLessonOutcome && (
        <Box>
          <P $font={"body-3"}>{pupilLessonOutcome}</P>
        </Box>
      )}
      <HeaderDownloadAllButton {...props} />
    </Flex>
  );
};
