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
      $maxWidth={["spacing-360", "spacing-480", "spacing-640"]}
      $ph={"spacing-4"}
      $pv={"spacing-56"}
      $gap={"spacing-40"}
    >
      <OakHeading $font={"heading-5"} tag={"h3"}>
        {questionCount} Questions
      </OakHeading>
      <OakFlex $flexDirection={"column"} $gap={"spacing-56"} role="list">
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
