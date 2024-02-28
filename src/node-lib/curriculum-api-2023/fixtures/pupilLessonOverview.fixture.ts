import { PupilLessonOverviewPageData } from "../queries/pupilLessonOverview/pupilLessonOverview.schema";

import { quizQuestions } from "./quizElements.fixture";

export const pupilLessonOverviewFixture = (
  partial?: Partial<PupilLessonOverviewPageData>,
): PupilLessonOverviewPageData => {
  return {
    isLegacy: true,
    lessonSlug:
      "lesson-4-in-grammar-1-simple-compound-and-adverbial-complex-sentences",
    lessonTitle: "Adverbial complex sentences",
    subjectSlug: "english",
    subjectTitle: "English",
    unitSlug: "grammar-1",
    yearTitle: "Year 3",
    lessonEquipmentAndResources: null,
    pupilLessonOutcome:
      "You understand that a complex sentence is formed of at least one main clause and any type of subordinate clause.",
    contentGuidance: [],
    supervisionLevel: null,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    transcriptSentences: [],
    starterQuiz: quizQuestions,
    exitQuiz: quizQuestions,
    ...partial,
  };
};
