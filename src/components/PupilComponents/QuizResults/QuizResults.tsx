import { OakFlex } from "@oaknational/oak-components";

import { QuizResultInner } from "../QuizResultInner";

import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";
import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizAttribution } from "@/components/PupilComponents/QuizAttribution/QuizAttribution";

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
            <QuizResultInner
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
