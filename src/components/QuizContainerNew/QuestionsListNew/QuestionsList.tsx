import React, { FC } from "react";
import { MathJaxContext } from "better-react-mathjax";

import { QuizProps } from "../QuizContainerNew";

import QuestionListItem from "./QuestionListItemNew";

import { Heading } from "@/components/Typography";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import Flex from "@/components/Flex/Flex";

export type QuizQuestionListProps = QuizProps;

const QuestionsList: FC<QuizQuestionListProps> = (props) => {
  const { questions } = props;
  const questionCount = questions.length;

  return (
    <MaxWidth $maxWidth={[360, 580, 720]} $ph={10} $pv={56} $gap={40}>
      <Heading $font={"heading-5"} tag={"h3"}>
        {questionCount} Questions
      </Heading>
      <MathJaxContext version={3} src={"/mathjax/tex-mml-chtml.js"}>
        <Flex $flexDirection={"column"} $gap={56} role="list">
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
      </MathJaxContext>
    </MaxWidth>
  );
};

export default QuestionsList;
