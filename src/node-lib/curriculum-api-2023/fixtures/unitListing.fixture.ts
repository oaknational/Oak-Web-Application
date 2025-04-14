import { UnitListingData } from "../queries/unitListing/unitListing.schema";

export const unitListingFixture = (
  partial?: Partial<UnitListingData>,
): UnitListingData => {
  return {
    programmeSlug: "computing-secondary-ks4",
    keyStageSlug: "ks4",
    keyStageTitle: "Key Stage 4",
    examBoardSlug: null,
    examBoardTitle: null,
    subjectSlug: "computing",
    subjectTitle: "Computing",
    pathwayTitle: null,
    subjectParent: null,
    hasNewContent: false,
    tierSlug: null,
    phase: "secondary",
    yearGroups: [
      {
        year: "year-10",
        yearTitle: "Year 10",
      },
    ],
    tiers: [],
    subjectCategories: [
      {
        label: "Grammar",
        iconName: "subject-english-grammar",
        slug: "grammar",
      },
    ],
    units: [
      [
        {
          slug: "data-representation-618b",
          title: "Data Representation",
          nullTitle: "Data Representation",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 9,
          unitStudyOrder: 1,
          expired: false,
          yearOrder: 1,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          subjectCategories: null,
          unpublishedLessonCount: 0,
          learningThemes: [
            {
              themeSlug: "computer-science-1",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
      [
        {
          slug: "computer-systems-e17a",
          title: "Computer Systems",
          nullTitle: "Computer Systems",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 12,
          unitStudyOrder: 2,
          unpublishedLessonCount: 0,
          yearOrder: 1,
          expired: false,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          subjectCategories: [
            {
              label: "Grammar",
              slug: "grammar",
            },
          ],
          learningThemes: [
            {
              themeSlug: "computer-science-2",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
      [
        {
          slug: "networks-fe4b",
          title: "Networks",
          nullTitle: "Networks",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 6,
          unitStudyOrder: 3,
          unpublishedLessonCount: 0,
          expired: false,
          yearOrder: 1,
          subjectCategories: [
            {
              label: "Grammar",
              slug: "grammar",
            },
          ],

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "computer-science-3",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
      [
        {
          slug: "security-a5e3",
          title: "Security",
          nullTitle: "Security",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          unpublishedLessonCount: 0,
          lessonCount: 7,
          unitStudyOrder: 4,
          expired: false,
          yearOrder: 1,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "computer-science-2",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
      [
        {
          slug: "impacts-on-society-fb09",
          title: "Impacts on society",
          nullTitle: "Impacts on society",
          programmeSlug: "computing-secondary-ks4",
          unpublishedLessonCount: 0,
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 7,
          unitStudyOrder: 5,
          expired: false,
          yearOrder: 1,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          cohort: "2023-2024",
          year: "year-10",
          learningThemes: [
            {
              themeSlug: "computer-science-2",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
      [
        {
          slug: "algorithms-a118",
          title: "Algorithms",
          nullTitle: "Algorithms",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 11,
          unitStudyOrder: 6,
          expired: false,
          yearOrder: 1,
          unpublishedLessonCount: 0,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          cohort: "2023-2024",
          year: "year-10",
          learningThemes: [
            {
              themeSlug: "computer-science-2",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
      [
        {
          slug: "programming-1-sequence-2cbd",
          title: "Programming 1: Sequence",
          unpublishedLessonCount: 0,
          nullTitle: "Programming 1: Sequence",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 5,
          unitStudyOrder: 1,
          expired: false,
          yearOrder: 1,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "computer-science-2",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
      [
        {
          slug: "programming-2-selection-cbc4",
          title: "Programming 2: Selection",
          nullTitle: "Programming 2: Selection",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          unpublishedLessonCount: 0,
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 6,
          unitStudyOrder: 2,
          yearOrder: 1,
          expired: false,
          expiredLessonCount: 0,
          year: "year-10",
          yearTitle: "Year 10",
          subjectCategories: null,

          cohort: "2023-2024",
          learningThemes: [],
        },
      ],
      [
        {
          slug: "programming-3-iteration-2e20",
          title: "Programming 3: Iteration",
          nullTitle: "Programming 3: Iteration",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 5,
          unitStudyOrder: 3,
          expired: false,
          unpublishedLessonCount: 0,
          yearOrder: 1,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [],
        },
      ],
      [
        {
          slug: "programming-4-subroutines-7e33",
          title: "Programming 4: Subroutines",
          nullTitle: "Programming 4: Subroutines",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          unpublishedLessonCount: 0,
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 6,
          unitStudyOrder: 4,
          expired: false,
          yearOrder: 1,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [],
        },
      ],
      [
        {
          slug: "programming-5-strings-and-lists-9161",
          title: "Programming 5: Strings and lists",
          nullTitle: "Programming 5: Strings and lists",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 10,
          unitStudyOrder: 5,
          expired: false,
          unpublishedLessonCount: 0,
          yearOrder: 1,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [],
        },
      ],
      [
        {
          slug: "programming-6-dictionaries-and-datafiles-b91f",
          title: "Programming 6: Dictionaries and datafiles",
          nullTitle: "Programming 6: Dictionaries and datafiles",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          unpublishedLessonCount: 0,
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 12,
          unitStudyOrder: 6,
          expired: false,
          yearOrder: 1,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [],
        },
      ],
      [
        {
          slug: "databases-and-sql-73d9",
          title: "Databases and SQL",
          nullTitle: "Databases and SQL",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 5,
          unitStudyOrder: 7,
          expired: false,
          yearOrder: 1,
          unpublishedLessonCount: 0,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [],
        },
      ],
      [
        {
          slug: "html-beb0",
          title: "HTML",
          nullTitle: "HTML",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          lessonCount: 6,
          unitStudyOrder: 8,
          expired: false,
          yearOrder: 1,
          subjectCategories: null,
          unpublishedLessonCount: 0,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "computer-science-2",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
      [
        {
          slug: "object-oriented-programming-dc22",
          title: "Object-oriented programming",
          nullTitle: "Object-oriented programming",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "computing",
          unpublishedLessonCount: 0,
          subjectTitle: "Computing",
          lessonCount: 5,
          unitStudyOrder: 9,
          expired: false,
          yearOrder: 1,
          subjectCategories: null,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "computer-science-2",
              themeTitle: "Computer Science",
            },
          ],
        },
      ],
    ],
    learningThemes: [
      {
        themeTitle: "The Canterbury Tales and paired texts",
        themeSlug: "the-canterbury-tales-and-paired-texts-39",
      },
      {
        themeTitle: "The sonnet through time",
        themeSlug: "the-sonnet-through-time-24",
      },
    ],
    ...partial,
  };
};

export const unitListingWithTiers = (
  partial?: Partial<UnitListingData>,
): UnitListingData => {
  return {
    ...unitListingFixture(),
    tierSlug: "higher",
    tiers: [
      {
        tierTitle: "Foundation",
        tierSlug: "foundation",
        unitCount: 3,
        lessonCount: 34,
        tierProgrammeSlug: "maths-secondary-ks4-foundation",
        tierOrder: 1,
      },
      {
        tierTitle: "Core",
        tierSlug: "core",
        unitCount: 3,
        lessonCount: 38,
        tierProgrammeSlug: "maths-secondary-ks4-core",
        tierOrder: 2,
      },
      {
        tierTitle: "Higher",
        tierSlug: "higher",
        unitCount: 3,
        lessonCount: 29,
        tierProgrammeSlug: "maths-secondary-ks4-higher",
        tierOrder: 3,
      },
    ],
    ...partial,
  };
};

export const combinedUnitListingFixture = (
  partial?: Partial<UnitListingData>,
): UnitListingData => {
  return {
    ...unitListingFixture(),
    programmeSlug: "maths-secondary-ks4",
    subjectSlug: "maths",
    subjectTitle: "Maths",
    subjectParent: null,
    units: [
      [
        {
          slug: "number-1",
          title: "Number 1",
          nullTitle: "Number 1",
          programmeSlug: "maths-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCount: 9,
          unitStudyOrder: 1,
          expired: false,
          yearOrder: 1,
          expiredLessonCount: 0,
          subjectCategories: null,
          unpublishedLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "number-1",
              themeTitle: "Number 1",
            },
          ],
        },
      ],
      [
        {
          slug: "number-2",
          title: "Number 2",
          nullTitle: "Number 2",
          programmeSlug: "maths-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCount: 12,
          unitStudyOrder: 2,
          yearOrder: 1,
          expired: false,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          subjectCategories: null,
          unpublishedLessonCount: 0,
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "number-2",
              themeTitle: "Number 2",
            },
          ],
        },
      ],
      [
        {
          slug: "number-3",
          title: "Number 3",
          nullTitle: "Number 3",
          programmeSlug: "maths-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCount: 6,
          unitStudyOrder: 3,
          expired: false,
          yearOrder: 1,
          subjectCategories: null,
          unpublishedLessonCount: 0,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2023-2024",
          learningThemes: [
            {
              themeSlug: "number-3",
              themeTitle: "Number 3",
            },
          ],
        },
      ],
      [
        {
          slug: "number-1-l",
          title: "Number 1",
          nullTitle: "Number 1",
          programmeSlug: "maths-secondary-ks4-l",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCount: 9,
          unitStudyOrder: 1,
          expired: false,
          yearOrder: 1,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2020-2022",
          subjectCategories: null,
          unpublishedLessonCount: 0,
          learningThemes: [],
        },
      ],
      [
        {
          slug: "number-2-l",
          title: "Number 2",
          nullTitle: "Number 2",
          programmeSlug: "maths-secondary-ks4-l",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCount: 12,
          unitStudyOrder: 2,
          subjectCategories: null,
          unpublishedLessonCount: 0,
          yearOrder: 1,
          expired: false,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2020-2022",
          learningThemes: [],
        },
      ],
      [
        {
          slug: "number-3-l",
          title: "Number 3",
          nullTitle: "Number 3",
          programmeSlug: "maths-secondary-ks4-l",
          keyStageSlug: "ks4",
          keyStageTitle: "Key Stage 4",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCount: 6,
          unitStudyOrder: 3,
          subjectCategories: null,
          unpublishedLessonCount: 0,
          expired: false,
          yearOrder: 1,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          year: "year-10",
          cohort: "2020-2022",
          learningThemes: [],
        },
      ],
    ],
    ...partial,
  };
};

export default unitListingFixture;
