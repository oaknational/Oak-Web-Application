import {
  OakHandDrawnHR,
  OakQuizPrintableSubHeader,
} from "@oaknational/oak-components";

import { QuizResultCamelCase } from "@/node-lib/pupil-api/types";
import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizSectionRender } from "@/components/PupilComponents/QuizSectionRender";

type QuizQuestionResultsSectionProps = {
  quiz: QuizResultCamelCase;
  quizType: "starter" | "exit";
  quizQuestionsArray: QuestionsArray;
  incrementQuestionIndex: () => number;
};
export const QuizQuestionResultsSection = ({
  quiz,
  quizType,
  quizQuestionsArray,
  incrementQuestionIndex,
}: QuizQuestionResultsSectionProps) => {
  const quizLessonSection =
    quizType === "starter" ? "starter-quiz" : "exit-quiz";
  const quizTitle = quizType === "starter" ? "Starter quiz" : "Exit quiz";
  return (
    <>
      {quiz?.questionResults && (
        <>
          <OakHandDrawnHR $height={"spacing-4"} />
          <OakQuizPrintableSubHeader
            title={quizTitle}
            grade={quiz.grade ?? 0}
            numQuestions={quiz.numQuestions ?? 0}
            attempts={1}
          />
        </>
      )}
      {quiz?.questionResults &&
        quiz.questionResults.map((questionResult, index) => {
          const displayIndex =
            questionResult.mode === "init" ? 999 : incrementQuestionIndex();

          return (
            <QuizSectionRender
              key={`section-render'${index}`}
              index={index}
              displayIndex={displayIndex}
              questionResult={questionResult}
              quizQuestionArray={quizQuestionsArray}
              lessonSection={quizLessonSection}
            />
          );
        })}
    </>
  );
};
