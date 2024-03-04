import { QuizEngineContextType } from "../QuizEngineProvider";

export function createQuizEngineContext(
  overrides?: Partial<QuizEngineContextType>,
): NonNullable<QuizEngineContextType> {
  return {
    currentQuestionIndex: 0,
    numInteractiveQuestions: 0,
    currentQuestionDisplayIndex: 0,
    numQuestions: 0,
    questionState: [
      {
        mode: "init",
        offerHint: false,
        grade: 0,
      },
    ],
    score: 0,
    updateQuestionMode: jest.fn(),
    handleSubmitMCAnswer: jest.fn(),
    handleNextQuestion: jest.fn(),
    handleSubmitShortAnswer: jest.fn(),
    handleSubmitOrderAnswer: jest.fn(),
    ...overrides,
  };
}
