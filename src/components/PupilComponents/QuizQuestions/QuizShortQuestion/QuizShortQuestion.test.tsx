import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";

import { QuizShortQuestion } from "./QuizShortQuestion";

import { shortAnswerInputId } from "@/components/PupilComponents/QuizQuestions/helpers";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

const shortQuestion = quizQuestions[5];
if (!shortQuestion) throw new Error("short-answer fixture missing");

const baseState: QuestionState = {
  mode: "init",
  grade: 0,
  offerHint: false,
};

describe("QuizShortQuestion", () => {
  it("renders the input with the expected id", () => {
    const { getByRole } = renderWithTheme(
      <QuizShortQuestion
        section="starter-quiz"
        questionData={shortQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={jest.fn()}
      />,
    );
    expect(getByRole("textbox")).toHaveAttribute(
      "id",
      shortAnswerInputId(shortQuestion.questionUid),
    );
  });

  it("fires onChange when the input changes", () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <QuizShortQuestion
        section="starter-quiz"
        questionData={shortQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={onChange}
      />,
    );
    fireEvent.change(getByRole("textbox"), { target: { value: "earth" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("disables the input in feedback mode", () => {
    const { getByRole } = renderWithTheme(
      <QuizShortQuestion
        section="starter-quiz"
        questionData={shortQuestion}
        questionState={{ ...baseState, mode: "feedback", feedback: "correct" }}
        isReadOnly={false}
        onChange={jest.fn()}
      />,
    );
    expect(getByRole("textbox")).toBeDisabled();
  });

  it("disables the input when read-only in exit-quiz", () => {
    const { getByRole } = renderWithTheme(
      <QuizShortQuestion
        section="exit-quiz"
        questionData={shortQuestion}
        questionState={baseState}
        isReadOnly={true}
        onChange={jest.fn()}
      />,
    );
    expect(getByRole("textbox")).toBeDisabled();
  });

  it("does not disable the input when read-only but in starter-quiz", () => {
    const { getByRole } = renderWithTheme(
      <QuizShortQuestion
        section="starter-quiz"
        questionData={shortQuestion}
        questionState={baseState}
        isReadOnly={true}
        onChange={jest.fn()}
      />,
    );
    expect(getByRole("textbox")).not.toBeDisabled();
  });
});
