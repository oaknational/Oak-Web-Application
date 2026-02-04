import { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import { QuizQuestionsQuestionStem } from "@/components/TeacherComponents/QuizQuestionsQuestionStem/QuizQuestionsQuestionStem";
import { QuizQuestionsMCAnswers } from "@/components/TeacherComponents/QuizQuestionsMCAnswers";
import { QuizQuestionsMatchAnswers } from "@/components/TeacherComponents/QuizQuestionsMatchAnswers";
import { QuizQuestionsOrderAnswers } from "@/components/TeacherComponents/QuizQuestionsOrderAnswers";
import { QuizQuestionsShortAnswers } from "@/components/TeacherComponents/QuizQuestionsShortAnswers";
import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";

export type QuizQuestionsListItemProps = {
  question: NonNullable<LessonOverviewQuizData>[number];
  index: number;
  isMathJaxLesson: boolean;
};

const QuizQuestionsListItem: FC<QuizQuestionsListItemProps> = (props) => {
  const { question, index } = props;
  const { questionStem, answers } = question;

  return (
    <OakFlex
      $flexDirection={"column"}
      $width={"100%"}
      role="listitem"
      $gap={"spacing-8"}
    >
      <QuizQuestionsQuestionStem
        questionStem={questionStem}
        index={index}
        showIndex={question.questionType !== "explanatory-text"}
      />

      {answers && (
        <>
          {answers["multiple-choice"] &&
            answers["multiple-choice"].length > 0 && (
              <QuizQuestionsMCAnswers
                answers={answers["multiple-choice"]}
                questionNumber={index}
              />
            )}

          {answers["match"] && answers["match"].length > 0 && (
            <QuizQuestionsMatchAnswers
              answers={answers["match"]}
              questionNumber={index}
            />
          )}

          {answers["order"] && answers["order"].length > 0 && (
            <QuizQuestionsOrderAnswers
              answers={answers["order"]}
              questionNumber={index}
            />
          )}

          {answers["short-answer"] && answers["short-answer"].length > 0 && (
            <QuizQuestionsShortAnswers answers={answers["short-answer"]} />
          )}
        </>
      )}
    </OakFlex>
  );
};

export default QuizQuestionsListItem;
