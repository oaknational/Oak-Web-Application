import { VisuallyHidden } from "react-aria";
import {
  OakTypography,
  OakFlex,
  OakIcon,
  OakBox,
  OakCodeRenderer,
} from "@oaknational/oak-components";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import { OrderAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizQuestionsOrderAnswers = ({
  answers,
  questionNumber,
}: {
  answers: OrderAnswer[];
  questionNumber: number;
}) => {
  return (
    <OakFlex
      $flexDirection={"column"}
      $gap="spacing-4"
      $alignItems={"start"}
      role="list"
    >
      {answers.map((item, i) => {
        const orderAnswer =
          item.answer && item.answer.length > 0 ? item.answer[0] : undefined;
        return (
          orderAnswer && (
            <OakFlex
              key={`q-${questionNumber}-answer${i}`}
              $background={"lemon50"}
              $borderRadius="border-radius-m2"
              $ph="spacing-8"
              $alignItems={"flex-start"}
              $gap="spacing-8"
              role="listitem"
            >
              <VisuallyHidden>
                {item.correctOrder} -{" "}
                <OakCodeRenderer
                  string={removeMarkdown(orderAnswer.text)}
                  $font="code-3"
                  $mt={"spacing-0"}
                />
              </VisuallyHidden>
              <OakBox $minWidth="spacing-32" aria-hidden>
                <OakIcon
                  iconName={"tick"}
                  $width={"spacing-24"}
                  $height={"spacing-24"}
                />
              </OakBox>
              <OakTypography $font={["body-2-bold", "body-1-bold"]} aria-hidden>
                {item.correctOrder}
              </OakTypography>
              <OakTypography $font={["body-2", "body-1"]} aria-hidden>
                -{" "}
                <OakCodeRenderer
                  string={removeMarkdown(orderAnswer.text)}
                  $font={"code-3"}
                  $mt={"spacing-0"}
                />
              </OakTypography>
            </OakFlex>
          )
        );
      })}
    </OakFlex>
  );
};
