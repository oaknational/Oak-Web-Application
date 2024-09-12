import { OakFlex, OakHeading } from "@oaknational/oak-components";

import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";
import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizResults } from "@/components/PupilComponents/QuizResults";

type PupilViewsResultsProps = {
  attemptData: {
    browseData: {
      subject: string;
      yearDescription: string;
    };
    lessonData: {
      slug: string;
      title: string;
    };
    sectionResults: LessonSectionResults;
  };
  starterQuizQuestionsArray: QuestionsArray;
  exitQuizQuestionsArray: QuestionsArray;
};

export const PupilViewsResults = (props: PupilViewsResultsProps) => {
  const { attemptData, starterQuizQuestionsArray, exitQuizQuestionsArray } =
    props;
  const { sectionResults } = attemptData;
  return (
    <div>
      <OakHeading tag="h1">Results Page</OakHeading>
      <OakFlex $flexDirection={"column"}>
        <OakHeading tag="h2">Starter Quiz</OakHeading>
        <QuizResults
          sectionResults={sectionResults}
          quizArray={starterQuizQuestionsArray}
          lessonSection={"starter-quiz"}
        />
      </OakFlex>
      <OakFlex $flexDirection={"column"}>
        <OakHeading tag="h2">Exit Quiz</OakHeading>
        <QuizResults
          sectionResults={sectionResults}
          quizArray={exitQuizQuestionsArray}
          lessonSection={"exit-quiz"}
        />
      </OakFlex>
    </div>
  );
};
