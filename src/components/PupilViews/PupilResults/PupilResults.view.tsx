import { OakFlex, OakHeading } from "@oaknational/oak-components";

import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";
import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizResults } from "@/components/PupilComponents/QuizResults";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";

type PupilViewsResultsProps = {
  attemptData: {
    browseData: {
      subject: string;
      yearDescription: string;
      isLegacy: boolean;
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
      <MathJaxWrap>
        {" "}
        <OakHeading tag="h1">Results Page</OakHeading>
        <OakFlex $flexDirection={"column"}>
          <OakHeading tag="h2">Starter Quiz</OakHeading>
          <QuizResults
            sectionResults={sectionResults}
            quizArray={starterQuizQuestionsArray}
            lessonSection={"starter-quiz"}
            copyrightNotice={
              <CopyrightNotice
                isLegacyLicense={attemptData.browseData.isLegacy}
              />
            }
          />
        </OakFlex>
        <OakFlex $flexDirection={"column"}>
          <OakHeading tag="h2">Exit Quiz</OakHeading>
          <QuizResults
            sectionResults={sectionResults}
            quizArray={exitQuizQuestionsArray}
            lessonSection={"exit-quiz"}
            copyrightNotice={
              <CopyrightNotice
                isLegacyLicense={attemptData.browseData.isLegacy}
              />
            }
          />
        </OakFlex>
      </MathJaxWrap>
    </div>
  );
};
