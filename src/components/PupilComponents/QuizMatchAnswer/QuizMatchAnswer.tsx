import { Fragment, useEffect, useMemo, useState } from "react";
import { isArray } from "lodash";
import styled from "styled-components";


import { isMatchAnswer } from "../QuizUtils/answerTypeDiscriminators";
import { getStemTextData } from "../QuizUtils/stemUtils";

import {
  OakBox,
  OakDraggableFeedback,
  OakDroppable,
  OakQuizMatch,
  OakQuizMatchProps,
  OakUL,
} from "@oaknational/oak-components";
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { invariant } from "@/utils/invariant";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

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
  const currentQuestionState = questionState[currentQuestionIndex];
  const feedback = currentQuestionState?.feedback;
  const [documentLoaded, setDocumentLoaded] = useState(false);

  invariant(
    currentQuestionData.answers && isMatchAnswer(currentQuestionData.answers),
    `current '${questionUid}' is not a match question`,
  );

  const answers = Object.fromEntries(
    currentQuestionData.answers.match.map(({ correctChoice, matchOption }) => {
      invariant(matchOption, "matchOption is missing");

      const match = getStemTextData(matchOption);
      const choice = getStemTextData(correctChoice);

      invariant(match?.text, "match_text is missing");
      invariant(choice?.text, "choice_text is missing");

      return [match.text, choice.text];
    }),
  );

  const matchItems: { id: string; label: JSX.Element; announcement: string }[] =
    useMemo(() => {
      const matchItems: {
        id: string;
        label: JSX.Element;
        announcement: string;
      }[] = [];
      Object.entries(answers).forEach(([key], index) => {
        matchItems.push({
          id: index.toString(),
          label: <MathJaxWrap key={`match-${index}`}>{key}</MathJaxWrap>,
          announcement: key,
        });
      });
      return matchItems;
    }, [answers]);

  const choiceItems: {
    id: string;
    label: JSX.Element;
    announcement: string;
  }[] = useMemo(() => {
    const choiceItems: {
      id: string;
      label: JSX.Element;
      announcement: string;
    }[] = [];
    Object.entries(answers).forEach(([value], index) => {
      choiceItems.push({
        id: index.toString(),
        label: <MathJaxWrap key={`choice-${index}`}>{value}</MathJaxWrap>,
        announcement: value,
      });
    });
    return choiceItems;
  }, [answers]);

  Object.entries(answers).forEach(([key, value], index) => {
    matchItems.push({
      id: index.toString(),
      label: <MathJaxWrap key={`match-${index}`}>{key}</MathJaxWrap>,
      announcement: key,
    });
    choiceItems.push({
      id: index.toString(),
      label: <MathJaxWrap key={`choice-${index}`}>{value}</MathJaxWrap>,
      announcement: value,
    });
  });

  useEffect(() => {
    setDocumentLoaded(true);
    if (documentLoaded) {
      choiceItems.forEach((item) => {
        const element = document.getElementById(
          `oak-quiz-match-item-${item.id}`,
        );
        if (element) {
          const ariaLabel =
            element?.children?.[0]?.children[1]?.children[0]?.children[0]
              ?.ariaLabel;
          if (ariaLabel) {
            item.announcement = ariaLabel;
          }
        }
      });

      matchItems.forEach((item) => {
        const element = document.getElementById(`droppable-${item.id}`);
        if (element) {
          const ariaLabel =
            element?.children[1]?.children[0]?.children[0]?.ariaLabel;
          if (ariaLabel) {
            item.announcement = ariaLabel;
          }
        }
      });
    }
  }, [documentLoaded, matchItems, choiceItems]);

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
        isHighlighted={currentQuestionState?.mode === "incomplete"}
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
