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
        <QuizResultMCQ
          answers={mcqTextAnswers}
          feedback={["correct", "correct", "correct", "correct"]}
          pupilAnswer={[1]}
        />
        ,
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
        <QuizResultMCQ
          answers={mcqImageAnswers}
          feedback={["correct", "correct", "correct", "correct"]}
          pupilAnswer={[1]}
        />
        ,
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
    const { getAllByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultMCQ
          answers={mcqTextAnswers}
          feedback={["correct", "correct", "correct", "correct"]}
          pupilAnswer={[0]}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getAllByTestId("tick")).toHaveLength(1);
    expect(() => getAllByTestId("cross")).toThrow();
  });

  it("marks incorrect answers as incorrect", () => {
    const { getAllByTestId } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultMCQ
          answers={mcqTextAnswers}
          feedback={["correct", "incorrect", "incorrect", "correct"]}
          pupilAnswer={[1, 2]}
        />
        ,
      </OakThemeProvider>,
    );
    expect(getAllByTestId("cross")).toHaveLength(2);
    expect(() => getAllByTestId("tick")).toThrow();
  });
});
