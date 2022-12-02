import { SubjectUnits } from "../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectUnitsSlug]/units";

export const subjectUnits: SubjectUnits[] = [
  {
    subjectTitle: "Art and design",
    subjectSlug: "art-and-design",
    keyStageTitle: "Key stage 4",
    keyStageSlug: "4",
    availableTiers: [],
    units: [
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: false,
        subjectSlug: "english",
        keyStageSlug: "4",
      },
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: false,
        subjectSlug: "english",
        keyStageSlug: "4",
      },
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: true,
        subjectSlug: "english",
        keyStageSlug: "4",
      },
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: false,
        subjectSlug: "english",
        keyStageSlug: "4",
      },
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: false,
        subjectSlug: "english",
        keyStageSlug: "4",
      },
    ],
  },
  {
    subjectTitle: "Maths",
    subjectSlug: "maths",
    keyStageTitle: "Key stage 4",
    keyStageSlug: "4",
    availableTiers: [
      { title: "Foundation", slug: "foundation", unitCount: 14 },
      { title: "Core", slug: "core", unitCount: 14 },
      { title: "Higher", slug: "higher", unitCount: 14 },
    ],
    units: [
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: false,
        subjectSlug: "english",
        keyStageSlug: "2",
      },
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: false,
        subjectSlug: "english",
        keyStageSlug: "2",
      },
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: true,
        subjectSlug: "english",
        keyStageSlug: "2",
      },
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: false,
        subjectSlug: "english",
        keyStageSlug: "2",
      },
      {
        title:
          "1, To build knowledge of the historical context of the play ‘Macbeth’",
        slug: "To-build-knowledge",
        learningThemeTitle: "MacBeth",
        lessonCount: 4,
        hasUnitQuiz: false,
        subjectSlug: "english",
        keyStageSlug: "2",
      },
    ],
  },
];

export const mockFetchSubjectUnits = (
  subjectSlug?: string
  //   keyStageSlug?: string
) => {
  if (subjectSlug) {
    const page = subjectUnits.filter(
      (subject) => subject.subjectSlug === subjectSlug
      // &&
      // subject.keyStageSlug === keyStageSlug
    );

    return page[0];
  }
};
