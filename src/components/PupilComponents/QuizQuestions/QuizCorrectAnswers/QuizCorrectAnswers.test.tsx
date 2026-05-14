import "@testing-library/jest-dom";
import type { ReactNode } from "react";

import { QuizCorrectAnswers } from "./QuizCorrectAnswers";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";
import { imageObject } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

jest.mock("@/browser-lib/mathjax/MathJaxWrap", () => ({
  MathJaxWrap: ({ children }: { children: ReactNode }) => (
    <span data-testid="mathjax-wrap">{children}</span>
  ),
}));

const baseState: QuestionState = {
  mode: "feedback",
  grade: 0,
  offerHint: false,
};

describe("QuizCorrectAnswers", () => {
  it("renders nothing when no questionState is provided", () => {
    const { container } = renderWithTheme(<QuizCorrectAnswers />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when correctAnswer is missing", () => {
    const { container } = renderWithTheme(
      <QuizCorrectAnswers questionState={baseState} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a single correct answer from an array", () => {
    const { getByText } = renderWithTheme(
      <QuizCorrectAnswers
        questionState={{ ...baseState, correctAnswer: ["earth"] }}
      />,
    );
    expect(getByText(/Correct answer:/)).toBeInTheDocument();
    expect(getByText(/earth/)).toBeInTheDocument();
  });

  it("renders multiple correct answers joined by commas", () => {
    const { getByText } = renderWithTheme(
      <QuizCorrectAnswers
        questionState={{
          ...baseState,
          correctAnswer: ["earth", "wind", "fire"],
        }}
      />,
    );
    expect(getByText(/Correct answers:/)).toBeInTheDocument();
    expect(getByText(/earth, wind, fire/)).toBeInTheDocument();
  });

  it("filters out non-string entries when joining multiple answers", () => {
    const { getByText } = renderWithTheme(
      <QuizCorrectAnswers
        questionState={{
          ...baseState,
          correctAnswer: ["earth", undefined, "fire"],
        }}
      />,
    );
    expect(getByText(/earth, fire/)).toBeInTheDocument();
  });

  it("renders nothing when the array's first item is an image object", () => {
    const { container } = renderWithTheme(
      <QuizCorrectAnswers
        questionState={{
          ...baseState,
          correctAnswer: [{ type: "image", imageObject }],
        }}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a plain string correct answer", () => {
    const { getByText } = renderWithTheme(
      <QuizCorrectAnswers
        questionState={{ ...baseState, correctAnswer: "earth" }}
      />,
    );
    expect(getByText(/Correct answer:/)).toBeInTheDocument();
    expect(getByText(/earth/)).toBeInTheDocument();
  });

  it("renders string answers through MathJax wrappers", () => {
    const { getByText, getAllByTestId } = renderWithTheme(
      <QuizCorrectAnswers
        questionState={{
          mode: "feedback",
          grade: 0,
          offerHint: false,
          correctAnswer: ["\\(x + 1\\)", "\\(x + 2\\)"],
        }}
      />,
    );

    expect(getByText("Correct answers:")).toBeInTheDocument();
    expect(getByText("\\(x + 1\\)")).toBeInTheDocument();
    expect(getByText("\\(x + 2\\)")).toBeInTheDocument();
    expect(getAllByTestId("mathjax-wrap")).toHaveLength(2);
  });
});
