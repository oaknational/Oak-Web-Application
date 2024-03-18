import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import {
  createQuestionData,
  createQuizEngineContext,
} from "../pupilTestHelpers/createQuizEngineContext";

import { QuizOrderAnswerFeedback } from "./QuizOrderAnswerFeedback";

import { orderAnswers } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import {
  QuizEngineContext,
  QuizEngineContextType,
} from "@/components/PupilComponents/QuizEngineProvider";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const getQuizEngineContext = (): NonNullable<QuizEngineContextType> =>
  createQuizEngineContext({
    currentQuestionData: createQuestionData({
      answers: {
        order: orderAnswers,
      },
      questionType: "order",
    }),
  });

describe(QuizOrderAnswerFeedback, () => {
  it("renders answer feedback for order questions", () => {
    const context = getQuizEngineContext();

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizOrderAnswerFeedback />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(
      getByText(
        "Correct answers: Edward the Confessor was exiled in Normandy., Edward the Confessor became king., Harold Godwinson travelled to Normandy., Edward the Confessor died.",
      ),
    ).toBeInTheDocument();
  });
});
