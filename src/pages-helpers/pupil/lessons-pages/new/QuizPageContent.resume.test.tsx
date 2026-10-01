import { act, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QuizPageContent } from "./QuizPageContent";

import "@/__tests__/__helpers__/ResizeObserverMock";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import {
  LessonSectionResults,
  usePupilLessonProgress,
} from "@/context/PupilLessonProgress";
import { usePupilLessonQuiz } from "@/context/PupilLessonQuiz";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

const routerPush = jest.fn();
let asPath: string;
jest.mock("next/router", () => ({
  useRouter: () => ({ asPath, push: routerPush }),
}));

jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => ({
    trackSectionStarted: jest.fn(),
    trackQuizQuestionAttempt: jest.fn(),
    trackQuizCompleted: jest.fn(),
    trackQuizAbandoned: jest.fn(),
    trackLessonStarted: jest.fn(),
    trackLessonCompleted: jest.fn(),
  }),
}));

const question = quizQuestions[0];
if (!question) throw new Error("MCQ fixture missing");
const questions = [question, { ...question, questionUid: "final-question" }];
const checkedAnswer = { mode: "feedback", offerHint: false, grade: 1 } as const;
const submitClassroomProgress = jest
  .fn()
  .mockResolvedValue({ status: "GRADE_SUBMITTED" });
const refreshReadOnly = jest.fn(() => new Promise<boolean>(() => undefined));
const savedAnswers: {
  fixtureIndex: number;
  name: string;
  answer: QuestionState;
}[] = [
  {
    fixtureIndex: 3,
    name: "matching",
    answer: {
      ...checkedAnswer,
      pupilAnswer: ["0", "1", "2"],
      feedback: ["correct", "correct", "correct"],
    },
  },
  {
    fixtureIndex: 4,
    name: "ordering",
    answer: {
      ...checkedAnswer,
      pupilAnswer: [1, 2, 3, 4],
      feedback: ["correct", "correct", "correct", "correct"],
    },
  },
  {
    fixtureIndex: 5,
    name: "short answer",
    answer: { ...checkedAnswer, pupilAnswer: "earth", feedback: "correct" },
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  usePupilLessonProgress.getState().resetLessonProgress();
  usePupilLessonQuiz.getState().resetQuiz();
  usePupilLessonProgress.getState().setRefreshReadOnly(refreshReadOnly);
  usePupilLessonProgress
    .getState()
    .setSubmitClassroomProgress(submitClassroomProgress);
});

afterEach(cleanup);

describe.each(["starter-quiz", "exit-quiz"] as const)(
  "resuming %s",
  (section) => {
    const openQuiz = (
      saved: LessonSectionResults = {},
      isReadOnly = false,
      questionsArray: QuizQuestion[] = questions,
    ) => {
      // Reopening the assignment hydrates new stores from saved Classroom progress.
      usePupilLessonProgress.getState().resetLessonProgress();
      usePupilLessonQuiz.getState().resetQuiz();
      usePupilLessonProgress.getState().initialiseLessonProgress({
        lessonSlug: "test-lesson",
        lessonReviewSections: ["starter-quiz", "exit-quiz"],
        initialSectionResults: saved,
        isReadOnly,
      });
      asPath = `/pupils/lessons/test-lesson/${section}?courseId=test-course`;
      return renderWithTheme(
        <QuizPageContent
          section={section}
          questionsArray={questionsArray}
          lessonSlug="test-lesson"
          phase="primary"
        />,
      );
    };

    it("waits for saved progress before initialising a directly reopened quiz", () => {
      asPath = `/pupils/lessons/test-lesson/${section}?courseId=test-course`;
      const page = renderWithTheme(
        <QuizPageContent
          section={section}
          questionsArray={questions}
          lessonSlug="test-lesson"
          phase="primary"
        />,
      );

      expect(page.queryByRole("button", { name: "Check" })).toBeNull();
      expect(usePupilLessonQuiz.getState().lessonSlug).toBeNull();

      act(() => {
        usePupilLessonProgress.getState().initialiseLessonProgress({
          lessonSlug: "test-lesson",
          lessonReviewSections: ["starter-quiz", "exit-quiz"],
          initialSectionResults: {
            [section]: {
              isComplete: false,
              grade: 2,
              numQuestions: 2,
              questionResults: [checkedAnswer, checkedAnswer],
            },
          },
        });
      });

      expect(usePupilLessonQuiz.getState().currentQuestionIndex).toBe(1);
      expect(page.getByText("Well done!")).toBeInTheDocument();
      expect(routerPush).not.toHaveBeenCalled();
    });

    it.each(savedAnswers)(
      "can finish a reopened $name final question",
      async ({ fixtureIndex, answer }) => {
        const finalQuestion = quizQuestions[fixtureIndex];
        if (!finalQuestion) throw new Error("question fixture missing");
        const user = userEvent.setup();
        const page = openQuiz(
          {
            [section]: {
              isComplete: false,
              grade: 1,
              numQuestions: 1,
              questionResults: [answer],
            },
          },
          false,
          [finalQuestion],
        );
        expect(routerPush).not.toHaveBeenCalled();
        expect(page.getByText("Well done!")).toBeInTheDocument();
        await user.click(
          page.getByRole("button", {
            name:
              section === "starter-quiz" ? "Continue lesson" : "Lesson review",
          }),
        );
        await waitFor(() => {
          expect(
            usePupilLessonProgress.getState().sectionResults[section]
              ?.isComplete,
          ).toBe(true);
        });
        expect(
          usePupilLessonProgress.getState().sectionResults[section]
            ?.questionResults,
        ).toEqual([answer]);
      },
    );

    it("allows completion after checking the final answer, handing in and unsubmitting", async () => {
      const user = userEvent.setup();
      const page = openQuiz({
        [section]: {
          isComplete: false,
          grade: 1,
          numQuestions: 2,
          questionResults: [
            checkedAnswer,
            { mode: "init", offerHint: false, grade: 0 },
          ],
        },
      });

      expect(usePupilLessonQuiz.getState().currentQuestionIndex).toBe(1);
      await user.click(
        page.getByRole("radio", {
          name: "a group of words that contains a verb and makes complete sense",
        }),
      );
      await user.click(page.getByRole("button", { name: "Check" }));
      const saved = usePupilLessonProgress.getState().sectionResults;
      expect(saved[section]?.isComplete).toBe(false);
      expect(saved[section]?.questionResults?.[1]?.mode).toBe("feedback");
      expect(routerPush).not.toHaveBeenCalled();

      // Google hand-in makes the assignment read-only without completing the quiz.
      act(() => usePupilLessonProgress.getState().setReadOnly(true));
      expect(routerPush).toHaveBeenCalledWith(
        "/pupils/lessons/test-lesson/review?courseId=test-course",
      );
      expect(usePupilLessonProgress.getState().sectionResults).toEqual(saved);
      page.unmount();
      routerPush.mockClear();

      // Unsubmit restores write access, with the same saved answers and completion flag.
      const reopened = openQuiz(saved, false);
      expect(routerPush).not.toHaveBeenCalled();
      expect(usePupilLessonQuiz.getState().currentQuestionIndex).toBe(1);
      expect(reopened.getByText("Well done!")).toBeInTheDocument();
      expect(
        reopened.getByRole("radio", {
          name: "a group of words that contains a verb and makes complete sense",
        }),
      ).toBeChecked();
      await user.click(
        reopened.getByRole("button", {
          name:
            section === "starter-quiz" ? "Continue lesson" : "Lesson review",
        }),
      );
      await waitFor(() => {
        expect(
          usePupilLessonProgress.getState().sectionResults[section]?.isComplete,
        ).toBe(true);
      });
      expect(routerPush).toHaveBeenCalledWith(
        "/pupils/lessons/test-lesson/overview?courseId=test-course",
      );
      expect(refreshReadOnly).not.toHaveBeenCalled();
      if (section === "exit-quiz") {
        expect(submitClassroomProgress).toHaveBeenCalledWith(
          expect.objectContaining({
            [section]: expect.objectContaining({ isComplete: true }),
          }),
        );
      } else {
        expect(submitClassroomProgress).not.toHaveBeenCalled();
      }
    });

    it("redirects a genuinely completed section", () => {
      openQuiz({
        [section]: {
          isComplete: true,
          grade: 2,
          numQuestions: 2,
          questionResults: [checkedAnswer, checkedAnswer],
        },
      });
      const destination = section === "starter-quiz" ? "overview" : "review";
      expect(routerPush).toHaveBeenCalledWith(
        `/pupils/lessons/test-lesson/${destination}?courseId=test-course`,
      );
      expect(submitClassroomProgress).not.toHaveBeenCalled();
    });

    it("keeps the checked final answer unfinished when leaving with Back", async () => {
      const user = userEvent.setup();
      const saved: LessonSectionResults = {
        [section]: {
          isComplete: false,
          grade: 2,
          numQuestions: 2,
          questionResults: [checkedAnswer, checkedAnswer],
        },
      };
      const page = openQuiz(saved);

      await user.click(page.getByRole("link", { name: /Back/ }));

      expect(usePupilLessonProgress.getState().sectionResults).toEqual(saved);
      expect(submitClassroomProgress).not.toHaveBeenCalled();
      expect(routerPush).toHaveBeenCalledWith(
        "/pupils/lessons/test-lesson/overview?courseId=test-course",
      );
      page.unmount();
      routerPush.mockClear();

      const reopened = openQuiz(
        usePupilLessonProgress.getState().sectionResults,
      );
      expect(routerPush).not.toHaveBeenCalled();
      expect(usePupilLessonQuiz.getState().currentQuestionIndex).toBe(1);
      expect(reopened.getByText("Well done!")).toBeInTheDocument();
    });

    it("does not complete or submit a checked quiz while it is still handed in", async () => {
      const user = userEvent.setup();
      const saved: LessonSectionResults = {
        [section]: {
          isComplete: false,
          grade: 2,
          numQuestions: 2,
          questionResults: [checkedAnswer, checkedAnswer],
        },
      };
      const page = openQuiz(saved, true);
      await user.click(
        page.getByRole("button", {
          name:
            section === "starter-quiz" ? "Continue lesson" : "Lesson review",
        }),
      );
      expect(routerPush).toHaveBeenCalledWith(
        "/pupils/lessons/test-lesson/review?courseId=test-course",
      );
      expect(usePupilLessonProgress.getState().sectionResults).toEqual(saved);
      expect(submitClassroomProgress).not.toHaveBeenCalled();
      expect(refreshReadOnly).not.toHaveBeenCalled();
    });
  },
);
