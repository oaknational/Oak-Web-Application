import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuizEngineContext } from "../QuizEngineProvider";
import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizShortAnswerFeedback } from "./QuizShortAnswerFeedback";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("QuizShortAnswerFeedback", () => {
  it("renders all answers when currentQuestionData.question type is multiple choice", () => {
    const context = createQuizEngineContext();
    context.currentQuestionData = quizQuestions?.find(
      (q) => q.questionType === "short-answer",
    );
    if (context?.currentQuestionData) {
      const { getByText } = renderWithTheme(
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizEngineContext.Provider value={context}>
            <QuizShortAnswerFeedback />
          </QuizEngineContext.Provider>
        </OakThemeProvider>,
      );

      expect(
        getByText("Correct answers: earth, wind, fire"),
      ).toBeInTheDocument();
    }
  });
});
