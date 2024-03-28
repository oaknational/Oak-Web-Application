import { SpecialistLessonListingData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";

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
        lessonSlug: "super-juice-14dea",
        lessonTitle: "Super juice",
        subjectSlug: "a-new-normal-123a",
        subjectTitle: "A new normal",
        unitSlug: "creative-arts",
        programmeSlug: "advanced-development-t654",
        programmeTitle: "Advanced development",
        description:
          "By the end of the lesson, pupils will share a positive message using gestures.",
        expired: false,
        quizCount: 2,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
        orderInUnit: 1,
      },
      {
        lessonSlug: "lockdown-heroes-p034",
        lessonTitle: "Lockdown heroes",
        subjectSlug: "a-new-normal-123a",
        subjectTitle: "A new normal",
        unitSlug: "creative-arts",
        programmeSlug: "early-development-123a",
        programmeTitle: "Early development",
        description: "By the end of this lesson, pupils will create a hamper",
        expired: false,
        quizCount: 0,
        videoCount: 1,
        presentationCount: 0,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
        orderInUnit: 1,
      },
      {
        lessonSlug: "same-pond-lesson-3",
        lessonTitle: "Same pond",
        subjectSlug: "a-new-normal-123a",
        subjectTitle: "A new normal",
        unitSlug: "creative-arts",
        programmeSlug: "test-programme-123a",
        programmeTitle: "Test programme",
        description: "By the end of the lesson, pupils will create a lily pad",
        expired: false,
        quizCount: 1,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 2,
        hasCopyrightMaterial: false,
        orderInUnit: 1,
      },
    ],
    ...partial,
  };
};

export default specialistLessonListingFixture;
