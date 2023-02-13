import React, { FC } from "react";

import { UL } from "../../Typography";
import MaxWidth from "../../MaxWidth/MaxWidth";
import QuestionListItem from "../QuestionListItem";
import { QuizProps } from "../QuizContainer";

export type QuizQuestionListProps = QuizProps;

const QuestionsList: FC<QuizQuestionListProps> = (props) => {
  const { questions } = props;
  console.log(questions);
  return (
    <MaxWidth $maxWidth={[360, 580, 720]} $ph={10}>
      <UL $reset>
        {questions.map((question) => {
          return <QuestionListItem {...question} />;
        })}
      </UL>
    </MaxWidth>
  );
};

export default QuestionsList;
