import {
  OakFlex,
  OakIcon,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";
import { isArray, isString } from "lodash";

import { QuestionState } from "../QuizUtils/questionTypes";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";
import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizResultQuestionStem } from "@/components/PupilComponents/QuizResultQuestionStem";
import { QuizResultMCQ } from "@/components/PupilComponents/QuizResultMCQ/QuizResultMCQ";
import { QuizResultShortAnswer } from "@/components/PupilComponents/QuizResultShortAnswer";
import { QuizResultOrder } from "@/components/PupilComponents/QuizResultOrder/QuizResultOrder";
import { QuizResultMatch } from "@/components/PupilComponents/QuizResultMatch";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import type { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { QuizAttribution } from "@/components/PupilComponents/QuizAttribution/QuizAttribution";

type CorectAnswerSectionProps = {
  questionResult: QuestionState;
  quizQuestion: QuestionsArray[number];
};

const CorrectAnswerSection = (props: CorectAnswerSectionProps) => {
  const { questionResult, quizQuestion } = props;

  return (
    <OakFlex $flexDirection={"column"}>
      <OakSpan $font={"body-3-bold"}>
        {isArray(questionResult?.correctAnswer) &&
        questionResult?.correctAnswer.length > 1
          ? "Correct answers:"
          : "Correct answer:"}
      </OakSpan>
      <OakFlex $flexDirection={"column"}>
        {isArray(questionResult?.correctAnswer) &&
          questionResult?.correctAnswer?.map((correctAnswer, index) => {
            const correctAnswerText = isString(correctAnswer)
              ? correctAnswer
              : undefined;

            const imageURL = !isString(correctAnswer)
              ? correctAnswer?.imageObject.secureUrl
              : undefined;

            return (
              <MathJaxWrap>
                <OakQuizResultItem
                  key={index}
                  standardText={correctAnswerText}
                  boldPrefixText={pickBoldPretext(
                    quizQuestion?.questionType,
                    index,
                    quizQuestion?.answers,
                  )}
                  imageURL={imageURL}
                  imageAlt={"Image for option " + (index + 1)}
                />
              </MathJaxWrap>
            );
          })}
      </OakFlex>
    </OakFlex>
  );
};

type ResultsInnerProps = {
  index: number;
  quizArray: QuestionsArray;
  questionResult: QuestionState;
  lessonSection: "exit-quiz" | "starter-quiz";
};

const ResultsInner = (props: ResultsInnerProps) => {
  const { index, quizArray, questionResult, lessonSection } = props;
  const quizQuestion = quizArray[index];
  const questionStem = quizQuestion?.questionStem;
  const answers = quizQuestion?.answers;
  const grade = questionResult.grade;
  return (
    <OakFlex
      key={`${lessonSection}-question-${index}`}
      $gap={"space-between-s"}
      $flexDirection={["column", "row"]}
      role="listitem"
    >
      <OakIcon
        iconName={grade === 1 ? "tick" : "cross"}
        $background={grade === 1 ? "icon-success" : "icon-error"}
        $colorFilter={"white"}
        $borderRadius={"border-radius-circle"}
      />
      <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
        {questionStem && (
          <QuizResultQuestionStem index={index} questionStem={questionStem} />
        )}
        {answers?.["multiple-choice"] && isArray(questionResult?.feedback) && (
          <QuizResultMCQ
            answers={answers["multiple-choice"]}
            feedback={questionResult.feedback}
            pupilAnswer={questionResult.pupilAnswer}
          />
        )}
        {answers?.["short-answer"] &&
          !isArray(questionResult?.feedback) &&
          questionResult?.feedback && (
            <QuizResultShortAnswer
              pupilAnswer={questionResult.pupilAnswer}
              feedback={questionResult.feedback}
            />
          )}
        {answers?.["order"] && isArray(questionResult?.feedback) && (
          <QuizResultOrder
            answers={answers["order"]}
            feedback={questionResult.feedback}
            pupilAnswers={questionResult.pupilAnswer}
          />
        )}
        {answers?.["match"] && isArray(questionResult?.feedback) && (
          <QuizResultMatch
            answers={answers["match"]}
            feedback={questionResult.feedback}
            pupilAnswers={questionResult.pupilAnswer}
          />
        )}
        {grade === 0 && quizQuestion && (
          <CorrectAnswerSection
            questionResult={questionResult}
            quizQuestion={quizQuestion}
          />
        )}
      </OakFlex>
    </OakFlex>
  );
};

export type QuizResultsProps = {
  lessonSection: "exit-quiz" | "starter-quiz";
  quizArray: QuestionsArray;
  sectionResults: LessonSectionResults;
  copyrightNotice?: React.ReactNode;
};
export const QuizResults = (props: QuizResultsProps) => {
  const { lessonSection, quizArray, sectionResults, copyrightNotice } = props;

  return (
    <MathJaxProvider>
      <OakFlex $flexDirection={"column"} $gap={"space-between-xl"} role="list">
        {sectionResults[lessonSection]?.questionResults?.map(
          (questionResult, index) => (
            <ResultsInner
              index={index}
              questionResult={questionResult}
              quizArray={quizArray}
              lessonSection={lessonSection}
            />
          ),
        )}
        <QuizAttribution questionData={quizArray} />
        {copyrightNotice}
      </OakFlex>
    </MathJaxProvider>
  );
};

function pickBoldPretext(
  questionType: string | undefined,
  index: number,
  answers: QuizQuestion["answers"],
) {
  switch (true) {
    case questionType === "order":
      return `${index + 1}`;
    case questionType === "match":
      return `${answers?.["match"]?.[index]?.matchOption?.[0]?.text}`;
    default:
      return "";
  }
}
