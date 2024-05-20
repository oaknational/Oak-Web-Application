import { UnitListingPageData } from "../queries/unitListing/unitListing.schema";

export const unitListingFixture = (
  partial?: Partial<UnitListingPageData>,
): UnitListingPageData => {
  return {
    programmeSlug: "computing-secondary-ks4",
    keyStageSlug: "ks4",
    keyStageTitle: "Key stage 4",
    examBoardSlug: null,
    examBoardTitle: null,
    subjectSlug: "computing",
    subjectTitle: "Computing",
    totalUnitCount: 5,
    tierSlug: null,
    tiers: [],
    units: [
      [
        {
          slug: "data-representation-618b",
          title: "Data Representation",
          nullTitle: "Data Representation",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-1",
          themeTitle: "Computer Science",
          lessonCount: 9,
          quizCount: null,
          unitStudyOrder: 1,
          expired: false,
          yearOrder: 1,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
          cohort: "2023-2024",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-2",
          themeTitle: "Computer Science",
          lessonCount: 12,
          quizCount: null,
          unitStudyOrder: 2,
          yearOrder: 1,
          expired: false,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          slug: "networks-fe4b",
          title: "Networks",
          nullTitle: "Networks",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-3",
          themeTitle: "Computer Science",
          lessonCount: 6,
          quizCount: null,
          unitStudyOrder: 3,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-2",
          themeTitle: "Computer Science",
          lessonCount: 7,
          quizCount: null,
          unitStudyOrder: 4,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-2",
          themeTitle: "Computer Science",
          lessonCount: 7,
          quizCount: null,
          unitStudyOrder: 5,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          slug: "algorithms-a118",
          title: "Algorithms",
          nullTitle: "Algorithms",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-2",
          themeTitle: "Computer Science",
          lessonCount: 11,
          quizCount: null,
          unitStudyOrder: 6,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          slug: "programming-1-sequence-2cbd",
          title: "Programming 1: Sequence",
          nullTitle: "Programming 1: Sequence",
          programmeSlug: "computing-secondary-ks4",
          keyStageSlug: "ks4",
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-2",
          themeTitle: "Computer Science",
          lessonCount: 5,
          quizCount: null,
          unitStudyOrder: 1,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "no-theme",
          themeTitle: null,
          lessonCount: 6,
          quizCount: null,
          unitStudyOrder: 2,
          yearOrder: 1,
          expired: false,
          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "no-theme",
          themeTitle: null,
          lessonCount: 5,
          quizCount: null,
          unitStudyOrder: 3,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "no-theme",
          themeTitle: null,
          lessonCount: 6,
          quizCount: null,
          unitStudyOrder: 4,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "no-theme",
          themeTitle: null,
          lessonCount: 10,
          quizCount: null,
          unitStudyOrder: 5,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "no-theme",
          themeTitle: null,
          lessonCount: 12,
          quizCount: null,
          unitStudyOrder: 6,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-2",
          themeTitle: "Computer Science",
          lessonCount: 5,
          quizCount: null,
          unitStudyOrder: 7,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-2",
          themeTitle: "Computer Science",
          lessonCount: 6,
          quizCount: null,
          unitStudyOrder: 8,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
          keyStageTitle: "Key stage 4",
          subjectSlug: "computing",
          subjectTitle: "Computing",
          themeSlug: "computer-science-2",
          themeTitle: "Computer Science",
          lessonCount: 5,
          quizCount: null,
          unitStudyOrder: 9,
          expired: false,
          yearOrder: 1,

          expiredLessonCount: 0,
          yearTitle: "Year 10",
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
  partial?: Partial<UnitListingPageData>,
): UnitListingPageData => {
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

export default unitListingFixture;
