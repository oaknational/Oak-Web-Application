import { LessonListingPageData } from "../../curriculum-api-2023/queries/lessonListing/lessonListing.schema";

const lessonListingFixture = (
  partial?: Partial<LessonListingPageData>,
): LessonListingPageData => {
  return {
    programmeSlug: "maths-secondary-ks4-higher",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    tierSlug: null,
    unitSlug: "adding-surds-a57d",
    unitTitle: "Adding surds",
    hasNewContent: false,
    lessons: [
      {
        expired: false,
        lessonSlug: "add-two-surds-6wwk0c",
        lessonTitle: "Add two surds",
        description:
          "In this lesson, we will  learn how to add two or more surds where no prior simplification is needed.In these cases, the surds will all have the same root.",
        quizCount: 1,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
        orderInUnit: 1,
      },
      {
        expired: false,
        lessonSlug: "subtract-two-surds-6njkac",
        lessonTitle: "Subtract two surds",
        description:
          "In this lesson, we will learn how to subtract one surd from another where no prior simplification is needed.In these cases, the surds will all have the same root.",
        quizCount: 2,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
        orderInUnit: 2,
      },
      {
        expired: false,
        lessonSlug: "subtract-two-surds-where-you-need-to-simplify-6gukce",
        lessonTitle: "Subtract two surds where you need to simplify",
        description:
          "In this lesson, we will learn how to subtract two surds where you may need to simplify at least one surd prior to subtracting.",
        quizCount: 2,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
        orderInUnit: 3,
      },
      {
        expired: false,
        lessonSlug: "subtract-three-surds",
        lessonTitle: "Subtract three surds",
        description:
          "In this lesson, we will learn how to subtract three surds ",
        quizCount: 2,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
        orderInUnit: 4,
      },
      {
        expired: false,
        lessonSlug: "subtract-four-surds",
        lessonTitle: "Subtract four surds",
        description:
          "In this lesson, we will learn how to subtract four surds ",
        quizCount: 2,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
        orderInUnit: 5,
      },
      {
        expired: true,
        lessonSlug: "new-lesson-test",
        lessonTitle: "New Lesson test",
        description: "Test for a lesson that is expired",
        quizCount: 2,
        videoCount: 1,
        presentationCount: 1,
        worksheetCount: 1,
        hasCopyrightMaterial: false,
        orderInUnit: 5,
      },
    ],
    ...partial,
  };
};

export default lessonListingFixture;
