import {
  isValidIconName,
  OakFlex,
  OakHeading,
  OakMaxWidth,
  OakQuizPrintableHeader,
} from "@oaknational/oak-components";

import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { LessonBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { CopyrightNotice } from "@/components/PupilComponents/CopyrightNotice";
import { LessonAttemptCamelCase } from "@/node-lib/pupil-api/types";
import { QuizQuestionResultsSection } from "@/components/PupilComponents/QuizQuestionResultsSection";

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
  const { programmeFields, lessonData, isLegacy } = browseData;
  const { yearDescription, subject, subjectSlug } = programmeFields;
  const { title } = lessonData;
  const exitQuiz = sectionResults["exit-quiz"];
  const starterQuiz = sectionResults["starter-quiz"];
  const video = sectionResults["video"];

  const getPercentageWatched = () => {
    if (video?.duration != null && video.timeElapsed != null) {
      if (video.duration > 0 && video.timeElapsed > 0) {
        return Math.ceil((video.timeElapsed / video.duration) * 100);
      }
    }

    return 0;
  };

  const percentageVideoWatched = getPercentageWatched();

  const iconSlug = `subject-${subjectSlug}`;
  let questionIndex = 1;

  return (
    <MathJaxWrap>
      <OakMaxWidth
        $gap={"spacing-24"}
        $flexDirection={"column"}
        $mt={"spacing-48"}
        $ph={"spacing-12"}
      >
        <OakQuizPrintableHeader
          alt="icon"
          breadcrumbs={[yearDescription, subject]}
          iconName={isValidIconName(iconSlug) ? iconSlug : "question-mark"}
          title={title}
          videoPercentage={percentageVideoWatched}
          worksheetDownloaded={!!sectionResults["intro"]?.worksheetDownloaded}
          workSheetAvailable={!!sectionResults["intro"]?.worksheetAvailable}
        />
        <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
          <OakHeading tag="h2" $font={"heading-5"}>
            Results
          </OakHeading>
          <QuizQuestionResultsSection
            quiz={starterQuiz}
            quizQuestionsArray={starterQuizQuestionsArray}
            quizType={"starter"}
            incrementQuestionIndex={() => questionIndex++}
          />
          <QuizQuestionResultsSection
            quiz={exitQuiz}
            quizQuestionsArray={exitQuizQuestionsArray}
            quizType={"exit"}
            incrementQuestionIndex={() => questionIndex++}
          />
          <CopyrightNotice isLegacyLicense={isLegacy} />
        </OakFlex>
      </OakMaxWidth>
    </MathJaxWrap>
  );
};
