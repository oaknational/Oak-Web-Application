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
import { Stem } from "@/components/SharedComponents/Stem";

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

  const answerHtml = answers.reduce((acc, cur) => {
    if (acc === "") {
      return (cur.answer && cur.answer[0] && cur.answer[0].html) || acc;
    }

    return cur.answer && cur.answer[0] && cur.answer[0].html
      ? `${acc}, ${cur.answer[0].html}`
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
          <OakIcon
            iconName={"tick"}
            $width={"all-spacing-6"}
            $height={"all-spacing-6"}
          />
        </OakBox>

        <OakTypography $font={["body-2", "body-1"]} aria-hidden>
          {/* TODO: handle OakCodeRenderer */}
          {/* <OakCodeRenderer
            string={removeMarkdown(answerString)}
            $font="code-3"
            $mt={"space-between-none"}
          /> */}
          <Stem stem={{ type: "text", text: answerString, html: answerHtml }} />
        </OakTypography>
      </OakFlex>
    </OakFlex>
  );
};
