import { screen } from "@testing-library/react";

import LessonOverviewQuizContainer from "./LessonOverviewQuizContainer";

import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const quizQuestionsData: LessonOverviewQuizData = quizQuestions;

vi.mock("better-react-mathjax", () => ({
  MathJax: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const imageAttribution: {
  attribution: string;
  questionNumber: string;
}[] = [
  {
    questionNumber: "3",
    attribution:
      "Image Reproduced by permission of Oxford University Press. All rights reserved. Adapted from The Deer and the Snail. © Oxford University Press 2020",
  },
  {
    questionNumber: "4",
    attribution:
      "Image ‘A Family Supper’ by Kazuo Ishiguro. Published by Firebird 2, 1982. Copyright © Kazuo Ishiguro. Reproduced by permission of the author c/o Rogers, Coleridge & White Ltd., 20 Powis Mews, London W11 1JN ",
  },
];

describe("LessonOverviewQuizContainer", () => {
  vi.mock("next/dist/client/router", () => require("next-router-mock"));
  test("should render quizzes", () => {
    renderWithTheme(
      <LessonOverviewQuizContainer
        questions={quizQuestionsData as NonNullable<LessonOverviewQuizData>}
        imageAttribution={imageAttribution}
        isMathJaxLesson={false}
      />,
    );
    expect(screen.getByText("What is a main clause?")).toBeInTheDocument();
  });
  test("should render attribution ", () => {
    renderWithTheme(
      <LessonOverviewQuizContainer
        questions={quizQuestionsData as NonNullable<LessonOverviewQuizData>}
        imageAttribution={imageAttribution}
        isMathJaxLesson={false}
      />,
    );
    expect(
      screen.getByText(
        "Image Reproduced by permission of Oxford University Press. All rights reserved. Adapted from The Deer and the Snail. © Oxford University Press 2020",
      ),
    ).toBeInTheDocument();
  });
});
