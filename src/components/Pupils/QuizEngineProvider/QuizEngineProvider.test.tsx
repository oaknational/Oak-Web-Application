import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { QuizEngineProvider } from "./QuizEngineProvider";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const questionsArray = quizQuestions || [];

describe("QuizEngineProvider", () => {
  it("should render", () => {
    const { getByText } = render(
      <QuizEngineProvider questionsArray={questionsArray}>
        <div>Test</div>
      </QuizEngineProvider>,
    );
    expect(getByText("Test")).toBeInTheDocument();
  });
});
