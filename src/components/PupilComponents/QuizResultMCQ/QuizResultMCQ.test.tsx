import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { QuizResultMCQ } from "./QuizResultMCQ";

import {
  mcqTextAnswers,
  mcqImageAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("QuizResultMCQ", () => {
  it("renders the text for all of the answers", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultMCQ answers={mcqTextAnswers} pupilAnswers={2} />,
      </OakThemeProvider>,
    );

    for (const answer of mcqTextAnswers) {
      for (const part of answer.answer) {
        if (part?.type === "text") {
          expect(getByText(part.text)).toBeInTheDocument();
        }
      }
    }
  });

  it("renders the image for all of the answers", () => {
    const { getByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultMCQ answers={mcqImageAnswers} pupilAnswers={2} />,
      </OakThemeProvider>,
    );

    mcqImageAnswers.forEach((answer, i) => {
      for (const part of answer.answer) {
        if (part?.type === "image") {
          expect(getByAltText(`Image for option ${i + 1}`)).toBeInTheDocument();
        }
      }
    });
  });

  it("marks correct answers as correct", () => {
    const correctAnswerIndex = mcqTextAnswers.findIndex(
      (answer) => answer.answerIsCorrect,
    );

    const { getAllByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultMCQ
          answers={mcqTextAnswers}
          pupilAnswers={correctAnswerIndex}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getAllByAltText("tick")).toHaveLength(1);
    expect(() => getAllByAltText("cross")).toThrow(
      "Unable to find an element with the alt text: cross",
    );
  });

  it("marks incorrect answers as incorrect", () => {
    const incorrectAnswerIndexes = mcqTextAnswers
      .map((answer, i) => (answer.answerIsCorrect ? undefined : i))
      .filter((i) => i !== undefined);

    const { getAllByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultMCQ
          answers={mcqTextAnswers}
          pupilAnswers={incorrectAnswerIndexes}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getAllByAltText("cross")).toHaveLength(
      incorrectAnswerIndexes.length,
    );
    expect(() => getAllByAltText("tick")).toThrow(
      "Unable to find an element with the alt text: tick",
    );
  });
});
