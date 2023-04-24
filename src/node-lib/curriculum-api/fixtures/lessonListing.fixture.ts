import { LessonListing } from "..";

const lessonListingFixture = (
  partial?: Partial<LessonListing>
): LessonListing => {
  return {
    programmeSlug: "maths-secondary-ks4-higher",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    tierSlug: null,
    unitSlug: "adding-surds-a57d",
    unitTitle: "Adding surds",
    lessons: [
      {
        programmeSlug: "maths-secondary-ks4-higher",
        expired: false,
        lessonSlug: "add-two-surds-6wwk0c",
        lessonTitle: "Add two surds",
        description:
          "In this lesson, we will  learn how to add two or more surds where no prior simplification is needed.In these cases, the surds will all have the same root.",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitSlug: "adding-surds-a57d",
        themeSlug: "number-n-56",
        themeTitle: "Number (N)",
        quizCount: 1,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
      },
      {
        programmeSlug: "maths-secondary-ks4-higher",
        expired: false,
        lessonSlug: "subtract-two-surds-6njkac",
        lessonTitle: "Subtract two surds",
        description:
          "In this lesson, we will learn how to subtract one surd from another where no prior simplification is needed.In these cases, the surds will all have the same root.",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitSlug: "adding-surds-a57d",
        themeSlug: "number-n-56",
        themeTitle: "Number (N)",
        quizCount: 2,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
      },
      {
        programmeSlug: "maths-secondary-ks4-higher",
        expired: false,
        lessonSlug: "subtract-two-surds-where-you-need-to-simplify-6gukce",
        lessonTitle: "Subtract two surds where you need to simplify",
        description:
          "In this lesson, we will learn how to subtract two surds where you may need to simplify at least one surd prior to subtracting.",
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        unitSlug: "adding-surds-a57d",
        themeSlug: "number-n-56",
        themeTitle: "Number (N)",
        quizCount: 2,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
      },
    ],
    ...partial,
  };
};

export default lessonListingFixture;
