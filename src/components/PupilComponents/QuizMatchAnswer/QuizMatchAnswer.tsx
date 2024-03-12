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
import { invariant } from "@/components/PupilComponents/pupilUtils/invariant";

export const QuizMatchAnswer = () => {
  const {
    currentQuestionData,
    questionState,
    currentQuestionIndex,
    updateQuestionMode,
  } = useQuizEngineContext();
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
        const match = getStemTextData(match_option);
        const choice = getStemTextData(correct_choice);

        invariant(match?.text, "match_text is missing");
        invariant(choice?.text, "choice_text is missing");

        return [match.text, choice.text];
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
  const handleChange: OakQuizMatchProps["onChange"] = (matches) => {
    // Update the question mode to input if all matches have been made
    // to enable the question to be submitted
    updateQuestionMode(
      Object.keys(matches).length === matchItems.length ? "input" : "init",
    );
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
          const choice = choiceItems.find(
            (choice) => choice.id === currentMatches[i],
          );
          invariant(
            currentFeedback,
            `feedback is missing for match '${label}'`,
          );
          invariant(choice, `choice is missing for match '${label}'`);

          return (
            <OakDroppable
              key={id}
              $mb="space-between-s"
              labelSlot={label}
              data-testid="match-feedback"
            >
              <OakDraggableFeedback feedback={currentFeedback}>
                {choice.label}
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
        onChange={handleChange}
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
