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
    lessonTitle,
    lessonDescription,
    lessonIsNew,
    subjectIconBackgroundColor,
  } = props;

  return (
    <Flex $flexDirection={"column"} $display={["flex", "none"]}>
      <Flex $mb={24}>
        <Box $maxHeight={80} $maxWidth={80} $mr={16}>
          <SubjectIconBrushBorders
            subjectSlug={subjectSlug}
            height={20}
            width={20}
            $ma={"auto"}
            lessonIsNew={lessonIsNew}
            color={subjectIconBackgroundColor}
          />
        </Box>
        <Flex $flexDirection={"column"}>
          {yearTitle && (
            <Span $mb={8} $color={"oakGrey4"} $font={"heading-light-7"}>
              {yearTitle}
            </Span>
          )}

          <Heading tag={"h1"} $font={"heading-5"}>
            {lessonTitle}
          </Heading>
        </Flex>
      </Flex>
      {lessonDescription && (
        <Box $mb={24}>
          <P $font={"heading-light-7"}>{lessonDescription}</P>
        </Box>
      )}
      <HeaderDownloadAllButton {...props} />
    </Flex>
  );
};
