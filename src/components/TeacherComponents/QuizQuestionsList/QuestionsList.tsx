import React, { FC } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import { QuizProps } from "@/components/TeacherComponents/LessonOverviewQuizContainer/LessonOverviewQuizContainer";
import QuizQuestionsListItem from "@/components/TeacherComponents/QuizQuestionsListItem";
import MaxWidth from "@/components/SharedComponents/MaxWidth";

export type QuizQuestionListProps = QuizProps;

const QuestionsList: FC<QuizQuestionListProps> = (props) => {
  const { questions } = props;
  const questionCount = questions.length;

  return (
    <MaxWidth $maxWidth={[360, 580, 720]} $ph={10} $pv={56} $gap={40}>
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
            />
          );
        })}
      </OakFlex>
    </MaxWidth>
  );
};

export default QuestionsList;
