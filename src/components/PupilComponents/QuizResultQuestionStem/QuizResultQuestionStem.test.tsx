import React from "react";
import "@testing-library/jest-dom";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizResultQuestionStem } from "@/components/PupilComponents/QuizResultQuestionStem";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { ImageItem } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { invariant } from "@/utils/invariant";
import { StemPortableText } from "@/components/SharedComponents/Stem";
import { stemToPortableText } from "@/utils/portableText";
import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";

const starterQuiz = quizQuestions;
const mcqText = starterQuiz ? starterQuiz[0] : null;
const mcqStemImage = starterQuiz ? starterQuiz[1] : null;

describe("QuestionListItem", () => {
  it("renders the primary question text", () => {
    if (!mcqText) throw new Error("mcqText is null");
    if (!mcqText.questionStem) throw new Error("mcqText.questionStem is null");

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultQuestionStem
          questionStem={mcqText.questionStem}
          displayIndex={1}
        />
      </OakThemeProvider>,
    );
    const primaryQuestionText = getByText("What is a main clause?");

    expect(primaryQuestionText).toBeInTheDocument();
  });

  it("renders question stem images", () => {
    invariant(mcqStemImage?.questionStem, "mcqStemImage.questionStem is null");

    const { getByRole } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultQuestionStem
          questionStem={mcqStemImage.questionStem}
          displayIndex={0}
        />
      </OakThemeProvider>,
    );
    const image = getByRole("presentation");

    expect(image).toBeInTheDocument();
  });

  it("renders text after an image", () => {
    invariant(mcqStemImage?.questionStem, "mcqStemImage.questionStem is null");

    const questionStem: (StemPortableText | ImageItem)[] = [
      ...mcqStemImage.questionStem,
      {
        text: "This is some text",
        type: "text",
        portableText: stemToPortableText("This is some text"),
      },
    ];

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultQuestionStem questionStem={questionStem} displayIndex={0} />
      </OakThemeProvider>,
    );
    const secondaryText = getByText("This is some text");

    expect(secondaryText).toBeInTheDocument();
  });

  it("renders question number if displayIndex is other than 999", () => {
    invariant(mcqStemImage?.questionStem, "mcqStemImage.questionStem is null");

    const questionStem: (StemImageObject | StemTextObject)[] = [
      ...mcqStemImage.questionStem,
      {
        text: "This is some text",
        type: "text",
        portableText: stemToPortableText("This is some text"),
      },
    ];

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultQuestionStem questionStem={questionStem} displayIndex={24} />
      </OakThemeProvider>,
    );
    const displayNumberText = getByText("Q24", { exact: false });

    expect(displayNumberText).toBeInTheDocument();
  });

  it("does not render question number if displayIndex is 999", () => {
    invariant(mcqStemImage?.questionStem, "mcqStemImage.questionStem is null");

    const questionStem: (StemImageObject | StemTextObject)[] = [
      ...mcqStemImage.questionStem,
      {
        text: "This is some text",
        type: "text",
        portableText: stemToPortableText("This is some text"),
      },
    ];

    const { queryByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultQuestionStem
          questionStem={questionStem}
          displayIndex={999}
        />
      </OakThemeProvider>,
    );
    const displayNumberText = queryByText("Q999");

    expect(displayNumberText).toBeNull();
  });
});
