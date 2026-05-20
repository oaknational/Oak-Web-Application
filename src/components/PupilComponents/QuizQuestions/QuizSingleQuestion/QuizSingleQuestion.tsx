import { useCallback, useMemo, useState } from "react";
import {
  OakFlex,
  OakJauntyAngleLabel,
  OakQuizRadioButton,
  OakRadioGroup,
  OakScaleImageButton,
} from "@oaknational/oak-components";

import { multipleChoiceAnswerId } from "../helpers";

import { CodeRenderWrapper } from "@/components/PupilComponents//CodeRendererWrapper/CodeRendererWrapper";
import { QuizSection } from "@/components/PupilComponents/Views/PupilLessonQuiz";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";
import {
  getStemImage,
  isImage,
  isText,
} from "@/components/PupilComponents/QuizUtils/stemUtils";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

type Props = {
  section: QuizSection;
  questionData: QuizQuestion;
  questionState: QuestionState;
  isReadOnly: boolean;
  onChange: () => void;
};

export const QuizSingleQuestion = ({
  section,
  questionData,
  questionState,
  isReadOnly,
  onChange,
}: Props) => {
  const answers = useMemo(
    () => questionData.answers?.["multiple-choice"] ?? [],
    [questionData],
  );
  const [scaled, setScaled] = useState<boolean[]>(answers.map(() => false));
  const isFeedbackMode = questionState.mode === "feedback";
  const isExitQuizReadOnly = isReadOnly && section === "exit-quiz";

  const toggleScaledAt = useCallback((index: number) => {
    setScaled((prev) =>
      prev.map((item, idx) => (idx === index ? !item : item)),
    );
  }, []);

  return (
    <OakFlex $flexDirection="column" $gap="spacing-24">
      <OakFlex $mt={["spacing-16", "spacing-48", "spacing-56"]}>
        <OakJauntyAngleLabel
          $background={
            section === "starter-quiz"
              ? "bg-decorative1-main"
              : "bg-decorative5-main"
          }
          $color="text-primary"
          label="Select one answer"
        />
      </OakFlex>
      <OakRadioGroup
        name={questionData.questionUid || "mcq-single-answer"}
        $flexDirection="column"
        $gap="spacing-16"
        onChange={onChange}
        disabled={isFeedbackMode || isExitQuizReadOnly}
        aria-labelledby={`${questionData.questionUid}-legend`}
      >
        {answers.map((answer, index) => {
          const label = answer.answer.find(isText);
          const image = getStemImage({
            stem: answer.answer.filter(isImage),
            minWidth: "spacing-240",
            scaled: Boolean(scaled[index]),
          });
          const resizeableImage = image ? (
            <OakFlex>
              {image}
              <OakFlex
                $width="spacing-32"
                $height="spacing-32"
                $pointerEvents="auto"
                $display={["none", "flex"]}
              >
                <OakScaleImageButton
                  onImageScaleCallback={(event) => {
                    event.stopPropagation();
                    toggleScaledAt(index);
                  }}
                  isExpanded={Boolean(scaled[index])}
                />
              </OakFlex>
            </OakFlex>
          ) : undefined;

          return (
            <OakQuizRadioButton
              id={multipleChoiceAnswerId(questionData.questionUid, index)}
              key={`${questionData.questionUid}-answer-${index}`}
              value={`${questionData.questionUid}: ${index}`}
              label={
                <CodeRenderWrapper>
                  <MathJaxWrap>{label?.text}</MathJaxWrap>
                </CodeRenderWrapper>
              }
              feedback={
                Array.isArray(questionState.feedback)
                  ? questionState.feedback[index]
                  : undefined
              }
              image={resizeableImage}
              isHighlighted={questionState.mode === "incomplete"}
            />
          );
        })}
      </OakRadioGroup>
    </OakFlex>
  );
};
