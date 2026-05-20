import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";

import { QuizSingleQuestion } from "./QuizSingleQuestion";

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

describe("QuizSingleQuestion", () => {
  it("renders one radio button per answer with the answer text as label", () => {
    const { getAllByRole, getByLabelText } = renderWithTheme(
      <QuizSingleQuestion
        section="starter-quiz"
        questionData={mcqTextQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={jest.fn()}
      />,
    );
    expect(getAllByRole("radio")).toHaveLength(4);
    expect(
      getByLabelText(
        "a group of words that contains a verb and makes complete sense",
      ),
    ).toBeInTheDocument();
  });

  it("renders images for image-based answers", () => {
    const { getAllByAltText } = renderWithTheme(
      <QuizSingleQuestion
        section="starter-quiz"
        questionData={mcqImageQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={jest.fn()}
      />,
    );
    expect(getAllByAltText("An image in a quiz")).toHaveLength(3);
  });

  it("fires onChange when a radio is selected", () => {
    const onChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <QuizSingleQuestion
        section="starter-quiz"
        questionData={mcqTextQuestion}
        questionState={baseState}
        isReadOnly={false}
        onChange={onChange}
      />,
    );
    const firstRadio = getAllByRole("radio")[0];
    if (!firstRadio) throw new Error("expected first radio");
    fireEvent.click(firstRadio);
    expect(onChange).toHaveBeenCalled();
  });

  it("disables all radios in feedback mode", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizSingleQuestion
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
    for (const radio of getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("disables all radios when read-only in exit-quiz", () => {
    const { getAllByRole } = renderWithTheme(
      <QuizSingleQuestion
        section="exit-quiz"
        questionData={mcqTextQuestion}
        questionState={baseState}
        isReadOnly={true}
        onChange={jest.fn()}
      />,
    );
    for (const radio of getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });
});
