import { Fragment, useEffect, useMemo, useState } from "react";
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

import { isMatchAnswer } from "@/components/PupilComponents/QuizUtils/answerTypeDiscriminators";
import { getStemTextData } from "@/components/PupilComponents/QuizUtils/stemUtils";
import { invariant } from "@/utils/invariant";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import {
  QuestionFeedbackType,
  QuestionModeType,
  QuestionState,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import { QuizSection } from "@/components/PupilComponents/Views/PupilLessonQuiz";

const StyledUL = styled(OakUL)`
  list-style: none;
  padding-inline: 0;
`;

type Props = {
  section: QuizSection;
  questionData: QuizQuestion;
  questionState: QuestionState;
  isReadOnly: boolean;
  onQuestionModeChange: (mode: QuestionModeType) => void;
};

export const QuizMatchQuestion = ({
  section,
  questionData,
  questionState,
  isReadOnly,
  onQuestionModeChange,
}: Props) => {
  invariant(
    questionData.answers && isMatchAnswer(questionData.answers),
    `current '${questionData.questionUid}' is not a match question`,
  );
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const isExitQuizReadOnly = isReadOnly && section === "exit-quiz";

  const answers = Object.fromEntries(
    questionData.answers.match.map(({ correctChoice, matchOption }) => {
      invariant(matchOption, "matchOption is missing");
      const match = getStemTextData(matchOption);
      const choice = getStemTextData(correctChoice);
      invariant(match?.text, "match_text is missing");
      invariant(choice?.text, "choice_text is missing");
      return [match.text, choice.text];
    }),
  );

  const matchItems = useMemo(
    () =>
      Object.keys(answers).map((key, index) => ({
        id: index.toString(),
        label: <MathJaxWrap key={`match-${index}`}>{key}</MathJaxWrap>,
        announcement: key,
      })),
    [answers],
  );

  const choiceItems = useMemo(
    () =>
      Object.values(answers).map((value, index) => ({
        id: index.toString(),
        label: <MathJaxWrap key={`choice-${index}`}>{value}</MathJaxWrap>,
        announcement: value,
      })),
    [answers],
  );

  useEffect(() => {
    // Oak generates accessible labels after mount; copy those labels back into
    // our local option/slot metadata so screen-reader announcements stay useful.
    setDocumentLoaded(true);
    if (documentLoaded) {
      choiceItems.forEach((item) => {
        const element = document.getElementById(
          `oak-quiz-match-item-${item.id}`,
        );
        if (element) {
          const ariaLabel = element?.querySelector("[aria-label]")?.ariaLabel;
          if (ariaLabel) item.announcement = ariaLabel;
        }
      });
      matchItems.forEach((item) => {
        const element = document.getElementById(`droppable-${item.id}`);
        if (element) {
          const ariaLabel = element?.querySelector("[aria-label]")?.ariaLabel;
          if (ariaLabel) item.announcement = ariaLabel;
        }
      });
    }
  }, [documentLoaded, matchItems, choiceItems]);

  const [currentMatches, setCurrentMatches] = useState<Record<string, string>>(
    {},
  );

  const handleChange: OakQuizMatchProps["onChange"] = (matches) => {
    if (isExitQuizReadOnly) return;

    onQuestionModeChange(
      Object.keys(matches).length === matchItems.length ? "input" : "init",
    );
    setCurrentMatches(
      Object.fromEntries(
        Object.entries(matches).map(([matchId, item]) => [matchId, item.id]),
      ),
    );
  };

  if (questionState.feedback) {
    invariant(
      isArray(questionState.feedback),
      "question feedback is not an array",
    );

    return (
      <StyledUL>
        {matchItems.map(({ id, label }, index) => {
          const currentFeedback = questionState.feedback?.at(index);
          const choice = choiceItems.find(
            (item) => item.id === currentMatches[index],
          );
          const correctChoice = choiceItems.at(index);
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
              <OakDroppable key={id} $mb="spacing-16" labelSlot={label}>
                <OakDraggableFeedback
                  feedback={currentFeedback as QuestionFeedbackType}
                >
                  {choice.label}
                </OakDraggableFeedback>
              </OakDroppable>
              {currentFeedback === "incorrect" && (
                <OakBox $mb="spacing-24" $pl="spacing-20">
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
        onChange={isExitQuizReadOnly ? undefined : handleChange}
        isHighlighted={questionState.mode === "incomplete"}
      />
      {Object.entries(currentMatches).map(([matchId, choiceId]) => (
        <Fragment key={matchId}>
          <input
            type="hidden"
            name={`match-${questionData.questionUid}-match`}
            value={matchId}
            data-testid="match-input"
          />
          <input
            type="hidden"
            name={`match-${questionData.questionUid}-choice`}
            value={choiceId}
            data-testid="choice-input"
          />
        </Fragment>
      ))}
    </OakBox>
  );
};
