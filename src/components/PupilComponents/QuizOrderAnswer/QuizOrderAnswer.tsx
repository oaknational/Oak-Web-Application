import { useMemo, useState } from "react";
import { isArray } from "lodash";
import {
  OakBox,
  OakCodeRenderer,
  OakDraggableFeedback,
  OakDroppable,
  OakQuizOrder,
  OakQuizOrderProps,
} from "@oaknational/oak-components";

import { isOrderAnswer } from "../QuizUtils/answerTypeDiscriminators";

import { invariant } from "@/utils/invariant";
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";

export type QuizOrderAnswerProps = {
  onChange: () => void;
};

export const QuizOrderAnswer = ({ onChange }: QuizOrderAnswerProps) => {
  const { currentQuestionData, questionState, currentQuestionIndex } =
    useQuizEngineContext();
  invariant(currentQuestionData, "currentQuestionData is not defined");
  const answers = currentQuestionData.answers;
  const questionUid = currentQuestionData.questionUid;
  const currentQuestionState = questionState[currentQuestionIndex];
  const feedback = currentQuestionState?.feedback;

  invariant(
    answers && isOrderAnswer(answers),
    `current '${questionUid}' is not an order question`,
  );

  /**
   * Memoise the randomised order of items to preserve it across renders
   */
  const initialItems = useMemo(() => {
    const originalItems = answers.order.map((item, index) => {
      const label = item?.answer?.[0]?.text;
      invariant(
        label,
        `label is missing for option in question '${questionUid}'`,
      );

      return {
        id: (index + 1).toString(),
        label,
      };
    });
    let currentItems = originalItems.slice();

    // Randomise items while ensuring that the random order is not the same as the original order
    while (
      originalItems.length > 1 &&
      JSON.stringify(originalItems) === JSON.stringify(currentItems)
    ) {
      currentItems = currentItems.sort(() => 0.5 - Math.random());
    }

    return currentItems;
  }, [answers.order, questionUid]);
  const [currentOrder, setCurrentOrder] = useState(initialItems);

  const handleOrderChange = (items: OakQuizOrderProps["initialItems"]) => {
    onChange();
    setCurrentOrder(items);
  };

  if (feedback) {
    invariant(isArray(feedback), "question feedback is not an array");

    return (
      <OakBox>
        {currentOrder.map((item, i) => {
          const currentFeedback = feedback.at(i);
          invariant(currentFeedback, "feedback is missing");

          return (
            <OakDroppable key={item.id} $mb="space-between-s">
              <OakDraggableFeedback
                feedback={currentFeedback}
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
        onChange={handleOrderChange}
        isHighlighted={currentQuestionState?.mode === "incomplete"}
      />
      {currentOrder.map((item) => {
        return (
          <input
            key={item.id}
            type="hidden"
            name={`order-${questionUid}`}
            value={item.id}
            data-testid="order-input"
          />
        );
      })}
    </OakBox>
  );
};
