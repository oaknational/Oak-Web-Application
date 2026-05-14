import { Fragment } from "react";
import { OakCodeRenderer, OakSpan } from "@oaknational/oak-components";
import { isString } from "lodash";

import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

type Props = {
  questionState?: QuestionState;
};

export const QuizCorrectAnswers = ({ questionState }: Props) => {
  const correctAnswer = questionState?.correctAnswer;

  // Nothing should be rendered when the question has no text answer to show.
  if (!correctAnswer) return null;

  if (Array.isArray(correctAnswer)) {
    // Image answers are already rendered elsewhere, so do not duplicate them here.
    const hasImageAnswer = correctAnswer.some(
      (answer) =>
        answer != null &&
        !isString(answer) &&
        Object.prototype.hasOwnProperty.call(answer, "imageObject"),
    );

    if (hasImageAnswer) return null;
  }

  // Only non-empty string answers can be displayed in the bottom feedback bar.
  const answers = Array.isArray(correctAnswer)
    ? correctAnswer.filter(
        (answer): answer is string => isString(answer) && answer.trim() !== "",
      )
    : [correctAnswer].filter(
        (answer): answer is string => isString(answer) && answer.trim() !== "",
      );

  // Avoid rendering just the label when all answer values were empty or unsupported.
  if (answers.length === 0) return null;

  const label = answers.length > 1 ? "Correct answers:" : "Correct answer:";

  return (
    <OakSpan $color="text-primary" $font="body-2">
      <OakSpan>{label} </OakSpan>
      {answers.map((answer, index) => (
        <Fragment key={`${answer}-${index}`}>
          {index > 0 && <OakSpan>, </OakSpan>}
          <MathJaxWrap inline>
            <OakCodeRenderer string={answer} $font="code-3" />
          </MathJaxWrap>
        </Fragment>
      ))}
    </OakSpan>
  );
};
