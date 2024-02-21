import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import {
  QuizEngineContext,
  QuizEngineContextType,
} from "../QuizEngineProvider";

import { QuizMCQMultiAnswerFeedback } from "./QuizMCQMultiAnswerFeedback";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const questionsArrayFixture = quizQuestions || [];

const getQuizEngineContext = (): NonNullable<QuizEngineContextType> => ({
  currentQuestionData: questionsArrayFixture[0],
  currentQuestionIndex: 0,
  numInteractiveQuestions: 0,
  currentQuestionDisplayIndex: 0,
  questionState: [
    {
      mode: "init",
      offerHint: false,
      grade: 0,
    },
  ],
  updateQuestionMode: (mode) => mode,
  handleSubmitMCAnswer: () => {},
  handleNextQuestion: () => {},
  handleSubmitShortAnswer: () => {},
  score: 0,
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
