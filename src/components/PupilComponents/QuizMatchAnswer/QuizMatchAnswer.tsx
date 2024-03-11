import { Fragment, useState } from "react";
import { isArray } from "lodash";

import { isMatchAnswer } from "../QuizUtils/answerTypeDiscriminators";
import { getStemTextData } from "../QuizUtils/stemUtils";

import {
  OakBox,
  OakDraggableFeedback,
  OakDroppable,
  OakQuizMatch,
  OakQuizMatchProps,
} from "@oaknational/oak-components";
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { useInitialChange } from "@/components/PupilComponents/QuizUtils/useInitialChange";
import { invariant } from "@/components/PupilComponents/pupilUtils/invariant";

export type QuizMatchAnswerProps = {
  onInitialChange?: () => void;
  onChange?: () => void;
};

export const QuizMatchAnswer = ({
  onChange,
  onInitialChange,
}: QuizMatchAnswerProps) => {
  const { handleOnChange: handleInitialChange } = useInitialChange({
    onChange,
    onInitialChange,
  });
  const { currentQuestionData, questionState, currentQuestionIndex } =
    useQuizEngineContext();
  invariant(currentQuestionData, "currentQuestionData is not defined");
  const questionUid = currentQuestionData.questionUid;
  const feedback = questionState[currentQuestionIndex]?.feedback;

  invariant(
    currentQuestionData.answers && isMatchAnswer(currentQuestionData.answers),
    `current '${questionUid}' is not a match question`,
  );

  const answers = Object.fromEntries(
    currentQuestionData.answers.match.map(
      ({ correct_choice, match_option }) => {
        const matchText = getStemTextData(match_option)?.text;
        const choiceText = getStemTextData(correct_choice)?.text;

        invariant(matchText, "match_text is missing");
        invariant(choiceText, "choice_text is missing");

        return [matchText, choiceText];
      },
    ),
  );
  const matchItems = Object.keys(answers).map((label, index) => ({
    id: index.toString(),
    label,
  }));
  const choiceItems = Object.values(answers).map((label, index) => ({
    id: index.toString(),
    label,
  }));

  const [currentMatches, setCurrentMatches] = useState<{
    [matchId: string]: string;
  }>({});

  const handleOrderChange: OakQuizMatchProps["onChange"] = (matches) => {
    handleInitialChange();
    setCurrentMatches(
      Object.fromEntries(
        Object.entries(matches).map(([matchId, item]) => [matchId, item.id]),
      ),
    );
  };

  if (feedback) {
    invariant(isArray(feedback), "question feedback is not an array");

    return (
      <OakBox>
        {matchItems.map(({ id, label }, i) => {
          const currentFeedback = feedback.at(i);
          invariant(currentFeedback, "feedback is missing");
          const choice = choiceItems.find(
            (choice) => choice.id === currentMatches[i],
          );

          return (
            <OakDroppable
              key={id}
              $mb="space-between-s"
              labelSlot={label}
              data-testid="match-feedback"
            >
              <OakDraggableFeedback feedback={currentFeedback}>
                {choice?.label}
              </OakDraggableFeedback>
            </OakDroppable>
          );
        })}
      </OakBox>
    );
  }

  return (
    <OakBox>
      <OakQuizMatch
        initialOptions={choiceItems}
        initialSlots={matchItems}
        onChange={handleOrderChange}
      />
      {Object.entries(currentMatches).map(([matchId, choiceId]) => {
        return (
          <Fragment key={matchId}>
            <input
              type="hidden"
              name={`match-${questionUid}-match`}
              value={matchId}
              data-testid="match-input"
            />
            <input
              type="hidden"
              name={`match-${questionUid}-choice`}
              value={choiceId}
              data-testid="choice-input"
            />
          </Fragment>
        );
      })}
    </OakBox>
  );
};
