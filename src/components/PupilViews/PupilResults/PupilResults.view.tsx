import {
  oakDefaultTheme,
  OakFlex,
  OakHandDrawnHR,
  OakHeading,
  OakInlineBanner,
  OakJauntyAngleLabel,
  OakMaxWidth,
  OakQuizPrintableHeader,
  OakQuizPrintableSubHeader,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { LessonAttemptCamelCase } from "@oaknational/oak-pupil-client";
import { useState } from "react";

import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { LessonBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { QuizResultInner } from "@/components/PupilComponents/QuizResultInner";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

type PupilViewsResultsProps = {
  attemptData: LessonAttemptCamelCase;
  starterQuizQuestionsArray: QuestionsArray;
  exitQuizQuestionsArray: QuestionsArray;
  browseData: LessonBrowseData;
};

type QuizResultsProps = {
  index: number;
  questionResult: QuestionState;
  quizQuestionArray: QuestionsArray;
  lessonSection: "exit-quiz" | "starter-quiz";
};

const QuizSectionRender = (props: QuizResultsProps) => {
  const { index, questionResult, quizQuestionArray, lessonSection } = props;
  return (
    <OakFlex
      $position={"relative"}
      $flexDirection={"column"}
      key={index}
      $gap={"all-spacing-5"}
    >
      <QuizResultInner
        index={index}
        questionResult={questionResult}
        quizArray={quizQuestionArray}
        lessonSection={lessonSection}
      />
      {index !== quizQuestionArray.length - 1 && (
        <OakHandDrawnHR
          $height={"all-spacing-1"}
          $pl={"inner-padding-xl"}
          $ml={"space-between-s"}
        />
      )}
      <OakJauntyAngleLabel
        $position={"absolute"}
        $bottom={"all-spacing-5"}
        $right={"all-spacing-0"}
        $background={"bg-neutral"}
        $font={"heading-light-7"}
        label={`Question hint used - ${questionResult.offerHint}`}
      />
    </OakFlex>
  );
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
  const exitQuiz = sectionResults["exit-quiz"];
  const starterQuiz = sectionResults["starter-quiz"];
  const { worksheetDownloaded, worksheetAvailable } = sectionResults["intro"];
  const video = sectionResults["video"];
  const [showBanner, setShowBanner] = useState(true);

  const percentageVideoWatched =
    video.duration > 0 && video.timeElapsed > 0
      ? Math.ceil((video.timeElapsed / video.duration) * 100)
      : 0;

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MathJaxWrap>
        <OakMaxWidth
          $gap={"space-between-m"}
          $flexDirection={"column"}
          $mt={"space-between-l"}
        >
          {showBanner && (
            <OakInlineBanner
              canDismiss
              isOpen
              message="To share lesson results with your teacher, select the 'Copy link' option on the lesson review page >"
              onDismiss={() => setShowBanner(false)}
              type="neutral"
            />
          )}

          <OakQuizPrintableHeader
            alt="icon"
            breadcrumbs={[yearDescription, subject]}
            iconName={`subject-${subjectSlug}`}
            title={title}
            videoPercentage={percentageVideoWatched}
            worksheetDownloaded={worksheetDownloaded}
            worksheetAvailable={worksheetAvailable}
          />
          <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
            <OakHeading tag="h2" $font={"heading-5"}>
              Results
            </OakHeading>

            {starterQuiz?.questionResults && (
              <>
                <OakHandDrawnHR $height={"all-spacing-1"} />
                <OakQuizPrintableSubHeader
                  title={"Starter quiz"}
                  grade={starterQuiz.grade}
                  numQuestions={starterQuiz.numQuestions}
                  attempts={1}
                />
              </>
            )}
            {starterQuiz?.questionResults &&
              starterQuiz.questionResults.map((questionResult, index) => (
                <QuizSectionRender
                  index={index}
                  questionResult={questionResult}
                  quizQuestionArray={starterQuizQuestionsArray}
                  lessonSection={"starter-quiz"}
                />
              ))}

            {exitQuiz?.questionResults && (
              <>
                <OakHandDrawnHR $height={"all-spacing-1"} />
                <OakQuizPrintableSubHeader
                  title={"Exit quiz"}
                  grade={exitQuiz.grade}
                  numQuestions={exitQuiz.numQuestions}
                  attempts={1}
                />
              </>
            )}
            {exitQuiz?.questionResults &&
              exitQuiz.questionResults.map((questionResult, index) => (
                <QuizSectionRender
                  index={index}
                  questionResult={questionResult}
                  quizQuestionArray={exitQuizQuestionsArray}
                  lessonSection={"exit-quiz"}
                />
              ))}
          </OakFlex>
        </OakMaxWidth>
      </MathJaxWrap>
    </OakThemeProvider>
  );
};
