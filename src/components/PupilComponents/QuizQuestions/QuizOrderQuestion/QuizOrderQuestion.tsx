import { useEffect, useMemo, useState } from "react";
import { isArray } from "lodash";
import {
  OakBox,
  OakCodeRenderer,
  OakDraggableFeedback,
  OakDroppable,
  OakQuizOrder,
  OakQuizOrderProps,
} from "@oaknational/oak-components";

import { isOrderAnswer } from "@/components/PupilComponents/QuizUtils/answerTypeDiscriminators";
import { invariant } from "@/utils/invariant";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import {
  QuestionFeedbackType,
  QuestionModeType,
  QuestionState,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import { QuizSection } from "@/components/PupilComponents/Views/PupilLessonQuiz";

type Props = {
  section: QuizSection;
  questionData: QuizQuestion;
  questionState: QuestionState;
  isReadOnly: boolean;
  onChange: () => void;
  onQuestionModeChange: (mode: QuestionModeType) => void;
};

export const QuizOrderQuestion = ({
  section,
  questionData,
  questionState,
  isReadOnly,
  onChange,
  onQuestionModeChange,
}: Props) => {
  const answers = questionData.answers;
  invariant(
    answers && isOrderAnswer(answers),
    `current '${questionData.questionUid}' is not an order question`,
  );

  // Keep one shuffled order for the lifetime of this question so re-renders
  // do not reshuffle the items while the pupil is interacting with them.
  const initialItems = useMemo(() => {
    const originalItems = answers.order.map((item, index) => {
      const label = item?.answer?.[0]?.text;
      invariant(
        label,
        `label is missing for option in question '${questionData.questionUid}'`,
      );

      return {
        id: (index + 1).toString(),
        label,
      };
    });
    let currentItems = originalItems.slice();

    while (
      originalItems.length > 1 &&
      JSON.stringify(originalItems) === JSON.stringify(currentItems)
    ) {
      currentItems = currentItems.sort(() => 0.5 - Math.random());
    }

    return currentItems;
  }, [answers.order, questionData.questionUid]);

  const [currentOrder, setCurrentOrder] = useState(initialItems);
  const [announcements, setAnnouncements] = useState(currentOrder);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const isExitQuizReadOnly = isReadOnly && section === "exit-quiz";

  useEffect(() => {
    // Read the generated aria labels from Oak's drag-and-drop DOM once it has
    // mounted so announcements stay aligned with the current order.
    setDocumentLoaded(true);
    if (documentLoaded) {
      const announcementItems: { id: string; label: string }[] = [];
      currentOrder.forEach((item) => {
        const element = document.getElementById(
          `oak-quiz-order-item-${item.id}`,
        );
        if (element) {
          const ariaLabel = element?.querySelector("[aria-label]")?.ariaLabel;
          announcementItems.push({
            id: item.id,
            label: ariaLabel || item.label,
          });
        }
      });
      setAnnouncements(announcementItems);
    }
  }, [currentOrder, documentLoaded]);

  const handleOrderChange = (items: OakQuizOrderProps["initialItems"]) => {
    if (isExitQuizReadOnly) return;
    onQuestionModeChange("input");
    onChange();
    setCurrentOrder(items);
  };

  if (questionState.feedback) {
    invariant(
      isArray(questionState.feedback),
      "question feedback is not an array",
    );

    return (
      <OakBox>
        {currentOrder.map((item, index) => {
          const currentFeedback = questionState.feedback?.at(index);
          invariant(currentFeedback, "feedback is missing");

          return (
            <OakDroppable key={item.id} $mb="spacing-16">
              <OakDraggableFeedback
                feedback={currentFeedback as QuestionFeedbackType}
                data-testid="order-item-feedback"
              >
                <OakCodeRenderer string={item.label} />
              </OakDraggableFeedback>
            </OakDroppable>
          );
        })}
      </OakBox>
    );
  }

  return (
    <OakBox>
      <OakQuizOrder
        initialItems={initialItems}
        onChange={isExitQuizReadOnly ? undefined : handleOrderChange}
        isHighlighted={questionState.mode === "incomplete"}
        announcements={announcements}
      />
      {currentOrder.map((item) => (
        <input
          key={item.id}
          type="hidden"
          name={`order-${questionData.questionUid}`}
          value={item.id}
          data-testid="order-input"
        />
      ))}
    </OakBox>
  );
};
