import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";

import { QuizMultiQuestion } from "./QuizMultiQuestion";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

const mcqTextQuestion = quizQuestions[0];
const mcqImageQuestion = quizQuestions[2];
if (!mcqTextQuestion || !mcqImageQuestion) {
  throw new Error("MCQ fixtures missing");
}

const baseState: QuestionState = {
  mode: "init",
  grade: 0,
  offerHint: false,
};

describe("QuizMultiQuestion", () => {
  it("shows the number of correct answers to select in the label", () => {
    const { getByText } = renderWithTheme(
      <QuizMultiQuestion
        section="starter-quiz"
        questionData={mcqTextQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={jest.fn()}
      />,
    );
    expect(getByText("Select 1 answers")).toBeInTheDocument();
  });

  it("renders one checkbox per answer", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizMultiQuestion
        section="starter-quiz"
        questionData={mcqTextQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={jest.fn()}
      />,
    );
    expect(getAllByRole("checkbox")).toHaveLength(4);
  });

  it("renders images for image-based answers", () => {
    const { getAllByAltText } = renderWithTheme(
      <QuizMultiQuestion
        section="starter-quiz"
        questionData={mcqImageQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={jest.fn()}
      />,
    );
    expect(getAllByAltText("An image in a quiz")).toHaveLength(3);
  });

  it("fires onChange when a checkbox is toggled", () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <QuizMultiQuestion
        section="starter-quiz"
        questionData={mcqTextQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={onChange}
      />,
    );
    const firstCheckbox = getAllByRole("checkbox")[0];
    if (!firstCheckbox) throw new Error("expected first checkbox");
    fireEvent.click(firstCheckbox);
    expect(onChange).toHaveBeenCalled();
  });

  it("disables all checkboxes in feedback mode", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizMultiQuestion
        section="starter-quiz"
        questionData={mcqTextQuestion}
        questionState={{
          ...baseState,
          mode: "feedback",
          feedback: ["incorrect", "incorrect", "correct", "incorrect"],
        }}
        isReadOnly={false}
        onChange={jest.fn()}
      />,
    );
    for (const checkbox of getAllByRole("checkbox")) {
      expect(checkbox).toBeDisabled();
    }
  });

  it("disables all checkboxes when read-only in exit-quiz", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizMultiQuestion
        section="exit-quiz"
        questionData={mcqTextQuestion}
        questionState={baseState}
        isReadOnly={true}
        onChange={jest.fn()}
      />,
    );
    for (const checkbox of getAllByRole("checkbox")) {
      expect(checkbox).toBeDisabled();
    }
  });
});
