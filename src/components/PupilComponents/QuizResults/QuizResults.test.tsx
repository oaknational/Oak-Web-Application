import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import { QuestionState } from "../QuizUtils/questionTypes";

import { QuizResults } from "./QuizResults";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { exitQuizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { sectionResultsFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonSectionResults.fixture";

vi.mock("@/components/PupilComponents/QuizResultMCQ/QuizResultMCQ", () => ({
  QuizResultMCQ: () => <div>Multiple Choice Question</div>,
}));
vi.mock(
  "@/components/PupilComponents/QuizResultShortAnswer/QuizResultShortAnswer",
  () => ({
    QuizResultShortAnswer: () => <div>Short Answer Question</div>,
  }),
);
vi.mock("@/components/PupilComponents/QuizResultOrder/QuizResultOrder", () => ({
  QuizResultOrder: () => <div>Order Question</div>,
}));
vi.mock("@/components/PupilComponents/QuizResultMatch/QuizResultMatch", () => ({
  QuizResultMatch: () => <div>Match Question</div>,
}));

describe("QuizResult", () => {
  it("renders the right number of results", () => {
    const { getAllByRole } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResults
            quizArray={exitQuizQuestions}
            sectionResults={sectionResultsFixture}
            lessonSection="exit-quiz"
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );
    const items = getAllByRole("listitem");
    expect(items.length).toBe(exitQuizQuestions.length);
  });
  it("render a tick icon if the answer is correct and cross if incorrect", () => {
    const { getAllByRole } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResults
            quizArray={exitQuizQuestions}
            sectionResults={sectionResultsFixture}
            lessonSection="exit-quiz"
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );
    const listItems = getAllByRole("listitem");
    sectionResultsFixture?.["exit-quiz"]?.questionResults?.forEach(
      (questionResult: QuestionState, index: number) => {
        const listItem = listItems[index]?.firstChild?.firstChild;
        if (questionResult.grade === 1) {
          expect(listItem).toHaveAttribute("alt", "tick");
        } else {
          expect(listItem).toHaveAttribute("alt", "cross");
        }
      },
    );
  });
  it("render the question stem", () => {
    const { getByText } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResults
            quizArray={exitQuizQuestions}
            sectionResults={sectionResultsFixture}
            lessonSection="exit-quiz"
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );
    const questionStem = getByText("Q2. Match each equation to its solution.");
    expect(questionStem).toBeInTheDocument();
  });
  it("render multiple choice question feedback", () => {
    const { getAllByRole } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResults
            quizArray={exitQuizQuestions}
            sectionResults={sectionResultsFixture}
            lessonSection="exit-quiz"
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );
    const listItems = getAllByRole("listitem");
    exitQuizQuestions.forEach((quizQuestion, index) => {
      const listItem = listItems[index]?.children[1];
      if (quizQuestion.questionType === "multiple-choice") {
        expect(listItem).toHaveTextContent("Multiple Choice Question");
      }
    });
  });
  it("render short answer question feedback", () => {
    const { getAllByRole } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResults
            quizArray={exitQuizQuestions}
            sectionResults={sectionResultsFixture}
            lessonSection="exit-quiz"
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );
    const listItems = getAllByRole("listitem");
    exitQuizQuestions.forEach((quizQuestion, index) => {
      const listItem = listItems[index]?.children[1];
      if (quizQuestion.questionType === "short-answer") {
        expect(listItem).toHaveTextContent("Short Answer Question");
      }
    });
  });
  it("render order question feedback", () => {
    const { getAllByRole } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResults
            quizArray={exitQuizQuestions}
            sectionResults={sectionResultsFixture}
            lessonSection="exit-quiz"
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );
    const listItems = getAllByRole("listitem");
    exitQuizQuestions.forEach((quizQuestion, index) => {
      const listItem = listItems[index]?.children[1];
      if (quizQuestion.questionType === "order") {
        expect(listItem).toHaveTextContent("Order Question");
      }
    });
  });
  it("render match question feedback", () => {
    const { getAllByRole } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResults
            quizArray={exitQuizQuestions}
            sectionResults={sectionResultsFixture}
            lessonSection="exit-quiz"
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );
    const listItems = getAllByRole("listitem");
    exitQuizQuestions.forEach((quizQuestion, index) => {
      const listItem = listItems[index]?.children[1];
      if (quizQuestion.questionType === "match") {
        expect(listItem).toHaveTextContent("Match Question");
      }
    });
  });
  it("renders the correct answers if the question is incorrect", () => {
    const { getAllByRole } = renderWithTheme(
      <MathJaxProvider>
        <OakThemeProvider theme={oakDefaultTheme}>
          <QuizResults
            quizArray={exitQuizQuestions}
            sectionResults={sectionResultsFixture}
            lessonSection="exit-quiz"
          />
        </OakThemeProvider>
      </MathJaxProvider>,
    );
    const listItems = getAllByRole("listitem");
    sectionResultsFixture?.["exit-quiz"]?.questionResults?.forEach(
      (questionResult: QuestionState, index: number) => {
        const listItem = listItems[index]?.children[1]?.children[2];
        if (questionResult.grade === 0) {
          expect(listItem).toHaveTextContent("Correct");
        }
      },
    );
  });
});
