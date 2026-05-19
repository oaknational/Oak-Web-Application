import {
  OakFlex,
  OakJauntyAngleLabel,
  OakLabel,
  OakQuizTextInput,
} from "@oaknational/oak-components";

import { shortAnswerInputId } from "../helpers";

import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { QuizSection } from "@/components/PupilComponents/Views/PupilLessonQuiz";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

type Props = {
  section: QuizSection;
  questionData: QuizQuestion;
  questionState: QuestionState;
  isReadOnly: boolean;
  onChange: () => void;
};

export const QuizShortQuestion = ({
  section,
  questionData,
  questionState,
  isReadOnly,
  onChange,
}: Props) => {
  const feedback =
    questionState.mode === "feedback" &&
    typeof questionState.feedback === "string"
      ? questionState.feedback
      : undefined;
  const isExitQuizReadOnly = isReadOnly && section === "exit-quiz";

  return (
    <OakFlex $flexDirection="column" $gap="spacing-24" $font="body-1">
      <OakLabel htmlFor={shortAnswerInputId(questionData.questionUid)}>
        <OakFlex $mt={["spacing-16", "spacing-48", "spacing-56"]}>
          <OakJauntyAngleLabel
            $background={
              section === "starter-quiz"
                ? "bg-decorative1-main"
                : "bg-decorative5-main"
            }
            $color="text-primary"
            label="Type your answer here"
          />
        </OakFlex>
      </OakLabel>
      <OakQuizTextInput
        id={shortAnswerInputId(questionData.questionUid)}
        key={shortAnswerInputId(questionData.questionUid)}
        name={shortAnswerInputId(questionData.questionUid)}
        onChange={onChange}
        disabled={isExitQuizReadOnly || questionState.mode === "feedback"}
        feedback={feedback}
        wrapperWidth={["100%", "spacing-640"]}
        isHighlighted={questionState.mode === "incomplete"}
      />
    </OakFlex>
  );
};
