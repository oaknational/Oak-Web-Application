import {
  getCompletedQuizSectionResults,
  getHydratedQuizRedirectSection,
  getQuizCompletionDestination,
  getSelectedMultipleChoiceAnswers,
  gradeQuestionFromFormData,
} from "./quizPageContentHelpers";

import {
  mcqTextAnswers,
  quizQuestions,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";
import { LessonSectionResults } from "@/context/PupilLessonProgress";

const mcqQuestion = quizQuestions[0];
const matchQuestion = quizQuestions[3];
const orderQuestion = quizQuestions[4];
const shortQuestion = quizQuestions[5];
if (!mcqQuestion || !matchQuestion || !orderQuestion || !shortQuestion) {
  throw new Error("quiz question fixtures missing");
}

describe("quizPageContentHelpers", () => {
  describe("getHydratedQuizRedirectSection", () => {
    it("redirects exit-quiz to review", () => {
      expect(getHydratedQuizRedirectSection("exit-quiz")).toBe("review");
    });

    it("redirects starter-quiz to overview", () => {
      expect(getHydratedQuizRedirectSection("starter-quiz")).toBe("overview");
    });
  });

  describe("getCompletedQuizSectionResults", () => {
    it("marks the current section complete while preserving its other fields", () => {
      const sectionResults: LessonSectionResults = {
        "starter-quiz": {
          isComplete: false,
          grade: 2,
          numQuestions: 4,
        },
      };
      const result = getCompletedQuizSectionResults({
        section: "starter-quiz",
        sectionResults,
      });
      expect(result["starter-quiz"]).toEqual({
        isComplete: true,
        grade: 2,
        numQuestions: 4,
      });
    });

    it("does not mutate the input object", () => {
      const sectionResults: LessonSectionResults = {
        "starter-quiz": { isComplete: false, grade: 0, numQuestions: 0 },
      };
      getCompletedQuizSectionResults({
        section: "starter-quiz",
        sectionResults,
      });
      expect(sectionResults["starter-quiz"]?.isComplete).toBe(false);
    });

    it("leaves other sections untouched", () => {
      const sectionResults: LessonSectionResults = {
        "starter-quiz": { isComplete: true, grade: 4, numQuestions: 4 },
        "exit-quiz": { isComplete: false, grade: 1, numQuestions: 4 },
      };
      const result = getCompletedQuizSectionResults({
        section: "exit-quiz",
        sectionResults,
      });
      expect(result["starter-quiz"]).toEqual(sectionResults["starter-quiz"]);
      expect(result["exit-quiz"]?.isComplete).toBe(true);
    });
  });

  describe("getQuizCompletionDestination", () => {
    it("returns 'review' when every review section is complete", () => {
      const sectionResults: LessonSectionResults = {
        "starter-quiz": { isComplete: true, grade: 0, numQuestions: 0 },
        "exit-quiz": { isComplete: true, grade: 0, numQuestions: 0 },
      };
      expect(
        getQuizCompletionDestination({
          sectionResults,
          lessonReviewSections: ["starter-quiz", "exit-quiz"],
        }),
      ).toBe("review");
    });

    it("returns 'overview' when any review section is incomplete", () => {
      const sectionResults: LessonSectionResults = {
        "starter-quiz": { isComplete: true, grade: 0, numQuestions: 0 },
        "exit-quiz": { isComplete: false, grade: 0, numQuestions: 0 },
      };
      expect(
        getQuizCompletionDestination({
          sectionResults,
          lessonReviewSections: ["starter-quiz", "exit-quiz"],
        }),
      ).toBe("overview");
    });

    it("returns 'overview' when a required section has no entry", () => {
      expect(
        getQuizCompletionDestination({
          sectionResults: {},
          lessonReviewSections: ["starter-quiz"],
        }),
      ).toBe("overview");
    });
  });

  describe("getSelectedMultipleChoiceAnswers", () => {
    it("returns the selected answers in the order they appear in formData", () => {
      const formData = new FormData();
      formData.append("answer-0", "answer-2");
      formData.append("answer-1", "answer-0");

      const selected = getSelectedMultipleChoiceAnswers({
        formData,
        answers: mcqTextAnswers,
      });
      expect(selected).toEqual([mcqTextAnswers[2], mcqTextAnswers[0]]);
    });

    it("skips entries whose trailing index does not point at an answer", () => {
      const formData = new FormData();
      formData.append("answer-0", "answer-9");
      formData.append("answer-1", "answer-1");

      const selected = getSelectedMultipleChoiceAnswers({
        formData,
        answers: mcqTextAnswers,
      });
      expect(selected).toEqual([mcqTextAnswers[1]]);
    });

    it("returns an empty array when formData is empty", () => {
      expect(
        getSelectedMultipleChoiceAnswers({
          formData: new FormData(),
          answers: mcqTextAnswers,
        }),
      ).toEqual([]);
    });
  });

  describe("gradeQuestionFromFormData", () => {
    it("grades a multiple-choice question from submitted answer values", () => {
      const formData = new FormData();
      formData.append("answer-0", "answer-2");

      const result = gradeQuestionFromFormData({
        currentQuestionData: mcqQuestion,
        formData,
      });
      expect(result?.mode).toBe("feedback");
      expect(result?.grade).toBe(1);
    });

    it("returns null when an MCQ has no answer list", () => {
      const broken = { ...mcqQuestion, answers: null };
      const result = gradeQuestionFromFormData({
        currentQuestionData: broken,
        formData: new FormData(),
      });
      expect(result).toBeNull();
    });

    it("grades a short-answer question using the field for its uid", () => {
      const formData = new FormData();
      formData.append(`short-answer-${shortQuestion.questionUid}`, "earth");

      const result = gradeQuestionFromFormData({
        currentQuestionData: shortQuestion,
        formData,
      });
      expect(result?.mode).toBe("feedback");
      expect(result?.grade).toBe(1);
    });

    it("grades an order question by reading the per-uid order inputs", () => {
      const formData = new FormData();
      formData.append(`order-${orderQuestion.questionUid}`, "1");
      formData.append(`order-${orderQuestion.questionUid}`, "2");
      formData.append(`order-${orderQuestion.questionUid}`, "3");
      formData.append(`order-${orderQuestion.questionUid}`, "4");

      const result = gradeQuestionFromFormData({
        currentQuestionData: orderQuestion,
        formData,
      });
      expect(result?.mode).toBe("feedback");
      expect(result?.grade).toBe(1);
    });

    it("grades a match question by pairing match and choice inputs", () => {
      const formData = new FormData();
      ["0", "1", "2"].forEach((value) => {
        formData.append(`match-${matchQuestion.questionUid}-match`, value);
        formData.append(`match-${matchQuestion.questionUid}-choice`, value);
      });

      const result = gradeQuestionFromFormData({
        currentQuestionData: matchQuestion,
        formData,
      });
      expect(result?.mode).toBe("feedback");
      expect(result?.grade).toBe(1);
    });

    it("returns null for unsupported question types", () => {
      const explanatory = {
        ...mcqQuestion,
        questionType: "explanatory-text" as const,
      };
      expect(
        gradeQuestionFromFormData({
          currentQuestionData: explanatory,
          formData: new FormData(),
        }),
      ).toBeNull();
    });
  });
});
