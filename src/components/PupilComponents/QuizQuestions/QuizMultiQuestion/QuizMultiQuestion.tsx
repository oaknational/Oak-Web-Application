import { useCallback, useMemo, useState } from "react";
import {
  OakCloudinaryImage,
  OakCodeRenderer,
  OakFlex,
  OakJauntyAngleLabel,
  OakQuizCheckBox,
  OakScaleImageButton,
} from "@oaknational/oak-components";

import { multipleChoiceAnswerId } from "../helpers";

import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import {
  isImage,
  isText,
} from "@/components/PupilComponents/QuizUtils/stemUtils";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
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

export const QuizMultiQuestion = ({
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
  const numCorrectAnswers = answers.filter(
    (answer) => answer.answerIsCorrect,
  ).length;
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
          label={`Select ${numCorrectAnswers} answers`}
        />
      </OakFlex>
      <OakFlex
        $flexDirection="column"
        $gap="spacing-16"
        role="group"
        aria-labelledby={`${questionData.questionUid}-legend`}
      >
        {answers.map((answer, index) => {
          const textAnswer = answer.answer.find(isText);
          const imageAnswer = answer.answer.find(isImage)?.imageObject;
          const image = imageAnswer?.publicId ? (
            <OakFlex>
              <OakCloudinaryImage
                cloudinaryId={imageAnswer.publicId}
                alt="An image in a quiz"
                width={imageAnswer.width}
                height={imageAnswer.height}
                $minWidth={scaled[index] ? "spacing-360" : "spacing-240"}
                placeholder="oak"
                sizes={getSizes(["100vw", 1200])}
                role="presentation"
              />
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
            <MathJaxWrap
              key={multipleChoiceAnswerId(questionData.questionUid, index)}
            >
              <OakQuizCheckBox
                id={multipleChoiceAnswerId(questionData.questionUid, index)}
                displayValue={
                  textAnswer ? (
                    <OakCodeRenderer string={textAnswer.text} />
                  ) : (
                    " "
                  )
                }
                value={`answer-${index}`}
                feedback={
                  isFeedbackMode && Array.isArray(questionState.feedback)
                    ? questionState.feedback[index]
                    : undefined
                }
                image={image}
                onChange={onChange}
                disabled={isExitQuizReadOnly || isFeedbackMode}
                isHighlighted={questionState.mode === "incomplete"}
              />
            </MathJaxWrap>
          );
        })}
      </OakFlex>
    </OakFlex>
  );
};
