import {
  OakBox,
  OakDraggableFeedback,
  OakDroppable,
  OakQuizOrder,
  OakQuizOrderProps,
} from "@oaknational/oak-components";
import { useMemo, useState } from "react";
import { isArray } from "lodash";

import { isOrderAnswer } from "../QuizUtils/answerTypeDiscriminators";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { useInitialChange } from "@/components/PupilComponents/QuizUtils/useInitialChange";
import OakError from "@/errors/OakError";

export type QuizOrderAnswerProps = {
  onInitialChange?: () => void;
  onChange?: () => void;
};

export const QuizOrderAnswer = (props: QuizOrderAnswerProps) => {
  const { handleOnChange: handleInitialChange } = useInitialChange(props);
  const { currentQuestionData, questionState, currentQuestionIndex } =
    useQuizEngineContext();
  invariant(currentQuestionData, "currentQuestionData is not defined");
  const answers = currentQuestionData.answers;
  const questionUid = currentQuestionData.questionUid;
  const feedback = questionState[currentQuestionIndex]?.feedback;

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
    handleInitialChange();
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
            <OakDroppable key={item.id} $mb="space-between-xs">
              <OakDraggableFeedback
                feedback={currentFeedback}
                data-testid="order-item-feedback"
              >
                {item.label}
              </OakDraggableFeedback>
            </OakDroppable>
          );
        })}
      </OakBox>
    );
  }

  return (
    <OakBox>
      <OakQuizOrder initialItems={initialItems} onChange={handleOrderChange} />
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

/**
 * Throws if condition is false
 * while narrowing the type to something truthy
 */
function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new OakError({
      code: "misc/unexpected-type",
      meta: { message },
    });
  }
}
