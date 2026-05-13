import "@testing-library/jest-dom";
import { act, fireEvent } from "@testing-library/react";

import { QuizPageContent } from "./QuizPageContent";

import "@/__tests__/__helpers__/ResizeObserverMock";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";
import { LessonSectionResults } from "@/context/PupilLessonProgress";

const routerPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath: "/pupils/test-lesson/starter-quiz",
    push: routerPush,
  }),
}));

type ProgressState = {
  sectionResults: LessonSectionResults;
  lessonReviewSections: readonly ("starter-quiz" | "exit-quiz")[];
  isReadOnly: boolean;
  completeSection: jest.Mock;
  updateSectionInProgressResult: jest.Mock;
};

type QuizState = {
  currentQuestionIndex: number;
  questionState: QuestionState[];
  numQuestions: number;
  numInteractiveQuestions: number;
  isHydratedComplete: boolean;
  initialiseQuiz: jest.Mock;
  updateQuestionMode: jest.Mock;
  updateHintOffered: jest.Mock;
  applyCurrentQuestionResult: jest.Mock;
  handleNextQuestion: jest.Mock;
};

let progressState: ProgressState;
let quizState: QuizState;

const progressHookMock = jest.fn();
const quizHookMock = jest.fn();
const quizGetStateMock = jest.fn();

jest.mock("@/context/PupilLessonProgress", () => ({
  ...jest.requireActual("@/context/PupilLessonProgress"),
  usePupilLessonProgress: (selector: (state: ProgressState) => unknown) =>
    progressHookMock(selector),
}));

jest.mock("@/context/PupilLessonQuiz", () => ({
  ...jest.requireActual("@/context/PupilLessonQuiz"),
  usePupilLessonQuiz: Object.assign(
    (selector: (state: QuizState) => unknown) => quizHookMock(selector),
    { getState: () => quizGetStateMock() },
  ),
}));

const trackSectionStarted = jest.fn();
const trackQuizQuestionAttempt = jest.fn();
const trackQuizCompleted = jest.fn();

jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => ({
    trackSectionStarted,
    trackQuizQuestionAttempt,
    trackQuizCompleted,
  }),
}));

const baseQuestionState: QuestionState = {
  mode: "init",
  grade: 0,
  offerHint: false,
};

const mcqQuestion = quizQuestions[0];
if (!mcqQuestion) throw new Error("mcq fixture missing");

const buildProgressState = (
  overrides: Partial<ProgressState> = {},
): ProgressState => ({
  sectionResults: {},
  lessonReviewSections: ["starter-quiz", "exit-quiz"],
  isReadOnly: false,
  completeSection: jest.fn(),
  updateSectionInProgressResult: jest.fn(),
  ...overrides,
});

const buildQuizState = (overrides: Partial<QuizState> = {}): QuizState => ({
  currentQuestionIndex: 0,
  questionState: [baseQuestionState],
  numQuestions: 1,
  numInteractiveQuestions: 1,
  isHydratedComplete: false,
  initialiseQuiz: jest.fn(),
  updateQuestionMode: jest.fn(),
  updateHintOffered: jest.fn(),
  applyCurrentQuestionResult: jest.fn(),
  handleNextQuestion: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  routerPush.mockReset();
  trackSectionStarted.mockReset();
  trackQuizQuestionAttempt.mockReset();
  trackQuizCompleted.mockReset();
  progressState = buildProgressState();
  quizState = buildQuizState();
  progressHookMock.mockImplementation((selector) => selector(progressState));
  quizHookMock.mockImplementation((selector) => selector(quizState));
  quizGetStateMock.mockReturnValue(quizState);
});

const renderPage = () =>
  renderWithTheme(
    <QuizPageContent
      section="starter-quiz"
      questionsArray={[mcqQuestion]}
      lessonSlug="test-lesson"
      phase="primary"
    />,
  );

describe("QuizPageContent", () => {
  it("renders the current question stem", () => {
    const { getByText } = renderPage();
    expect(getByText("What is a main clause?")).toBeInTheDocument();
  });

  it("initialises the quiz on mount with the section and questions", () => {
    renderPage();
    expect(quizState.initialiseQuiz).toHaveBeenCalledWith({
      lessonSlug: "test-lesson",
      section: "starter-quiz",
      questionsArray: [mcqQuestion],
      initialQuestionResults: undefined,
    });
  });

  it("passes existing section results when initialising", () => {
    const existingResults: QuestionState[] = [
      { ...baseQuestionState, mode: "feedback", grade: 1 },
    ];
    progressState = buildProgressState({
      sectionResults: {
        "starter-quiz": {
          isComplete: false,
          grade: 1,
          numQuestions: 1,
          questionResults: existingResults,
        },
      },
    });
    progressHookMock.mockImplementation((selector) => selector(progressState));

    renderPage();
    expect(quizState.initialiseQuiz).toHaveBeenCalledWith(
      expect.objectContaining({ initialQuestionResults: existingResults }),
    );
  });

  it("redirects to overview when the starter quiz is already hydrated complete", () => {
    quizState = buildQuizState({ isHydratedComplete: true });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    renderPage();
    expect(routerPush).toHaveBeenCalledTimes(1);
    expect(routerPush.mock.calls[0]?.[0]).toContain("overview");
  });

  it("redirects to review when the exit quiz is already hydrated complete", () => {
    quizState = buildQuizState({ isHydratedComplete: true });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    renderWithTheme(
      <QuizPageContent
        section="exit-quiz"
        questionsArray={[mcqQuestion]}
        lessonSlug="test-lesson"
        phase="primary"
      />,
    );
    expect(routerPush.mock.calls[0]?.[0]).toContain("review");
  });

  it("marks the question incomplete when submitted from init mode", () => {
    const { container } = renderPage();
    const form = container.querySelector("#quiz-form") as HTMLFormElement;
    expect(form).not.toBeNull();
    act(() => {
      fireEvent.submit(form);
    });
    expect(quizState.updateQuestionMode).toHaveBeenCalledWith("incomplete");
    expect(quizState.applyCurrentQuestionResult).not.toHaveBeenCalled();
  });

  it("grades and applies the result when submitted from input mode", () => {
    quizState = buildQuizState({
      questionState: [{ ...baseQuestionState, mode: "input" }],
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));
    quizGetStateMock.mockReturnValue(quizState);

    const { container } = renderPage();
    const form = container.querySelector("#quiz-form") as HTMLFormElement;
    act(() => {
      fireEvent.submit(form);
    });
    expect(quizState.updateQuestionMode).toHaveBeenCalledWith("grading");
    expect(quizState.applyCurrentQuestionResult).toHaveBeenCalledTimes(1);
    expect(trackQuizQuestionAttempt).toHaveBeenCalledTimes(1);
  });
});
