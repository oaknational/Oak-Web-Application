import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import {
  QuizEngineContext,
  QuizEngineContextType,
} from "../QuizEngineProvider";

import { QuizShortAnswerFeedback } from "./QuizShortAnswerFeedback";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const questionsArrayFixture = quizQuestions || [];

const getQuizEngineContext = (): NonNullable<QuizEngineContextType> => ({
  currentQuestionData: questionsArrayFixture[0],
  currentQuestionIndex: 0,
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

describe("QuizShortAnswerFeedback", () => {
  it("renders all answers when currentQuestionData.question type is multiple choice", () => {
    const context = getQuizEngineContext();
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
