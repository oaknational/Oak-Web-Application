import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { render } from "@testing-library/react";

import { isImage } from "../QuizUtils/stemUtils";

import { QuizAttribution } from "./QuizAttribution";

import {
  mcqImageAnswers,
  mcqTextAnswers,
  questionStem,
  questionStemWithImage,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

describe(QuizAttribution, () => {
  it("displays attribution for any image in the question stem", () => {
    const { queryByText } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizAttribution
          questionData={{
            ...quizQuestions[0]!,
            answers: {
              "multiple-choice": mcqTextAnswers,
            },
            questionStem: questionStemWithImage,
          }}
        />
      </OakThemeProvider>,
    );

    expect(queryByText("test attribution picture")).toBeInTheDocument();
  });

  it("displays attribution for images in answers", () => {
    const { getByTestId } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizAttribution
          questionData={{
            ...quizQuestions[0]!,
            answers: {
              "multiple-choice": mcqImageAnswers.map((choice, i) => ({
                ...choice,
                answer: choice.answer.filter(isImage).map((answer) => ({
                  ...answer,
                  imageObject: {
                    ...answer.imageObject,
                    metadata: {
                      attribution: `attribution for image #${i + 1}`,
                    },
                  },
                })),
              })),
            },
            questionStem: questionStemWithImage,
          }}
        />
      </OakThemeProvider>,
    );

    expect(getByTestId("quiz-attribution").textContent).toEqual(
      "test attribution picture, 1 attribution for image #1, 2 attribution for image #2, 3 attribution for image #3",
    );
  });

  it("renders nothing when there are no attributions", () => {
    const { queryByTestId } = render(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizAttribution
          questionData={{
            ...quizQuestions[0]!,
            answers: {
              "multiple-choice": mcqTextAnswers,
            },
            questionStem: questionStem,
          }}
        />
      </OakThemeProvider>,
    );

    expect(queryByTestId("quiz-attribution")).not.toBeInTheDocument();
  });
});
