import {
  OakFlex,
  OakHandDrawnHR,
  OakJauntyAngleLabel,
} from "@oaknational/oak-components";

import { QuestionsArray } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizResultInner } from "@/components/PupilComponents/QuizResultInner";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

type QuizResultsProps = {
  index: number;
  displayIndex: number;
  questionResult: QuestionState;
  quizQuestionArray: QuestionsArray;
  lessonSection: "exit-quiz" | "starter-quiz";
};

export const QuizSectionRender = (props: QuizResultsProps) => {
  const {
    index,
    displayIndex,
    questionResult,
    quizQuestionArray,
    lessonSection,
  } = props;
  const isUnanswered = questionResult.mode !== "feedback";

  return (
    <OakFlex
      $position={"relative"}
      $flexDirection={"column"}
      key={`section-${index}`}
      $gap={"spacing-20"}
    >
      <OakFlex $pb={["spacing-24", "spacing-0"]}>
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
          index === quizQuestionArray.length - 1 ? "transparent" : "bg-inverted"
        }
        $height={"spacing-4"}
        $pl={["spacing-0", "spacing-24"]}
        $ml={["spacing-0", "spacing-16"]}
      />
      <OakJauntyAngleLabel
        $position={"absolute"}
        $bottom={"spacing-20"}
        $right={"spacing-0"}
        $background={"bg-neutral"}
        $font={"heading-light-7"}
        label={
          isUnanswered
            ? "Unanswered"
            : `Question hint used - ${questionResult.offerHint}`
        }
      />
    </OakFlex>
  );
};
