import React, { FC } from "react";

import QuestionListItem from "../QuestionListItemNew";
import { QuizProps } from "../QuizContainerNew";

import { Heading, UL } from "@/components/Typography";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import Flex from "@/components/Flex/Flex";

export type QuizQuestionListProps = QuizProps;

const QuestionsList: FC<QuizQuestionListProps> = (props) => {
  const { questions } = props;
  const questionCount = questions.length;

  return (
    <MaxWidth $maxWidth={[360, 580, 720]} $ph={10} $pv={56} $gap={32}>
      <Heading $font={"heading-5"} tag={"h3"}>
        {questionCount} Questions
      </Heading>
      <Flex $flexDirection={"column"} $gap={24} role="list">
        {questions.map((question, i) => {
          return (
            <QuestionListItem
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
