import { LessonOverviewProps } from "./LessonOverview.view";
import { containsMathJax, hasLessonMathJax } from "./hasLessonMathJax";

import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

describe("hasLessonMathJax", () => {
  const basicLesson: LessonOverviewProps["lesson"] = {
    isLegacy: false,
    lessonSlug: "example-slug",
    lessonTitle: "Example Lesson Title",
    tierTitle: null,
    tierSlug: null,
    contentGuidance: [],
    misconceptionsAndCommonMistakes: [],
    teacherTips: [],
    keyLearningPoints: [],
    lessonKeywords: [],
    copyrightContent: [{ copyrightInfo: "this" }],
    supervisionLevel: null,
    worksheetUrl: null,
    presentationUrl: null,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    transcriptSentences: null,
    isWorksheetLandscape: null,
    hasLegacyCopyrightMaterial: null,
    expired: null,
    starterQuiz: [],
    exitQuiz: [],
    videoTitle: null,
    lessonCohort: null,
    downloads: [],
    isSpecialist: false,
    isCanonical: false,
    keyStageTitle: "Example Key Stage Title",
    keyStageSlug: "example-key-stage-slug",
    subjectTitle: "Example Subject Title",
    subjectSlug: "example-subject-slug",
    unitTitle: "Example Unit Title",
    unitSlug: "example-unit-slug",
    programmeSlug: "example-programme-slug",
    lessonGuideUrl: null,
    updatedAt: "2022",
    hasMediaClips: false,
    lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
    additionalFiles: null,
    lessonOutline: null,
    lessonReleaseDate: "2022-02-01T00:00:00Z",
    orderInUnit: 1,
    unitTotalLessonCount: 1,
    loginRequired: false,
    geoRestricted: false,
    excludedFromTeachingMaterials: false,
  };

  it("detects MathJax in keyLearningPoints", () => {
    const lessonWithMathJaxInKLP = {
      ...basicLesson,
      keyLearningPoints: [
        { keyLearningPoint: "Important point $$\\int_0^1 x^2 dx$$" },
      ],
    };
    expect(hasLessonMathJax(lessonWithMathJaxInKLP, "maths", false)).toBe(true);
  });
  it("containMathJax returns false with no text", () => {
    expect(containsMathJax(undefined)).toBe(false);
  });

  it("detects MathJax in lessonKeywords", () => {
    const lessonWithMathJaxInKeywords = {
      ...basicLesson,
      lessonKeywords: [
        {
          keyword: "Calculus",
          description: "Study of change, e.g., $$\\frac{df}{dx}$$",
        },
      ],
    };
    expect(hasLessonMathJax(lessonWithMathJaxInKeywords, "maths", false)).toBe(
      true,
    );
  });

  it("detects MathJax in multiple-choice quiz answers", () => {
    const lessonWithMathJaxInMCQuiz: LessonOverviewProps["lesson"] = {
      ...basicLesson,
      exitQuiz: [
        {
          questionId: 2,
          questionUid: "mc-uid",
          questionType: "multiple-choice",
          questionStem: [
            { text: "Calculate the integral $$\\int x dx$$", type: "text" },
          ],
          answers: {
            "multiple-choice": [
              {
                answer: [
                  {
                    text: "The answer is $$\\frac{x^2}{2} + C$$",
                    type: "text",
                  },
                ],
                answerIsCorrect: true,
              },
            ],
          },
          feedback: "Check integration rules.",
          hint: "Integral of x is x raised to the power of one plus one divided by new power.",
          active: true,
        },
      ],
    };
    expect(hasLessonMathJax(lessonWithMathJaxInMCQuiz, "maths", false)).toBe(
      true,
    );
  });

  it("detects MathJax in match quiz answers", () => {
    const lessonWithMathJaxInMatchQuiz: LessonOverviewProps["lesson"] = {
      ...basicLesson,
      starterQuiz: [
        {
          questionId: 3,
          questionUid: "match-uid",
          questionType: "match",
          questionStem: [
            {
              text: "Match the following expressions to their simplified forms",
              type: "text",
            },
          ],
          answers: {
            match: [
              {
                correctChoice: [{ text: "$$x^2 - x^2$$", type: "text" }],
                matchOption: [{ text: "$$0$$", type: "text" }],
              },
            ],
          },
          feedback: "Remember that any term minus itself equals zero.",
          hint: "Subtract the terms.",
          active: true,
        },
      ],
    };
    expect(hasLessonMathJax(lessonWithMathJaxInMatchQuiz, "maths", false)).toBe(
      true,
    );
  });
  it("detects MathJax in match quiz answers", () => {
    const lessonWithMathJaxInMatchQuiz: LessonOverviewProps["lesson"] = {
      ...basicLesson,
      starterQuiz: [
        {
          questionId: 3,
          questionUid: "match-uid",
          questionType: "match",
          questionStem: [
            {
              text: "Match the following expressions to their simplified forms",
              type: "text",
            },
          ],
          answers: {
            match: [
              {
                correctChoice: [{ text: "$$x^2 - x^2$$", type: "text" }],
                matchOption: [{ text: "$$0$$", type: "text" }],
              },
            ],
          },
          feedback: "Remember that any term minus itself equals zero.",
          hint: "Subtract the terms.",
          active: true,
        },
      ],
    };
    expect(hasLessonMathJax(lessonWithMathJaxInMatchQuiz, "maths", false)).toBe(
      true,
    );
  });

  it("detects MathJax in order quiz answers", () => {
    const lessonWithMathJaxInOrderQuiz: LessonOverviewProps["lesson"] = {
      ...basicLesson,
      exitQuiz: [
        {
          questionId: 4,
          questionUid: "order-uid",
          questionType: "order",
          questionStem: [
            {
              text: "Place these steps of solving an equation in the correct order",
              type: "text",
            },
          ],
          answers: {
            order: [
              {
                answer: [
                  { text: "First, isolate $$x$$ on one side", type: "text" },
                ],
                correctOrder: 1,
              },
            ],
          },
          feedback: "Review the steps of equation solving.",
          hint: "Start with moving terms to one side.",
          active: true,
        },
      ],
    };
    expect(hasLessonMathJax(lessonWithMathJaxInOrderQuiz, "maths", false)).toBe(
      true,
    );
  });

  it("detects MathJax in short-answer quiz answers", () => {
    const lessonWithMathJaxInShortAnswerQuiz: LessonOverviewProps["lesson"] = {
      ...basicLesson,
      starterQuiz: [
        {
          questionId: 5,
          questionUid: "short-uid",
          questionType: "short-answer",
          questionStem: [
            { text: "What is the derivative of $$x^2$$?", type: "text" },
          ],
          answers: {
            "short-answer": [
              {
                answer: [{ text: "$$2x$$", type: "text" }],
                answerIsDefault: true,
              },
            ],
          },
          feedback:
            "Power rule: bring down the exponent and subtract one from it.",
          hint: "Differentiate using the power rule.",
          active: true,
        },
      ],
    };
    expect(
      hasLessonMathJax(lessonWithMathJaxInShortAnswerQuiz, "maths", false),
    ).toBe(true);
  });

  it("detects MathJax in exitQuiz questions and answers", () => {
    const lessonWithMathJaxInExitQuiz: LessonOverviewProps["lesson"] = {
      ...basicLesson,
      exitQuiz: [
        {
          questionId: 1,
          questionUid: "example-uid",
          questionType: "multiple-choice",
          questionStem: [
            { text: "What is $$x$$ if $$x^2 = 4$$?", type: "text" },
          ],
          answers: {
            "multiple-choice": [
              {
                answer: [{ text: "Answer is $$x = \\pm 2$$", type: "text" }],
                answerIsCorrect: true,
              },
            ],
          },
          feedback: "Good job!",
          hint: "Remember $$x^2$$ means x squared",
          active: true,
        },
      ],
    };
    expect(hasLessonMathJax(lessonWithMathJaxInExitQuiz, "maths", false)).toBe(
      true,
    );
  });

  it("detects MathJax in starterQuiz questions", () => {
    const lessonWithMathJaxInStarterQuiz: LessonOverviewProps["lesson"] = {
      ...basicLesson,
      starterQuiz: [
        {
          questionId: 1,
          questionUid: "example-uid",
          questionType: "multiple-choice", //
          questionStem: [
            { text: "Solve $$x + 5 = 10$$ for $$x$$", type: "text" },
          ],
          feedback: "Look at isolating $$x$$.",
          hint: "Subtract 5 from both sides.",
          active: true,
        },
      ],
    };
    expect(
      hasLessonMathJax(lessonWithMathJaxInStarterQuiz, "maths", false),
    ).toBe(true);
  });

  it("returns false when MathJax is not present in any sections", () => {
    expect(hasLessonMathJax(basicLesson, "maths", false)).toBe(false);
  });
  it("returns false when subject is not allowed", () => {
    expect(hasLessonMathJax(basicLesson, "computing", false)).toBe(false);
  });
  it("returns false when legacy is not allowed", () => {
    expect(hasLessonMathJax(basicLesson, "computing", true)).toBe(false);
  });
});
