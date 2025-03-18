import {
  isValidIconName,
  oakDefaultTheme,
  OakFlex,
  OakHandDrawnHR,
  OakHeading,
  OakJauntyAngleLabel,
  OakMaxWidth,
  OakQuizPrintableHeader,
  OakQuizPrintableSubHeader,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { LessonAttemptCamelCase } from "@oaknational/oak-pupil-client";

import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { LessonBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { QuizResultInner } from "@/components/PupilComponents/QuizResultInner";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";
import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";

type PupilViewsResultsProps = {
  attemptData: LessonAttemptCamelCase;
  starterQuizQuestionsArray: QuestionsArray;
  exitQuizQuestionsArray: QuestionsArray;
  browseData: LessonBrowseData;
};

type QuizResultsProps = {
  index: number;
  displayIndex: number;
  questionResult: QuestionState;
  quizQuestionArray: QuestionsArray;
  lessonSection: "exit-quiz" | "starter-quiz";
};

const QuizSectionRender = (props: QuizResultsProps) => {
  const {
    index,
    displayIndex,
    questionResult,
    quizQuestionArray,
    lessonSection,
  } = props;
  const isHint = questionResult.mode === "init";

  return (
    <OakFlex
      $position={"relative"}
      $flexDirection={"column"}
      key={index}
      $gap={"all-spacing-5"}
    >
      <OakFlex $pb={["inner-padding-xl", "inner-padding-none"]}>
        <QuizResultInner
          index={index}
          displayIndex={displayIndex}
          questionResult={questionResult}
          quizArray={quizQuestionArray}
          lessonSection={lessonSection}
        />
      </OakFlex>
      <OakHandDrawnHR
        hrColor={
          index !== quizQuestionArray.length - 1 ? "black" : "transparent"
        }
        $height={"all-spacing-1"}
        $pl={["inner-padding-none", "inner-padding-xl"]}
        $ml={["space-between-none", "space-between-s"]}
      />
      {!isHint && (
        <OakJauntyAngleLabel
          $position={"absolute"}
          $bottom={"all-spacing-5"}
          $right={"all-spacing-0"}
          $background={"bg-neutral"}
          $font={"heading-light-7"}
          label={`Question hint used - ${questionResult.offerHint}`}
        />
      )}
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
  const { programmeFields, lessonData, isLegacy } = browseData;
  const { yearDescription, subject, subjectSlug } = programmeFields;
  const { title } = lessonData;
  const exitQuiz = sectionResults["exit-quiz"];
  const starterQuiz = sectionResults["starter-quiz"];
  const { worksheetDownloaded, worksheetAvailable } = sectionResults["intro"];
  const video = sectionResults["video"];

  const percentageVideoWatched =
    video.duration > 0 && video.timeElapsed > 0
      ? Math.ceil((video.timeElapsed / video.duration) * 100)
      : 0;

  const iconSlug = `subject-${subjectSlug}`;
  let questionIndex = 1;

  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <MathJaxWrap>
        <OakMaxWidth
          $gap={"space-between-m"}
          $flexDirection={"column"}
          $mt={"space-between-l"}
          $ph={"inner-padding-s"}
        >
          <OakQuizPrintableHeader
            alt="icon"
            breadcrumbs={[yearDescription, subject]}
            iconName={isValidIconName(iconSlug) ? iconSlug : "question-mark"}
            title={title}
            videoPercentage={percentageVideoWatched}
            worksheetDownloaded={worksheetDownloaded}
            workSheetAvailable={worksheetAvailable}
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
                  grade={starterQuiz.grade ?? 0}
                  numQuestions={starterQuiz.numQuestions ?? 0}
                  attempts={1}
                />
              </>
            )}
            {starterQuiz?.questionResults &&
              starterQuiz.questionResults.map((questionResult, index) => {
                const displayIndex =
                  questionResult.mode === "init" ? 999 : questionIndex++;

                return (
                  <QuizSectionRender
                    key={index}
                    index={index}
                    displayIndex={displayIndex}
                    questionResult={questionResult}
                    quizQuestionArray={starterQuizQuestionsArray}
                    lessonSection={"starter-quiz"}
                  />
                );
              })}

            {exitQuiz?.questionResults && (
              <>
                <OakHandDrawnHR $height={"all-spacing-1"} />
                <OakQuizPrintableSubHeader
                  title={"Exit quiz"}
                  grade={exitQuiz.grade ?? 0}
                  numQuestions={exitQuiz.numQuestions ?? 0}
                  attempts={1}
                />
              </>
            )}
            {exitQuiz?.questionResults &&
              exitQuiz.questionResults.map((questionResult, index) => {
                const displayIndex =
                  questionResult.mode === "init" ? 999 : questionIndex++;

                return (
                  <QuizSectionRender
                    key={index}
                    index={index}
                    displayIndex={displayIndex}
                    questionResult={questionResult}
                    quizQuestionArray={exitQuizQuestionsArray}
                    lessonSection={"exit-quiz"}
                  />
                );
              })}
            <CopyrightNotice isLegacyLicense={isLegacy} />
          </OakFlex>
        </OakMaxWidth>
      </MathJaxWrap>
    </OakThemeProvider>
  );
};
