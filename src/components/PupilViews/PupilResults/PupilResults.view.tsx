import {
  oakDefaultTheme,
  OakFlex,
  OakHeading,
  OakPupilJourneyHeader,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { LessonAttemptCamelCase } from "@oaknational/oak-pupil-client";

import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizResults } from "@/components/PupilComponents/QuizResults";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { LessonSectionResults } from "@/components/PupilComponents/LessonEngineProvider";
import { LessonBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

type PupilViewsResultsProps = {
  attemptData: LessonAttemptCamelCase;
  starterQuizQuestionsArray: QuestionsArray;
  exitQuizQuestionsArray: QuestionsArray;
  browseData: LessonBrowseData;
};

export const PupilViewsResults = (props: PupilViewsResultsProps) => {
  const {
    attemptData,
    starterQuizQuestionsArray,
    exitQuizQuestionsArray,
    browseData,
  } = props;
  const { sectionResults } = attemptData;
  const { programmeFields, lessonData } = browseData;
  const { yearDescription, subject, subjectSlug } = programmeFields;
  const { title } = lessonData;
  return (
    <div>
      <OakThemeProvider theme={oakDefaultTheme}>
        <MathJaxWrap>
          <OakPupilJourneyHeader
            alt="icon"
            breadcrumbs={[yearDescription, subject]}
            iconName={`subject-${subjectSlug}`}
            title={title}
          />
          <OakHeading tag="h1">Results Page</OakHeading>
          <OakFlex $flexDirection={"column"}>
            <OakHeading tag="h2">Starter Quiz</OakHeading>
            <QuizResults
              sectionResults={sectionResults as LessonSectionResults}
              quizArray={starterQuizQuestionsArray}
              lessonSection={"starter-quiz"}
            />
          </OakFlex>
          <OakFlex $flexDirection={"column"}>
            <OakHeading tag="h2">Exit Quiz</OakHeading>
            <QuizResults
              sectionResults={sectionResults as LessonSectionResults}
              quizArray={exitQuizQuestionsArray}
              lessonSection={"exit-quiz"}
            />
          </OakFlex>
        </MathJaxWrap>
      </OakThemeProvider>
    </div>
  );
};
