import React, { FC } from "react";

import { Heading, UL } from "../../Typography";
import MaxWidth from "../../MaxWidth/MaxWidth";
import QuestionListItem from "../QuestionListItemNew";
import { QuizProps } from "../QuizContainerNew";

export type QuizQuestionListProps = QuizProps;

const QuestionsList: FC<QuizQuestionListProps> = (props) => {
  const { questions, info } = props;
  const { questionCount } = info ?? {};

  return (
    <MaxWidth $maxWidth={[360, 580, 720]} $ph={10}>
      <Heading $font={"heading-5"} tag={"h3"} $mt={56} $mb={56}>
        {questionCount} Questions
      </Heading>
      <UL $reset>
        {questions.map((question, i) => {
          return (
            <QuestionListItem
              key={`QuestionsList-UL-QuestionListItem-${i}`}
              {...question}
            />
          );
        })}
      </UL>
    </MaxWidth>
  );
};

export default QuestionsList;
