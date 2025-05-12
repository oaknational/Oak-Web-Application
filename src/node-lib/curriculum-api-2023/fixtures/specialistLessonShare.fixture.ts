import { SpecialistLessonShareData } from "../queries/specialistLessonShare/specialistLessonShare.schema";

export const SpecialistLessonShareFixture = (
  partial?: SpecialistLessonShareData,
): SpecialistLessonShareData => ({
  programmeSlug: "independent-living-applying-learning",
  lessonSlug: "online-safety-c5gk8r",
  isSpecialist: true,
  lessonTitle: "Online Safety",
  unitSlug: "staying-safe-al-5556",
  unitTitle: "Staying Safe",
  subjectSlug: "independent-living",
  subjectTitle: "Independent Living",
  lessonReleaseDate: "2025-09-29T14:00:00.000Z",
  shareableResources: [
    {
      exists: true,
      type: "video",
      label: "Video",
      metadata: "",
    },
    {
      exists: true,
      type: "intro-quiz-questions",
      label: "Intro Quiz",
      metadata: "",
    },
    {
      exists: true,
      type: "exit-quiz-questions",
      label: "Exit Quiz",
      metadata: "",
    },
    {
      exists: true,
      type: "worksheet-pdf",
      label: "Worksheet",
      metadata: "pdf",
    },
  ],
  isLegacy: false,
  expired: false,
  ...partial,
});
