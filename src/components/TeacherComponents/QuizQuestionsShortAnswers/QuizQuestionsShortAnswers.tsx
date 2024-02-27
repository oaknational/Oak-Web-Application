import { VisuallyHidden } from "react-aria";
import { OakTypography, OakFlex } from "@oaknational/oak-components";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import Box from "@/components/SharedComponents/Box";
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
    <OakFlex
      $flexDirection={"column"}
      $gap="all-spacing-1"
      $alignItems={"start"}
    >
      <OakFlex
        $background={"lemon50"}
        $borderRadius="border-radius-m2"
        $ph="inner-padding-xs"
        $alignItems={"center"}
        $gap="all-spacing-2"
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
      </OakFlex>
    </OakFlex>
  );
};
