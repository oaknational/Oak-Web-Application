import { SpecialistLessonListingData } from "./SpecialistLessonListing.view";

const specialistLessonListingFixture = (
  partial?: Partial<SpecialistLessonListingData>,
): SpecialistLessonListingData => {
  return {
    programmeSlug: "test-specialist-lesson",
    programmeTitle: "Test Specialist Lesson",
    subjectSlug: "commuinication-and-language",
    subjectTitle: "Communication and Language",
    unitSlug: "habitats-546p",
    unitTitle: "Habitats",
    lessons: [
      {
        lessonSlug: "healthy-hugs-14dea-lesson-1",
        lessonTitle: "Healthy Hugs",
        subjectSlug: "a-new-normal-123a",
        subjectTitle: "A new normal",
        unitSlug: "creative-arts",
        programmeSlug: "early-development-123a",
        programmeTitle: "Early development",
        description:
          "By the end of the lesson, pupils will share a positive message using gestures.",
        expired: false,
        quizCount: 1,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 2,
        hasCopyrightMaterial: false,
      },
      {
        lessonSlug: "glitter-germs-lesson-1",
        lessonTitle: "Glitter germs",
        subjectSlug: "a-new-normal-123a",
        subjectTitle: "A new normal",
        unitSlug: "creative-arts",
        programmeSlug: "early-development-123a",
        programmeTitle: "Early development",
        description: "By the end of this lesson, pupils will create a visual",
        expired: false,
        quizCount: 0,
        videoCount: 1,
        presentationCount: 0,
        worksheetCount: 2,
        hasCopyrightMaterial: false,
      },
      {
        lessonSlug: "games-apart-1",
        lessonTitle: "Games apart",
        subjectSlug: "a-new-normal-123a",
        subjectTitle: "A new normal",
        unitSlug: "creative-arts",
        programmeSlug: "early-development-123a",
        programmeTitle: "Early development",
        description:
          "By the end of the lesson, pupils will play some safe playground games",
        expired: false,
        quizCount: 0,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 2,
        hasCopyrightMaterial: false,
      },
    ],
    ...partial,
  };
};

export default specialistLessonListingFixture;
