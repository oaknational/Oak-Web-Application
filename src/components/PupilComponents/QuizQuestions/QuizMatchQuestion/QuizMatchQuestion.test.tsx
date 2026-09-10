import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import * as oakComponents from "@oaknational/oak-components";

import { QuizMatchQuestion } from "./QuizMatchQuestion";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

jest.mock("@oaknational/oak-components", () => ({
  ...jest.requireActual("@oaknational/oak-components"),
  OakQuizMatch: jest.fn().mockReturnValue(null),
}));

const matchQuestion = quizQuestions[3];
if (!matchQuestion) throw new Error("match fixture missing");

const baseState: QuestionState = {
  mode: "init",
  grade: 0,
  offerHint: false,
};

const allCorrectMatches = {
  "0": { label: "grass", id: "0", announcement: "grass" },
  "1": { label: "cow", id: "1", announcement: "cow" },
  "2": { label: "human", id: "2", announcement: "human" },
};

describe("QuizMatchQuestion", () => {
  let onChange: oakComponents.OakQuizMatchProps["onChange"];

  beforeEach(() => {
    jest.spyOn(oakComponents, "OakQuizMatch").mockImplementation((props) => {
      onChange = props.onChange;
      return <div data-testid="quiz-match" />;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders no hidden inputs before any matches are made", () => {
    const { queryAllByTestId } = renderWithTheme(
      <QuizMatchQuestion
        section="starter-quiz"
        questionData={matchQuestion}
        questionState={baseState}
        isReadOnly={false}
        onQuestionModeChange={jest.fn()}
      />,
    );
    expect(queryAllByTestId("match-input")).toHaveLength(0);
    expect(queryAllByTestId("choice-input")).toHaveLength(0);
  });

  it("emits hidden inputs after onChange supplies matches", () => {
    const { getAllByTestId } = renderWithTheme(
      <QuizMatchQuestion
        section="starter-quiz"
        questionData={matchQuestion}
        questionState={baseState}
        isReadOnly={false}
        onQuestionModeChange={jest.fn()}
      />,
    );
    act(() => {
      onChange?.(allCorrectMatches);
    });
    expect(getAllByTestId("match-input")).toHaveLength(3);
    expect(getAllByTestId("choice-input")).toHaveLength(3);
  });

  it('sets question mode to "input" only when all slots are matched', () => {
    const onModeChange = jest.fn();
    renderWithTheme(
      <QuizMatchQuestion
        section="starter-quiz"
        questionData={matchQuestion}
        questionState={baseState}
        isReadOnly={false}
        onQuestionModeChange={onModeChange}
      />,
    );
    act(() => {
      onChange?.({ "0": { label: "grass", id: "0", announcement: "grass" } });
    });
    expect(onModeChange).toHaveBeenLastCalledWith("init");
    act(() => {
      onChange?.(allCorrectMatches);
    });
    expect(onModeChange).toHaveBeenLastCalledWith("input");
  });

  it("does not respond to onChange when read-only in exit-quiz", () => {
    const onModeChange = jest.fn();
    const { queryAllByTestId } = renderWithTheme(
      <QuizMatchQuestion
        section="exit-quiz"
        questionData={matchQuestion}
        questionState={baseState}
        isReadOnly={true}
        onQuestionModeChange={onModeChange}
      />,
    );
    expect(onChange).toBeUndefined();
    expect(queryAllByTestId("match-input")).toHaveLength(0);
    expect(onModeChange).not.toHaveBeenCalled();
  });

  it("renders feedback rows for each match when feedback is present", () => {
    const { getAllByTestId, rerender } = renderWithTheme(
      <QuizMatchQuestion
        section="starter-quiz"
        questionData={matchQuestion}
        questionState={baseState}
        isReadOnly={false}
        onQuestionModeChange={jest.fn()}
      />,
    );
    act(() => {
      onChange?.(allCorrectMatches);
    });
    rerender(
      <QuizMatchQuestion
        section="starter-quiz"
        questionData={matchQuestion}
        questionState={{
          ...baseState,
          mode: "feedback",
          feedback: ["correct", "incorrect", "incorrect"],
        }}
        isReadOnly={false}
        onQuestionModeChange={jest.fn()}
      />,
    );
    expect(getAllByTestId("match-feedback")).toHaveLength(3);
  });
});
