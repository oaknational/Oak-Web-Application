import { FC } from "react";
import { MathJax } from "better-react-mathjax";

import { QuestionStem } from "./QuestionStem";
import { MCAnswers } from "./Answers/MCAnswers";
import { MatchAnswers } from "./Answers/MatchAnswers";
import { OrderAnswers } from "./Answers/OrderAnswers";
import { ShortAnswers } from "./Answers/ShortAnswers";

import Flex from "@/components/Flex";
import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";

export type QuestionListItemProps = {
  question: NonNullable<LessonOverviewQuizData>[number];
  index: number;
};

const QuestionListItem: FC<QuestionListItemProps> = (props) => {
  const { question, index } = props;
  const { questionStem, answers } = question;

  return (
    <MathJax hideUntilTypeset="every" dynamic>
      <Flex $flexDirection={"column"} $width={"100%"} role="listitem" $gap={8}>
        <QuestionStem
          questionStem={questionStem}
          index={index}
          showIndex={question.questionType !== "explanatory-text"}
        />

        {answers && (
          <>
            {answers["multiple-choice"] &&
              answers["multiple-choice"].length > 0 && (
                <MCAnswers
                  answers={answers["multiple-choice"]}
                  questionNumber={index}
                />
              )}

            {answers["match"] && answers["match"].length > 0 && (
              <MatchAnswers answers={answers["match"]} questionNumber={index} />
            )}

            {answers["order"] && answers["order"].length > 0 && (
              <OrderAnswers answers={answers["order"]} questionNumber={index} />
            )}

            {answers["short-answer"] && answers["short-answer"].length > 0 && (
              <ShortAnswers answers={answers["short-answer"]} />
            )}
          </>
        )}
      </Flex>
    </MathJax>
  );
};

export default QuestionListItem;
