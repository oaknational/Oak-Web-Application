import React, { FC } from "react";

import { QuizProps } from "@/components/TeacherComponents/LessonOverviewQuizContainer/LessonOverviewQuizContainer";
import QuizQuestionsListItem from "@/components/TeacherComponents/QuizQuestionsListItem";
import { Heading } from "@/components/SharedComponents/Typography";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Flex from "@/components/SharedComponents/Flex";

export type QuizQuestionListProps = QuizProps;

const QuestionsList: FC<QuizQuestionListProps> = (props) => {
  const { questions } = props;
  const questionCount = questions.length;

  return (
    <MaxWidth $maxWidth={[360, 580, 720]} $ph={10} $pv={56} $gap={40}>
      <Heading $font={"heading-5"} tag={"h3"}>
        {questionCount} Questions
      </Heading>

      <Flex $flexDirection={"column"} $gap={56} role="list">
        {questions.map((question, i) => {
          return (
            <QuizQuestionsListItem
              key={`QuestionsList-UL-QuestionListItem-${i}`}
              question={question}
              index={i}
            />
          );
        })}
      </Flex>
    </MaxWidth>
  );
};

export default QuestionsList;
