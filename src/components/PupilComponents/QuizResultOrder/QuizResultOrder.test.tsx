import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { QuizResultOrder } from "./QuizResultOrder";

import { orderAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("QuizResultOrder", () => {
  it.each([
    { pupilAnswers: [0, 1, 2, 3] },
    { pupilAnswers: [1, 2, 0, 3] },
    { pupilAnswers: [3, 1, 0, 2] },
  ])("renders the text for all of the answers", ({ pupilAnswers }) => {
    const { getAllByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultOrder
          answers={orderAnswers}
          feedback={["correct", "correct", "correct", "correct"]}
          pupilAnswers={pupilAnswers}
        />
      </OakThemeProvider>,
    );

    const renderedTexts = getAllByText(/[A-Za-z]+/).filter(
      (e) => e.textContent !== "Your answer:",
    );

    expect(renderedTexts).toHaveLength(4);

    pupilAnswers.forEach((pupilAnswer, i) => {
      const answer = orderAnswers[pupilAnswer];
      if (!answer) {
        throw new Error("Answer not found");
      }
      for (const part of answer.answer) {
        if (part?.type === "text") {
          expect(renderedTexts[i]?.textContent).toContain(part.text);
        }
      }
    });
  });

  it("renders correct answers as correct", () => {
    const { getAllByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultOrder
          answers={orderAnswers}
          feedback={["correct", "correct", "correct", "correct"]}
          pupilAnswers={[0, 1, 2, 3]}
        />
      </OakThemeProvider>,
    );

    expect(getAllByAltText("tick")).toHaveLength(4);
    expect(() => getAllByAltText("cross")).toThrow(
      "Unable to find an element with the alt text: cross",
    );
  });

  it("renders incorrect answers as incorrect", () => {
    const { getAllByAltText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultOrder
          answers={orderAnswers}
          feedback={["correct", "correct", "correct", "incorrect"]}
          pupilAnswers={[0, 1, 2, 3]}
        />
      </OakThemeProvider>,
    );

    expect(getAllByAltText("tick")).toHaveLength(3);
    expect(getAllByAltText("cross")).toHaveLength(1);
  });
});
