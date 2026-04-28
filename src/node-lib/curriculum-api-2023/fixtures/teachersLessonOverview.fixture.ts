import lessonMediaClipsFixtures from "./lessonMediaClips.fixture";
import { quizQuestions } from "./quizElements.fixture";

import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";

const teachersLessonOverviewFixture = (
  partial?: Partial<TeachersLessonOverviewPageData>,
): TeachersLessonOverviewPageData => {
  return {
    expired: false,
    unitTitle: "Cells",
    programmeSlug: "biology-secondary-ks3",
    unitSlug: "cells",
    lessonSlug: "lesson-3-structure-of-cells",
    lessonTitle: "Structure of cells",
    keyStageSlug: "ks3",
    keyStageTitle: "Key Stage 3",
    subjectSlug: "biology",
    subjectTitle: "Biology",
    subjectParent: null,
    phaseSlug: "secondary",
    phaseTitle: "Secondary",
    pathwaySlug: null,
    yearGroupTitle: "Year 7",
    year: "7",
    examBoardTitle: null,
    examBoardSlug: null,
    misconceptionsAndCommonMistakes: [{ response: "", misconception: "" }],
    lessonEquipmentAndResources: null,
    teacherTips: null,
    loginRequired: false,
    geoRestricted: false,
    keyLearningPoints: [
      {
        keyLearningPoint:
          "Cells are the basic unit of life and contain specialised structures.",
      },
    ],
    pupilLessonOutcome:
      "You can describe the main parts of a cell and their functions.",
    lessonKeywords: [
      {
        keyword: "nucleus",
        description: "the control centre of the cell",
      },
    ],
    contentGuidance: [],
    supervisionLevel: null,
    additionalMaterialUrl: null,
    presentationUrl: null,
    worksheetUrl: null,
    isWorksheetLandscape: false,
    hasLegacyCopyrightMaterial: false,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    transcriptSentences: ["this is a sentence", "this is another sentence"],
    starterQuiz: quizQuestions,
    exitQuiz: quizQuestions,
    downloads: [
      { exists: true, type: "intro-quiz-answers" },
      { exists: true, type: "intro-quiz-questions" },
      { exists: true, type: "exit-quiz-answers" },
      { exists: true, type: "exit-quiz-questions" },
      { exists: true, type: "worksheet-pdf" },
      { exists: true, type: "worksheet-pptx" },
      { exists: true, type: "presentation" },
    ],
    updatedAt: "2024-09-29T14:00:00.000Z",
    lessonGuideUrl: null,
    hasMediaClips: false,
    lessonMediaClips: lessonMediaClipsFixtures().mediaClips,
    additionalFiles: ["file1", "file2"],
    lessonOutline: [{ lessonOutline: "This is the lesson outline" }],
    lessonReleaseDate: "2024-09-29T14:00:00.000Z",
    orderInUnit: 3,
    unitTotalLessonCount: 6,
    excludedFromTeachingMaterials: false,
    subjectCategories: null,
    previousLesson: null,
    nextLesson: null,
    ...partial,
  };
};

export default teachersLessonOverviewFixture;
