import {
  OakQuizMatchItemId,
  OakQuizOrderitemId,
} from "@oaknational/oak-components";

import {
  getAdditionalFileAssetIds,
  getDedupedContentGuidanceLabels,
  getHasQuizSections,
  getIntroBottomNavLabel,
  getIntroWorksheetInitResult,
  getIsLessonExpiring,
  getNarrowTranscriptSentences,
  getQuizNextStep,
  getUnitListingHref,
  getVideoPlaybackId,
  isQuizSection,
  pickAvailableSectionsForLesson,
  mapLessonSummaryQuizResults,
  buildReviewAttemptData,
  buildReviewShareUrl,
  pickNextIncompleteSection,
  pickProceedToNextSectionLabel,
  pickQuizFeedbackState,
  pickQuizNavigationButtonLabel,
  pickQuizTabId,
  pickQuizTooltip,
  pickSectionProgress,
  shouldPersistVideoTimeElapsed,
  shouldShowReviewBottomNav,
  shouldInitIntroWorksheetResult,
} from ".";

import { multipleChoiceAnswerId } from "@/components/PupilComponents/LegacyQuiz/QuizMCQMultiAnswer";
import { shortAnswerInputId } from "@/components/PupilComponents/LegacyQuiz/QuizShortAnswer";
import {
  matchAnswers,
  mcqTextAnswers,
  orderAnswers,
  shortAnswers,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.new.fixture";

describe("ViewHelpers", () => {
  describe("pickNextIncompleteSection", () => {
    it("returns the first incomplete section", () => {
      expect(
        pickNextIncompleteSection({
          lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
          sectionResults: {
            intro: { isComplete: true },
            "starter-quiz": { isComplete: false },
          },
        }),
      ).toBe("starter-quiz");
    });

    it("returns review when all sections are complete", () => {
      expect(
        pickNextIncompleteSection({
          lessonReviewSections: ["intro", "starter-quiz"],
          sectionResults: {
            intro: { isComplete: true },
            "starter-quiz": { isComplete: true },
          },
        }),
      ).toBe("review");
    });
  });

  describe("pickProceedToNextSectionLabel", () => {
    it("returns Lesson review when lesson is complete", () => {
      expect(
        pickProceedToNextSectionLabel({
          lessonStarted: true,
          isLessonComplete: true,
          sectionResults: {},
        }),
      ).toBe("Lesson review");
    });

    it("returns Start lesson when intro is complete but lesson not started", () => {
      expect(
        pickProceedToNextSectionLabel({
          lessonStarted: false,
          isLessonComplete: false,
          sectionResults: { intro: { isComplete: true } },
        }),
      ).toBe("Start lesson");
    });
  });

  describe("pickSectionProgress", () => {
    it("returns complete, in-progress and not-started as expected", () => {
      expect(
        pickSectionProgress({
          section: "intro",
          sectionResults: { intro: { isComplete: true } },
        }),
      ).toBe("complete");
      expect(
        pickSectionProgress({
          section: "video",
          sectionResults: { video: { isComplete: false } },
        }),
      ).toBe("in-progress");
      expect(
        pickSectionProgress({
          section: "exit-quiz",
          sectionResults: {},
        }),
      ).toBe("not-started");
    });
  });

  describe("file and guidance helpers", () => {
    it("gets additional file asset ids", () => {
      expect(
        getAdditionalFileAssetIds([{ assetId: 1 }, { assetId: 2 }, null]),
      ).toEqual([1, 2]);
    });

    it("dedupes guidance labels", () => {
      expect(
        getDedupedContentGuidanceLabels([
          {
            contentguidanceLabel: "Contains conflict.",
            contentguidanceArea: null,
            contentguidanceDescription: null,
          },
          {
            contentguidanceLabel: "Contains conflict.",
            contentguidanceArea: null,
            contentguidanceDescription: null,
          },
          {
            contentguidanceLabel: "Mentions loss.",
            contentguidanceArea: null,
            contentguidanceDescription: null,
          },
        ]),
      ).toEqual(["Contains conflict.", "Mentions loss."]);
    });
  });

  describe("overview/experience helpers", () => {
    it("picks available lesson sections", () => {
      expect(
        pickAvailableSectionsForLesson({
          starterQuiz: [],
          exitQuiz: [],
          videoMuxPlaybackId: null,
        } as never),
      ).toEqual(["intro"]);
    });

    it("builds unit listing href", () => {
      expect(
        getUnitListingHref({
          subjectSlug: "english",
          phaseSlug: "primary",
          yearSlug: "year-1",
        }),
      ).toBe("/pupils/programmes/english-primary-year-1/options");
    });

    it("detects expiring lesson", () => {
      expect(
        getIsLessonExpiring({
          expirationDate: "2026-01-01",
          displayExpiringBanner: false,
        }),
      ).toBe(true);
      expect(
        getIsLessonExpiring({
          expirationDate: null,
          displayExpiringBanner: true,
        }),
      ).toBe(true);
    });

    it("narrows transcript sentences into array", () => {
      expect(getNarrowTranscriptSentences("Sentence")).toEqual(["Sentence"]);
      expect(getNarrowTranscriptSentences(undefined)).toEqual([""]);
    });
  });

  describe("intro helpers", () => {
    it("returns intro bottom nav label", () => {
      expect(getIntroBottomNavLabel(true)).toBe("Continue lesson");
      expect(getIntroBottomNavLabel(false)).toBe("I'm ready");
    });

    it("initialises worksheet result", () => {
      expect(
        getIntroWorksheetInitResult({
          worksheetDownloaded: undefined,
          hasWorksheet: true,
        }),
      ).toEqual({
        worksheetDownloaded: false,
        worksheetAvailable: true,
      });
      expect(
        shouldInitIntroWorksheetResult({
          worksheetAvailable: undefined,
          currentSection: "intro",
        }),
      ).toBe(true);
    });
  });

  describe("video helpers", () => {
    it("picks sign-language playback id when enabled", () => {
      expect(
        getVideoPlaybackId({
          signLanguageOn: true,
          videoMuxPlaybackId: "standard",
          videoWithSignLanguageMuxPlaybackId: "signed",
        }),
      ).toBe("signed");
    });

    it("persists on non-playing events or when elapsed threshold met", () => {
      expect(
        shouldPersistVideoTimeElapsed({
          event: "pause",
          nextTimeElapsed: 5,
          currentTimeElapsed: 4,
          currentSection: "video",
        }),
      ).toBe(true);

      expect(
        shouldPersistVideoTimeElapsed({
          event: "playing",
          nextTimeElapsed: 21,
          currentTimeElapsed: 10,
          currentSection: "video",
        }),
      ).toBe(true);

      expect(
        shouldPersistVideoTimeElapsed({
          event: "playing",
          nextTimeElapsed: 15,
          currentTimeElapsed: 10,
          currentSection: "video",
        }),
      ).toBe(false);
    });
  });

  describe("quiz helpers", () => {
    it("identifies quiz sections", () => {
      expect(isQuizSection("starter-quiz")).toBe(true);
      expect(isQuizSection("overview")).toBe(false);
    });

    it("determines quiz next step", () => {
      expect(
        getQuizNextStep({
          currentQuestionIndex: 0,
          numQuestions: 3,
          currentSection: "starter-quiz",
          isReadOnly: false,
        }),
      ).toEqual({ action: "next-question" });
      expect(
        getQuizNextStep({
          currentQuestionIndex: 2,
          numQuestions: 3,
          currentSection: "starter-quiz",
          isReadOnly: false,
        }),
      ).toEqual({ action: "complete-quiz" });
      expect(
        getQuizNextStep({
          currentQuestionIndex: 0,
          numQuestions: 3,
          currentSection: "exit-quiz",
          isReadOnly: true,
        }),
      ).toEqual({ action: "go-review" });
    });

    it("picks feedback state", () => {
      expect(pickQuizFeedbackState(true)).toBe("correct");
      expect(pickQuizFeedbackState(false, true)).toBe("partially-correct");
      expect(pickQuizFeedbackState(false, false)).toBe("incorrect");
    });

    it("picks navigation button label", () => {
      expect(
        pickQuizNavigationButtonLabel({
          currentQuestionIndex: 0,
          numQuestions: 3,
          currentSection: "starter-quiz",
        }),
      ).toBe("Next question");

      expect(
        pickQuizNavigationButtonLabel({
          currentQuestionIndex: 2,
          numQuestions: 3,
          currentSection: "exit-quiz",
        }),
      ).toBe("Lesson review");
    });

    it("picks quiz tooltip by answer type", () => {
      expect(pickQuizTooltip({ order: orderAnswers })).toBe(
        "You need to order to move on!",
      );
      expect(pickQuizTooltip({ match: matchAnswers })).toBe(
        "You need to match to move on!",
      );
      expect(pickQuizTooltip({ "short-answer": shortAnswers })).toBe(
        "You need to type an answer to move on!",
      );
      expect(pickQuizTooltip({ "multiple-choice": mcqTextAnswers })).toBe(
        "You need to select an answer to move on!",
      );
    });

    it("picks quiz tab id by answer type", () => {
      expect(pickQuizTabId({ order: orderAnswers }, "Q1")).toBe(
        OakQuizOrderitemId("1"),
      );
      expect(pickQuizTabId({ match: matchAnswers }, "Q1")).toBe(
        OakQuizMatchItemId("0"),
      );
      expect(pickQuizTabId({ "short-answer": shortAnswers }, "Q1")).toBe(
        shortAnswerInputId("Q1"),
      );
      expect(pickQuizTabId({ "multiple-choice": mcqTextAnswers }, "Q1")).toBe(
        multipleChoiceAnswerId("Q1", 0),
      );
    });
  });

  describe("review helpers", () => {
    it("builds review attempt data and share url", () => {
      expect(
        buildReviewAttemptData({
          lessonSlug: "slug",
          lessonTitle: "title",
          subject: "Maths",
          yearDescription: "Year 7",
          sectionResults: {},
        }),
      ).toEqual({
        lessonData: { slug: "slug", title: "title" },
        browseData: { subject: "Maths", yearDescription: "Year 7" },
        sectionResults: {},
      });

      process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL = "https://example.com";
      expect(
        buildReviewShareUrl({ lessonSlug: "lesson", attemptId: "attempt" }),
      ).toContain("/pupils/lessons/lesson/results/attempt/share");
    });

    it("maps summary quiz results", () => {
      expect(
        mapLessonSummaryQuizResults({
          section: "starter-quiz",
          questionResults: [{ grade: 1, offerHint: false }],
          questionsArray: [
            {
              questionType: "multiple-choice",
              hint: "Hint",
            } as never,
          ],
        }),
      ).toEqual([
        {
          pupilExperienceLessonActivity: "starter-quiz",
          questionNumber: 1,
          questionType: "multiple-choice",
          questionResult: "correct",
          hintOffered: true,
          hintAccessed: false,
          activityTimeSpent: 0,
        },
      ]);
    });

    it("detects presence of quiz sections", () => {
      expect(getHasQuizSections(["intro", "video"])).toBe(false);
      expect(getHasQuizSections(["intro", "starter-quiz"])).toBe(true);
    });

    it("decides review bottom nav visibility", () => {
      expect(
        shouldShowReviewBottomNav({
          classroomAssignmentChecked: true,
          isClassroomAssignment: false,
        }),
      ).toBe(true);
      expect(
        shouldShowReviewBottomNav({
          classroomAssignmentChecked: true,
          isClassroomAssignment: true,
        }),
      ).toBe(false);
    });
  });
});
