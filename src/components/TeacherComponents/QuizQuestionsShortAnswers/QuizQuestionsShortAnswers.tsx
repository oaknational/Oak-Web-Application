import { VisuallyHidden } from "react-aria";
import {
  OakTypography,
  OakFlex,
  OakIcon,
  OakBox,
  OakCodeRenderer,
} from "@oaknational/oak-components";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
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
    <OakFlex $flexDirection={"column"} $gap="spacing-4" $alignItems={"start"}>
      <OakFlex
        $background={"lemon50"}
        $borderRadius="border-radius-m2"
        $ph="spacing-8"
        $alignItems={"center"}
        $gap="spacing-8"
      >
        <VisuallyHidden>
          Correct Answer: {removeMarkdown(answerString)}
        </VisuallyHidden>

        <OakBox $minWidth="spacing-32" aria-hidden>
          <OakIcon
            iconName={"tick"}
            $width={"spacing-24"}
            $height={"spacing-24"}
          />
        </OakBox>

        <OakTypography $font={["body-2", "body-1"]} aria-hidden>
          <OakCodeRenderer
            string={removeMarkdown(answerString)}
            $font="code-3"
            $mt={"spacing-0"}
          />
        </OakTypography>
      </OakFlex>
    </OakFlex>
  );
};
