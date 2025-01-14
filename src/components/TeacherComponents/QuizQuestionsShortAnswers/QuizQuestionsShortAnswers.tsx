import { VisuallyHidden } from "react-aria";
import { OakTypography, OakFlex, OakBox } from "@oaknational/oak-components";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
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

        <OakBox $minWidth="all-spacing-7" aria-hidden>
          <Icon name={"tick"} />
        </OakBox>

        <OakTypography $font={["body-2", "body-1"]} aria-hidden>
          {removeMarkdown(answerString)}
        </OakTypography>
      </OakFlex>
    </OakFlex>
  );
};
