import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import {
  QuizEngineContext,
  QuizEngineContextType,
} from "../QuizEngineProvider";
import { createQuizEngineContext } from "../pupilTestHelpers/createQuizEngineContext";

import { QuizCorrectAnswers } from "./QuizCorrectAnswers";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

const questionsArrayFixture = quizQuestions || [];

const getQuizEngineContext = (
  correctAnswer: QuestionState["correctAnswer"],
): NonNullable<QuizEngineContextType> =>
  createQuizEngineContext({
    currentQuestionData: questionsArrayFixture[0],
    currentQuestionIndex: 0,
    currentQuestionState: {
      mode: "init",
      offerHint: false,
      grade: 0,
      correctAnswer,
    },
    numQuestions: 1,
  });

describe("QuizCorrectAnswers", () => {
  it("handles a single correct answer inside an array", () => {
    const context = getQuizEngineContext([
      "a group of words that contains a verb and makes complete sense",
    ]);

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizCorrectAnswers />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(
      getByText(
        "Correct answer: a group of words that contains a verb and makes complete sense",
      ),
    ).toBeInTheDocument();
  });

  it("handles a multiple correct answers inside an array", () => {
    const context = getQuizEngineContext(["one", "two", "three"]);

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizCorrectAnswers />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(getByText("Correct answers: one, two, three")).toBeInTheDocument();
  });

  it("handles a single correct answer", () => {
    const context = getQuizEngineContext(
      "a group of words that contains a verb",
    );

    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizCorrectAnswers />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(
      getByText("Correct answer: a group of words that contains a verb"),
    ).toBeInTheDocument();
  });

  it("handles no correct answer", () => {
    const context = getQuizEngineContext(undefined);

    const { container } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <QuizEngineContext.Provider value={context}>
          <QuizCorrectAnswers />
        </QuizEngineContext.Provider>
      </OakThemeProvider>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
