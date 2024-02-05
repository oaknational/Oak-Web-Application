import { VisuallyHidden } from "react-aria";
import { OakTypography } from "@oaknational/oak-components";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import Icon from "@/components/SharedComponents/Icon";
import { ShortAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizQuestionsShortAnswers = ({
  answers,
}: {
  answers: ShortAnswer[];
}) => {
  const answerString = answers.reduce((acc, cur) => {
    if (acc === "") {
      return (cur.answer && cur.answer[0] && cur.answer[0].text) || acc;
    }

    return cur.answer && cur.answer[0] && cur.answer[0].text
      ? `${acc}, ${cur.answer[0].text}`
      : acc;
  }, "");

  return (
    <Flex $flexDirection={"column"} $gap={4} $alignItems={"start"}>
      <Flex
        $background={"lemon50"}
        $borderRadius={8}
        $ph={8}
        $alignItems={"center"}
        $gap={8}
      >
        <VisuallyHidden>
          Correct Answer: {removeMarkdown(answerString)}
        </VisuallyHidden>

        <Box $minWidth={32} aria-hidden>
          <Icon name={"tick"} />
        </Box>

        <OakTypography $font={["body-2", "body-1"]} aria-hidden>
          {removeMarkdown(answerString)}
        </OakTypography>
      </Flex>
    </Flex>
  );
};
