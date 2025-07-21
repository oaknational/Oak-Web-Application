import React, { FC } from "react";
import { OakHeading, OakFlex, OakMaxWidth } from "@oaknational/oak-components";

import { QuizProps } from "@/components/TeacherComponents/LessonOverviewQuizContainer/LessonOverviewQuizContainer";
import QuizQuestionsListItem from "@/components/TeacherComponents/QuizQuestionsListItem";

export type QuizQuestionListProps = QuizProps & { isMathJaxLesson: boolean };

const QuestionsList: FC<QuizQuestionListProps> = (props) => {
  const { questions, isMathJaxLesson } = props;
  const questionCount = questions.length;

  return (
    <OakMaxWidth
      $maxWidth={["all-spacing-20", "all-spacing-21", "all-spacing-22"]}
      $ph={"inner-padding-s"}
      $pv={"inner-padding-xl5"}
      $gap={"all-spacing-8"}
    >
      <OakHeading $font={"heading-5"} tag={"h3"}>
        {questionCount} Questions
      </OakHeading>

      <OakFlex $flexDirection={"column"} $gap={"all-spacing-10"} role="list">
        {questions.map((question, i) => {
          return (
            <QuizQuestionsListItem
              key={`QuestionsList-UL-QuestionListItem-${i}`}
              question={question}
              index={i}
              isMathJaxLesson={isMathJaxLesson}
            />
          );
        })}
      </OakFlex>
    </OakMaxWidth>
  );
};

export default QuestionsList;
