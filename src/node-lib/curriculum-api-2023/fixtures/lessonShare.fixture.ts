import {
  LessonShareCanonical,
  LessonShareData,
} from "../queries/lessonShare/lessonShare.schema";

const lessonShareFixtures = (
  partial?: Partial<LessonShareData>,
): LessonShareData => {
  return {
    expired: false,
    isLegacy: true,
    isSpecialist: false,
    lessonSlug: "macbeth-lesson-1",
    lessonTitle: "Islamic Geometry",
    programmeSlug: "maths-higher-ks4-l",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    unitSlug: "geometry",
    unitTitle: "Geometry",
    tierSlug: null,
    tierTitle: null,
    examBoardSlug: null,
    examBoardTitle: null,
    shareableResources: [
      {
        type: "exit-quiz-questions",
        exists: true,
        label: "Exit quiz",
        metadata: "6 questions",
      },
      {
        type: "intro-quiz-questions",
        exists: true,
        label: "Starter quiz",
        metadata: "6 questions",
      },
      {
        type: "video",
        exists: true,
        label: "Video",
        metadata: "20:31",
      },
    ],
    lessonReleaseDate: "2025-09-29T14:00:00.000Z",
    georestricted: false,
    loginRequired: false,
    ...partial,
  };
};

export const lessonShareCanonicalFixture = (
  partial?: Partial<LessonShareCanonical>,
): LessonShareCanonical => {
  return {
    ...lessonShareFixtures(),
    pathways: [
      {
        programmeSlug: "maths-higher-ks4-l",
        unitSlug: "geometry",
        unitTitle: "Geometry",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
      },
    ],
    ...partial,
  };
};

export default lessonShareFixtures;
