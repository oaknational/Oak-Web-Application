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
  lessonStarted: boolean;
  isReadOnly: boolean;
  refreshReadOnly: jest.Mock<Promise<boolean>>;
  setReadOnly: jest.Mock;
  completeSection: jest.Mock;
  updateSectionInProgressResult: jest.Mock;
};

type QuizState = {
  lessonSlug: string | null;
  section: "starter-quiz" | "exit-quiz" | null;
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
const trackQuizAbandoned = jest.fn();
const trackLessonStarted = jest.fn();
const trackLessonCompleted = jest.fn();

jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => ({
    trackSectionStarted,
    trackQuizQuestionAttempt,
    trackQuizCompleted,
    trackQuizAbandoned,
    trackLessonStarted,
    trackLessonCompleted,
  }),
}));

const baseQuestionState: QuestionState = {
  mode: "init",
  grade: 0,
  offerHint: false,
};

const mcqQuestion = quizQuestions[0];
if (!mcqQuestion) throw new Error("mcq fixture missing");

const orderQuestion = quizQuestions.find((q) => q.questionType === "order");
if (!orderQuestion) throw new Error("order fixture missing");

const buildProgressState = (
  overrides: Partial<ProgressState> = {},
): ProgressState => ({
  sectionResults: {},
  lessonReviewSections: ["starter-quiz", "exit-quiz"],
  lessonStarted: false,
  isReadOnly: false,
  refreshReadOnly: jest.fn().mockResolvedValue(false),
  setReadOnly: jest.fn(),
  completeSection: jest.fn(),
  updateSectionInProgressResult: jest.fn(),
  ...overrides,
});

const buildQuizState = (overrides: Partial<QuizState> = {}): QuizState => ({
  lessonSlug: "test-lesson",
  section: "starter-quiz",
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
  trackQuizAbandoned.mockReset();
  trackLessonStarted.mockReset();
  trackLessonCompleted.mockReset();
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
    quizState = buildQuizState({
      section: "exit-quiz",
      isHydratedComplete: true,
    });
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

  it("ignores form submissions while the question is in incomplete mode", () => {
    quizState = buildQuizState({
      questionState: [{ ...baseQuestionState, mode: "incomplete" }],
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { container } = renderPage();
    const form = container.querySelector("#quiz-form") as HTMLFormElement;
    act(() => {
      fireEvent.submit(form);
    });
    expect(quizState.updateQuestionMode).not.toHaveBeenCalled();
    expect(quizState.applyCurrentQuestionResult).not.toHaveBeenCalled();
  });

  it("advances to the next question when the next button is pressed mid-quiz", async () => {
    quizState = buildQuizState({
      questionState: [
        { ...baseQuestionState, mode: "feedback", grade: 1 },
        baseQuestionState,
      ],
      currentQuestionIndex: 0,
      numQuestions: 2,
      numInteractiveQuestions: 2,
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { getByRole } = renderPage();
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Next question" }));
    });
    expect(quizState.handleNextQuestion).toHaveBeenCalledTimes(1);
    expect(progressState.refreshReadOnly).not.toHaveBeenCalled();
  });

  it("uses cached read-only for mid-quiz next without refreshing submission state", async () => {
    progressState = buildProgressState({
      isReadOnly: true,
      refreshReadOnly: jest.fn().mockResolvedValue(true),
    });
    progressHookMock.mockImplementation((selector) => selector(progressState));
    quizState = buildQuizState({
      questionState: [
        { ...baseQuestionState, mode: "feedback", grade: 1 },
        baseQuestionState,
      ],
      currentQuestionIndex: 0,
      numQuestions: 2,
      numInteractiveQuestions: 2,
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { getByRole } = renderPage();
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Next question" }));
    });

    expect(quizState.handleNextQuestion).not.toHaveBeenCalled();
    expect(progressState.refreshReadOnly).not.toHaveBeenCalled();
    expect(routerPush.mock.calls[0]?.[0]).toContain("review");
  });

  it("completes the quiz and navigates to the overview when finishing the starter quiz", async () => {
    quizState = buildQuizState({
      questionState: [{ ...baseQuestionState, mode: "feedback", grade: 1 }],
      currentQuestionIndex: 0,
      numQuestions: 1,
      numInteractiveQuestions: 1,
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { getByRole } = renderPage();
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Continue lesson" }));
    });
    expect(progressState.completeSection).toHaveBeenCalledWith("starter-quiz");
    expect(trackQuizCompleted).toHaveBeenCalledTimes(1);
    expect(trackLessonStarted).toHaveBeenCalledTimes(1);
    expect(routerPush.mock.calls[0]?.[0]).toContain("overview");
  });

  it("redirects to review without completing the quiz when progression discovers read-only state", async () => {
    progressState = buildProgressState({
      refreshReadOnly: jest.fn().mockResolvedValue(true),
      setReadOnly: jest.fn(),
    });
    progressHookMock.mockImplementation((selector) => selector(progressState));
    quizState = buildQuizState({
      questionState: [{ ...baseQuestionState, mode: "feedback", grade: 1 }],
      currentQuestionIndex: 0,
      numQuestions: 1,
      numInteractiveQuestions: 1,
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { getByRole } = renderPage();
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Continue lesson" }));
    });

    expect(progressState.completeSection).not.toHaveBeenCalled();
    expect(trackQuizCompleted).not.toHaveBeenCalled();
    expect(routerPush.mock.calls[0]?.[0]).toContain("review");
  });

  it("tracks the lesson as completed when the exit quiz finishes the lesson", async () => {
    progressState = buildProgressState({
      sectionResults: {
        intro: { isComplete: true, worksheetAvailable: false },
        "starter-quiz": {
          isComplete: true,
          grade: 1,
          numQuestions: 1,
          questionResults: [],
        },
      },
    });
    progressHookMock.mockImplementation((selector) => selector(progressState));
    quizState = buildQuizState({
      section: "exit-quiz",
      questionState: [{ ...baseQuestionState, mode: "feedback", grade: 1 }],
      currentQuestionIndex: 0,
      numQuestions: 1,
      numInteractiveQuestions: 1,
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { getByRole } = renderWithTheme(
      <QuizPageContent
        section="exit-quiz"
        questionsArray={[mcqQuestion]}
        lessonSlug="test-lesson"
        phase="primary"
      />,
    );
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Lesson review" }));
    });
    expect(progressState.completeSection).toHaveBeenCalledWith("exit-quiz");
    expect(trackLessonCompleted).toHaveBeenCalledTimes(1);
  });

  it("skips tracking lesson started on completion when the lesson is already in progress", async () => {
    progressState = buildProgressState({ lessonStarted: true });
    progressHookMock.mockImplementation((selector) => selector(progressState));
    quizState = buildQuizState({
      questionState: [{ ...baseQuestionState, mode: "feedback", grade: 1 }],
      currentQuestionIndex: 0,
      numQuestions: 1,
      numInteractiveQuestions: 1,
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { getByRole } = renderPage();
    await act(async () => {
      fireEvent.click(getByRole("button", { name: "Continue lesson" }));
    });
    expect(trackLessonStarted).not.toHaveBeenCalled();
  });

  it("navigates to the overview without tracking when the back button is pressed on an already complete quiz", () => {
    progressState = buildProgressState({
      sectionResults: {
        "starter-quiz": {
          isComplete: true,
          grade: 1,
          numQuestions: 1,
          questionResults: [],
        },
      },
    });
    progressHookMock.mockImplementation((selector) => selector(progressState));

    const { getByLabelText } = renderPage();
    fireEvent.click(getByLabelText(/Back/));
    expect(trackQuizAbandoned).not.toHaveBeenCalled();
    expect(trackQuizCompleted).not.toHaveBeenCalled();
    expect(routerPush.mock.calls[0]?.[0]).toContain("overview");
  });

  it("tracks the quiz as abandoned when the back button is pressed mid-quiz", () => {
    quizState = buildQuizState({
      questionState: [baseQuestionState],
      currentQuestionIndex: 0,
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { getByLabelText } = renderPage();
    fireEvent.click(getByLabelText(/Back/));
    expect(trackQuizAbandoned).toHaveBeenCalledTimes(1);
    expect(trackLessonStarted).toHaveBeenCalledTimes(1);
  });

  it("completes the quiz on back when the quiz is effectively complete but not yet committed", async () => {
    quizState = buildQuizState({
      questionState: [{ ...baseQuestionState, mode: "feedback", grade: 1 }],
      currentQuestionIndex: 0,
      numQuestions: 1,
      numInteractiveQuestions: 1,
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { getByLabelText } = renderPage();
    await act(async () => {
      fireEvent.click(getByLabelText(/Back/));
    });
    expect(progressState.completeSection).toHaveBeenCalledWith("starter-quiz");
    expect(trackQuizCompleted).toHaveBeenCalledTimes(1);
    expect(trackQuizAbandoned).not.toHaveBeenCalled();
  });

  it("shows 'Well done!' for a correct answer in feedback mode", () => {
    quizState = buildQuizState({
      questionState: [{ ...baseQuestionState, mode: "feedback", grade: 1 }],
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));

    const { getByText } = renderPage();
    expect(getByText("Well done!")).toBeInTheDocument();
  });

  it("does not crash when entering the exit quiz before its state initialises", () => {
    quizState = buildQuizState({
      section: "starter-quiz",
      questionState: [
        {
          ...baseQuestionState,
          mode: "feedback",
          grade: 0,
          feedback: "incorrect",
        },
      ],
      currentQuestionIndex: 0,
      numQuestions: 1,
      numInteractiveQuestions: 1,
    });
    quizHookMock.mockImplementation((selector) => selector(quizState));
    quizGetStateMock.mockReturnValue(quizState);

    const renderStaleExitQuiz = () =>
      renderWithTheme(
        <QuizPageContent
          section="exit-quiz"
          questionsArray={[orderQuestion]}
          lessonSlug="test-lesson"
          phase="primary"
        />,
      );

    let rendered: ReturnType<typeof renderStaleExitQuiz> | undefined;
    expect(() => {
      rendered = renderStaleExitQuiz();
    }).not.toThrow();
    expect(
      rendered?.container.querySelector("#quiz-form"),
    ).not.toBeInTheDocument();
  });
});
