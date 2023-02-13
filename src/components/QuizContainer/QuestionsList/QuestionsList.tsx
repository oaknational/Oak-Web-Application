import React, { FC } from "react";

import { Heading, Hr, UL } from "../../Typography";
import MaxWidth from "../../MaxWidth/MaxWidth";
import QuestionListItem from "../QuestionListItem";
import { QuizProps } from "../QuizContainer";

export type QuizQuestionListProps = QuizProps;

const QuestionsList: FC<QuizQuestionListProps> = (props) => {
  const { questions, info } = props;
  const { questionCount } = info ?? {};

  return (
    <MaxWidth $maxWidth={[360, 580, 720]} $ph={10}>
      <Heading $font={"heading-5"} tag={"h3"} $mt={56}>
        {questionCount} Questions
      </Heading>
      <Hr />
      <UL $reset>
        {questions.map((question) => {
          return <QuestionListItem {...question} />;
        })}
      </UL>
    </MaxWidth>
  );
};

export default QuestionsList;
