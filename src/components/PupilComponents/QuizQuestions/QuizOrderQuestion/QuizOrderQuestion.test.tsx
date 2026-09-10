import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import * as oakComponents from "@oaknational/oak-components";

import { QuizOrderQuestion } from "./QuizOrderQuestion";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

jest.mock("@oaknational/oak-components", () => ({
  ...jest.requireActual("@oaknational/oak-components"),
  OakQuizOrder: jest.fn().mockReturnValue(null),
}));

const orderQuestion = quizQuestions[4];
if (!orderQuestion) throw new Error("order fixture missing");

const baseState: QuestionState = {
  mode: "init",
  grade: 0,
  offerHint: false,
};

describe("QuizOrderQuestion", () => {
  let onChange: oakComponents.OakQuizOrderProps["onChange"];

  beforeEach(() => {
    jest.spyOn(oakComponents, "OakQuizOrder").mockImplementation((props) => {
      onChange = props.onChange;
      return <div data-testid="quiz-order" />;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders a hidden input for each item", () => {
    const { getAllByTestId } = renderWithTheme(
      <QuizOrderQuestion
        section="starter-quiz"
        questionData={orderQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={jest.fn()}
        onQuestionModeChange={jest.fn()}
      />,
    );
    expect(getAllByTestId("order-input")).toHaveLength(4);
  });

  it("fires onChange and onQuestionModeChange when the order changes", () => {
    const onChangeProp = jest.fn();
    const onModeChange = jest.fn();
    renderWithTheme(
      <QuizOrderQuestion
        section="starter-quiz"
        questionData={orderQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={onChangeProp}
        onQuestionModeChange={onModeChange}
      />,
    );
    act(() => {
      onChange?.([
        { id: "2", label: "Edward the Confessor became king." },
        { id: "1", label: "Edward the Confessor was exiled in Normandy." },
        { id: "3", label: "Harold Godwinson travelled to Normandy." },
        { id: "4", label: "Edward the Confessor died." },
      ]);
    });
    expect(onChangeProp).toHaveBeenCalled();
    expect(onModeChange).toHaveBeenCalledWith("input");
  });

  it("does not fire callbacks when read-only in exit-quiz", () => {
    const onChangeProp = jest.fn();
    const onModeChange = jest.fn();
    renderWithTheme(
      <QuizOrderQuestion
        section="exit-quiz"
        questionData={orderQuestion}
        questionState={baseState}
        isReadOnly={true}
        onChange={onChangeProp}
        onQuestionModeChange={onModeChange}
      />,
    );
    expect(onChange).toBeUndefined();
    expect(onChangeProp).not.toHaveBeenCalled();
    expect(onModeChange).not.toHaveBeenCalled();
  });

  it("renders feedback for each item when feedback is present", () => {
    const { getAllByTestId } = renderWithTheme(
      <QuizOrderQuestion
        section="starter-quiz"
        questionData={orderQuestion}
        questionState={{
          ...baseState,
          mode: "feedback",
          feedback: ["correct", "correct", "incorrect", "correct"],
        }}
        isReadOnly={false}
        onChange={jest.fn()}
        onQuestionModeChange={jest.fn()}
      />,
    );
    expect(getAllByTestId("order-item-feedback")).toHaveLength(4);
  });
});
