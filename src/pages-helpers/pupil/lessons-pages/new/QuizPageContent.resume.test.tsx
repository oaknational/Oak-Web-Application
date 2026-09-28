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
const submitClassroomProgress = jest.fn().mockResolvedValue({ status: "OK" });
const refreshReadOnly = jest.fn(() => new Promise<boolean>(() => undefined));

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
    const openQuiz = (saved: LessonSectionResults = {}, isReadOnly = false) => {
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
          questionsArray={questions}
          lessonSlug="test-lesson"
          phase="primary"
        />,
      );
    };

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
