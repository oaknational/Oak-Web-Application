import { PupilLessonOverviewData } from "..";

import { quizQuestions } from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

const pupilLessonOverviewFixture = (
  partial?: Partial<PupilLessonOverviewData>,
): PupilLessonOverviewData => {
  return {
    lessonTitle: "Islamic Geometry",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    unitSlug: "geometry",
    unitTitle: "Geometry",
    keyStageSlug: "ks3",
    keyStageTitle: "Key Stage 3",
    programmeSlug: "programme-slug",
    starterQuiz: quizQuestions,
    lessonSlug: "lesson-slug",
    supervisionLevel: null,
    contentGuidance: null,
    lessonEquipmentAndResources: null,
    videoMuxPlaybackId: "mux-id",
    videoWithSignLanguageMuxPlaybackId: "signed-mux-id",
    transcriptSentences: ["This is a sentence.", "This is another sentence"],
    videoTitle: "Introduction to Islamic Geometry",
    isLegacy: false,
    pupilLessonOutcome: undefined,
    expired: false,
    ...partial,
  };
};

export default pupilLessonOverviewFixture;
