import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oak-academy/oak-components";

import { QuizQuestionStem } from "@/components/PupilComponents/QuizQuestionStem";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";
import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";

const lessonOverview = lessonOverviewFixture();
const starterQuiz = lessonOverview.starterQuiz;
const mcqText = starterQuiz ? starterQuiz[0] : null;
const mcqStemImage = starterQuiz ? starterQuiz[1] : null;

describe("QuestionListItem", () => {
  it("renders the primary question text", () => {
    if (!mcqText) throw new Error("mcqText is null");

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        {" "}
        <QuizQuestionStem questionStem={mcqText.questionStem} index={0} />
      </OakThemeProvider>,
    );
    const primaryQuestionText = getByText("What is a main clause?");

    expect(primaryQuestionText).toBeInTheDocument();
  });

  it("renders question stem images", () => {
    if (!mcqStemImage) throw new Error("mcqText is null");

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        {" "}
        <QuizQuestionStem questionStem={mcqStemImage.questionStem} index={0} />
      </OakThemeProvider>,
    );
    const image = getByRole("img");

    expect(image).toBeInTheDocument();
  });

  it("renders text after an image", () => {
    if (!mcqStemImage) throw new Error("mcqText is null");

    const questionStem: (StemImageObject | StemTextObject)[] = [
      ...mcqStemImage.questionStem,
      { text: "This is some text", type: "text" },
    ];

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizQuestionStem questionStem={questionStem} index={0} />
      </OakThemeProvider>,
    );
    const secondaryText = getByText("This is some text");

    expect(secondaryText).toBeInTheDocument();
  });
});
