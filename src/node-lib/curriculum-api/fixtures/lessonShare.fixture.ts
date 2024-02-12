import { LessonShareData } from "..";

const lessonShareFixtures = (
  partial?: Partial<LessonShareData>,
): LessonShareData => {
  return {
    isLegacy: true,
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
    lessonCohort: "2020-2023",
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
    ...partial,
  };
};

export default lessonShareFixtures;
