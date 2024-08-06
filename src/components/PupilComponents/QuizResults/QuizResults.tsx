import {
  OakFlex,
  OakIcon,
  OakQuizResultItem,
  OakSpan,
} from "@oaknational/oak-components";
import { isArray } from "lodash";

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

export type QuizResultsProps = {
  lessonSection: "exit-quiz" | "starter-quiz";
  quizArray: QuestionsArray;
  sectionResults: LessonSectionResults;
};
export const QuizResults = (props: QuizResultsProps) => {
  const { lessonSection, quizArray, sectionResults } = props;

  return (
    <MathJaxProvider>
      <OakFlex $flexDirection={"column"} $gap={"space-between-xl"} role="list">
        {sectionResults[lessonSection]?.questionResults &&
          sectionResults[lessonSection]?.questionResults?.map(
            (questionResult, index) => {
              const quizQuestion = quizArray[index];
              const questionStem = quizQuestion?.questionStem;
              const answers = quizQuestion?.answers;
              const grade = questionResult.grade;
              const questionType = quizQuestion?.questionType;
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
                      <QuizResultQuestionStem
                        index={index}
                        questionStem={questionStem}
                      />
                    )}
                    {answers &&
                      answers["multiple-choice"] &&
                      isArray(questionResult?.feedback) && (
                        <QuizResultMCQ
                          answers={answers["multiple-choice"]}
                          feedback={questionResult.feedback}
                          pupilAnswer={questionResult.pupilAnswer}
                        />
                      )}
                    {answers &&
                      answers["short-answer"] &&
                      !isArray(questionResult?.feedback) &&
                      questionResult?.feedback && (
                        <QuizResultShortAnswer
                          pupilAnswer={questionResult.pupilAnswer}
                          feedback={questionResult.feedback}
                        />
                      )}
                    {answers &&
                      answers["order"] &&
                      isArray(questionResult?.feedback) && (
                        <QuizResultOrder
                          answers={answers["order"]}
                          feedback={questionResult.feedback}
                          pupilAnswers={questionResult.pupilAnswer}
                        />
                      )}
                    {answers &&
                      answers["match"] &&
                      isArray(questionResult?.feedback) && (
                        <QuizResultMatch
                          answers={answers["match"]}
                          feedback={questionResult.feedback}
                          pupilAnswers={questionResult.pupilAnswer}
                        />
                      )}
                    {grade === 0 && (
                      <OakFlex $flexDirection={"column"}>
                        <OakSpan $font={"body-3-bold"}>Correct answer:</OakSpan>
                        <OakFlex
                          $flexDirection={"column"}
                          $gap={"space-between-m2"}
                        >
                          {isArray(questionResult?.correctAnswer) &&
                            questionResult?.correctAnswer?.map(
                              (correctAnswer, index) => {
                                return (
                                  <MathJaxWrap>
                                    <OakQuizResultItem
                                      key={index}
                                      standardText={correctAnswer}
                                      boldPrefixText={pickBoldPretext(
                                        questionType,
                                        index,
                                        answers,
                                      )}
                                    />
                                  </MathJaxWrap>
                                );
                              },
                            )}
                        </OakFlex>
                      </OakFlex>
                    )}
                  </OakFlex>
                </OakFlex>
              );
            },
          )}
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
