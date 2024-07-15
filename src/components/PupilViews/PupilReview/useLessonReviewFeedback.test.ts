import { useLessonReviewFeedback } from "./useLessonReviewFeedback";

describe("useLessonReviewFeedback", () => {
  it("should return 'Well done, you're Oaking it!' when isLessonComplete is false", () => {
    // Test case
    const { finalFeedback } = useLessonReviewFeedback(false, {});
    expect(finalFeedback).toBe("Well done, you're Oaking it!");
  });

  it("should return 'Fantastic job - well done!' when both quizzes are 100% correct", () => {
    const { finalFeedback } = useLessonReviewFeedback(true, {
      "starter-quiz": { grade: 5, numQuestions: 5, isComplete: true },
      "exit-quiz": { grade: 5, numQuestions: 5, isComplete: true },
    });
    expect(finalFeedback).toBe("Fantastic job - well done!");
  });

  it("should return 'Great effort!' when both quizzes are not 100% correct", () => {
    const { finalFeedback } = useLessonReviewFeedback(true, {
      "starter-quiz": { grade: 4, numQuestions: 5, isComplete: true },
      "exit-quiz": { grade: 5, numQuestions: 5, isComplete: true },
    });
    expect(finalFeedback).toBe("Great effort!");
  });

  it("should handle edge case when there are no quizzes", () => {
    const { finalFeedback } = useLessonReviewFeedback(true, {});
    expect(finalFeedback).toBe("Fantastic job - well done!");
  });
});
