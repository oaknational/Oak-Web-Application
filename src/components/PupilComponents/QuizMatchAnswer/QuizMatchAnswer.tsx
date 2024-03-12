import { Fragment, useState } from "react";
import { isArray } from "lodash";
import styled from "styled-components";
import {
  OakBox,
  OakDraggableFeedback,
  OakDroppable,
  OakQuizMatch,
  OakQuizMatchProps,
  OakUL,
} from "@oaknational/oak-components";

import { isMatchAnswer } from "../QuizUtils/answerTypeDiscriminators";
import { getStemTextData } from "../QuizUtils/stemUtils";

import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { invariant } from "@/components/PupilComponents/pupilUtils/invariant";

const StyledUL = styled(OakUL)`
  list-style: none;
  padding-inline: 0;
`;

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
      <StyledUL>
        {matchItems.map(({ id, label }, i) => {
          const currentFeedback = feedback.at(i);
          const choice = choiceItems.find(
            (choice) => choice.id === currentMatches[i],
          );
          const correctChoice = choiceItems.at(i);
          invariant(
            currentFeedback,
            `feedback is missing for match '${label}'`,
          );
          invariant(choice, `choice is missing for match '${label}'`);
          invariant(
            correctChoice,
            `correctChoice is missing for match '${label}'`,
          );

          return (
            <li key={id} data-testid="match-feedback">
              <OakDroppable key={id} $mb="space-between-s" labelSlot={label}>
                <OakDraggableFeedback feedback={currentFeedback}>
                  {choice.label}
                </OakDraggableFeedback>
              </OakDroppable>
              {currentFeedback === "incorrect" && (
                <OakBox $mb="space-between-m" $pl="inner-padding-l">
                  <strong>Correct answer:</strong> {correctChoice.label} -{" "}
                  {label}
                </OakBox>
              )}
            </li>
          );
        })}
      </StyledUL>
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
