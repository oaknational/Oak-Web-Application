import { FC } from "react";

import { QuestionStem } from "@/components/TeacherComponents/QuestionListItemNew/QuestionStem";
import { MCAnswers } from "@/components/TeacherComponents/QuestionListItemNew/Answers/MCAnswers";
import { MatchAnswers } from "@/components/TeacherComponents/QuestionListItemNew/Answers/MatchAnswers";
import { OrderAnswers } from "@/components/TeacherComponents/QuestionListItemNew/Answers/OrderAnswers";
import { ShortAnswers } from "@/components/TeacherComponents/QuestionListItemNew/Answers/ShortAnswers";
import Flex from "@/components/SharedComponents/Flex";
import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

export type QuizQuestionsListItemProps = {
  question: NonNullable<LessonOverviewQuizData>[number];
  index: number;
};

const QuizQuestionsListItem: FC<QuizQuestionsListItemProps> = (props) => {
  const { question, index } = props;
  const { questionStem, answers } = question;

  return (
    <MathJaxWrap>
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
    </MathJaxWrap>
  );
};

export default QuizQuestionsListItem;
