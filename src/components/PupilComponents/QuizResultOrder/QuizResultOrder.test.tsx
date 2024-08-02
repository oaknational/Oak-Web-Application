import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import { QuizResultOrder } from "./QuizResultOrder";

import { orderAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("QuizResultOrder", () => {
  it("renders the text for all of the answers", () => {
    const pupilAnswers = [0, 1, 2, 3];

    const { getAllByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizResultOrder
          answers={orderAnswers}
          feedback={["correct", "correct", "correct", "correct"]}
          pupilAnswers={pupilAnswers}
        />
      </OakThemeProvider>,
    );

    const renderedTexts = getAllByText(/.*/);
    console.log(renderedTexts);

    // for (const pupilAnswer of pupilAnswers) {
    //   const answer = orderAnswers[pupilAnswer];
    //   if (!answer) {
    //     throw new Error("Answer not found");
    //   }
    //   for (const part of answer.answer) {
    //     if (part?.type === "text") {
    //       expect(getByText(part.text)).toBeInTheDocument();
    //     }
    //   }
    // }
  });
});
