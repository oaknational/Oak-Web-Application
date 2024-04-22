import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import {
  QuizEngineContext,
  QuizEngineContextType,
} from "../QuizEngineProvider";
import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizMCQMultiAnswerFeedback } from "./QuizMCQMultiAnswerFeedback";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const questionsArrayFixture = quizQuestions || [];

const getQuizEngineContext = (): NonNullable<QuizEngineContextType> =>
  createQuizEngineContext({
    currentQuestionData: questionsArrayFixture[0],
    numQuestions: 1,
  });

describe("QuizMCQMultiAnswerFeedback", () => {
  it("renders all answers when currentQuestionData.question type is multiple choice", () => {
    const context = getQuizEngineContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMCQMultiAnswerFeedback />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(
      getByText(
        "Correct answers: a group of words that contains a verb and makes complete sense",
      ),
    ).toBeInTheDocument();
  });
});
