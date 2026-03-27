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
};
export const QuizQuestionResultsSection = ({
  quiz,
  quizType,
  quizQuestionsArray,
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
          />
        </>
      )}
      {quiz?.questionResults?.map((questionResult, index) => {
        const displayIndex = questionResult.mode === "init" ? 999 : index + 1;
        const questionKey = `${quizType}-${quizQuestionsArray[index]?.questionUid ?? "question"}-${index}`;

        return (
          <QuizSectionRender
            key={questionKey}
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
