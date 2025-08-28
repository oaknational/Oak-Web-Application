import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizQuestionStem } from "@/components/PupilComponents/QuizQuestionStem";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { ImageOrTextItem } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { invariant } from "@/utils/invariant";

const starterQuiz = quizQuestions;
const mcqText = starterQuiz ? starterQuiz[0] : null;
const mcqStemImage = starterQuiz ? starterQuiz[1] : null;

describe("QuestionListItem", () => {
  it("renders the primary question text", () => {
    if (!mcqText) throw new Error("mcqText is null");
    if (!mcqText.questionStem) throw new Error("mcqText.questionStem is null");

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizQuestionStem
          questionUid={mcqText.questionUid}
          questionStem={mcqText.questionStem}
          index={0}
        />
      </OakThemeProvider>,
    );
    const primaryQuestionText = getByText("What is a main clause?");

    expect(primaryQuestionText).toBeInTheDocument();
  });

  it("renders question stem images", () => {
    invariant(mcqStemImage?.questionStem, "mcqStemImage.questionStem is null");

    const { getByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizQuestionStem
          questionUid={mcqStemImage.questionUid}
          questionStem={mcqStemImage.questionStem}
          index={0}
        />
      </OakThemeProvider>,
    );
    const image = getByAltText("An image in a quiz");

    expect(image).toBeInTheDocument();
  });

  it("renders text after an image", () => {
    invariant(mcqStemImage?.questionStem, "mcqStemImage.questionStem is null");

    const questionStem: ImageOrTextItem[] = [
      ...mcqStemImage.questionStem,
      { text: "This is some text", type: "text" },
    ];

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizQuestionStem
          questionUid={mcqStemImage.questionUid}
          questionStem={questionStem}
          index={0}
        />
      </OakThemeProvider>,
    );
    const secondaryText = getByText("This is some text");

    expect(secondaryText).toBeInTheDocument();
  });
});
