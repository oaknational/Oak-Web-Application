import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizMCQSingleAnswerFeedback } from "./QuizMCQSingleAnswerFeedback";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import {
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const questionsArrayFixture = quizQuestions || [];

const getQuizEngineContext = (): NonNullable<QuizEngineContextType> =>
  createQuizEngineContext({
    currentQuestionData: questionsArrayFixture[0],
    numQuestions: 1,
  });

describe("QuizMCQSingleAnswerFeedback", () => {
  it("renders the answer when currentQuestionData.question type is multiple choice", () => {
    const context = getQuizEngineContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizMCQSingleAnswerFeedback />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(
      getByText(
        `Correct answer: a group of words that contains a verb and makes complete sense`,
      ),
    ).toBeInTheDocument();
  });
});
