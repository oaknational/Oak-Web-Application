import { FC } from "react";

import Box from "../Box";
import Flex from "../Flex";
import { Heading, P, Span } from "../Typography";
import SubjectIconBrushBorders from "../SubjectIconBrushBorders";

import { HeaderLessonProps } from "./HeaderLesson";
import { HeaderDownloadAllButton } from "./HeaderDownloadAllButton";

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

  const otherFactors = [yearTitle, tierTitle, examBoardTitle]
    .filter((elem) => !!elem)
    .join(" • ");

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
          {otherFactors && (
            <Span
              data-testid="other-factors"
              $color={"oakGrey4"}
              $font={"heading-light-7"}
            >
              {otherFactors}
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
