import { EarlyReleaseExemplarUnitsProps } from "@/components/EarlyReleaseExemplarUnits/EarlyReleaseExemplarUnits";

type earlyReleaseExemplarUnitsFixtureProps = {
  primary: EarlyReleaseExemplarUnitsProps;
  secondary: EarlyReleaseExemplarUnitsProps;
};

const earlyReleaseExemplarUnitsFixture = (
  partial?: Partial<earlyReleaseExemplarUnitsFixtureProps>,
): earlyReleaseExemplarUnitsFixtureProps => {
  return {
    primary: {
      viewType: "teachers-2023",
      subjectIconBackground: "lavender",
      heading: "Primary units",
      subHeading: "View and download our early-release units.",
      color: "lavender50",
      quote: {
        text: "To find resources that tick all the boxes is quite unusual",
        author: "— Sophie Baker",
        occupation: "Class Teacher, St Agnes Academy",
      },
      units: [
        {
          title: "Wild: Reading and Writing",
          lessonCount: 8,
          keyStageSlug: "ks1",
          yearTitle: "Year 1",
          keyStageTitle: "Key stage 1",
          subjectTitle: "English",
          subjectSlug: "english",
          slug: "wild-reading-and-writing",
          programmeSlug: "english-primary-ks1",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 0,
        },
        {
          title: "Simple, compound and adverbial complex sentences",
          lessonCount: 8,
          keyStageSlug: "ks2",
          yearTitle: "Year 3",
          keyStageTitle: "Key stage 2",
          subjectTitle: "English",
          subjectSlug: "english",
          slug: "simple-compound-and-adverbial-complex-sentences",
          programmeSlug: "english-primary-ks2",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 1,
        },
        {
          title: "Local area: Why is (our place) special?",
          lessonCount: 6,
          keyStageSlug: "ks1",
          yearTitle: "Year 1",
          keyStageTitle: "Key stage 1",
          subjectTitle: "Geography",
          subjectSlug: "geography",
          slug: "local-area-why-is-our-place-special",
          programmeSlug: "geography-primary-ks1",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 2,
        },
        {
          title: "South America: Why does the Amazon matter?",
          lessonCount: 8,
          keyStageSlug: "ks2",
          yearTitle: "Year 5",
          keyStageTitle: "Key stage 2",
          subjectTitle: "Geography",
          subjectSlug: "geography",
          slug: "south-america-why-does-the-amazon-matter",
          programmeSlug: "geography-primary-ks2",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 3,
        },
        {
          title:
            "Travel and transport: how have travel and transport changed over time?",
          lessonCount: 6,
          keyStageSlug: "ks1",
          yearTitle: "Year 1",
          keyStageTitle: "Key stage 1",
          subjectTitle: "History",
          subjectSlug: "history",
          slug: "travel-and-transport-how-has-travel-and-transport-changed-over-time",
          programmeSlug: "history-primary-ks1",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 4,
        },
        {
          title: "The Romans: What impact did the Romans have on Britain?",
          lessonCount: 6,
          keyStageSlug: "ks2",
          yearTitle: "Year 5",
          keyStageTitle: "Key stage 2",
          subjectTitle: "History",
          subjectSlug: "history",
          slug: "the-romans-what-impact-did-the-romans-have-on-britain",
          programmeSlug: "history-primary-ks2",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 5,
        },
        {
          title: "Counting to and from 20",
          lessonCount: 10,
          keyStageSlug: "ks1",
          yearTitle: "Year 1",
          keyStageTitle: "Key stage 1",
          subjectTitle: "Maths",
          subjectSlug: "maths",
          slug: "counting-to-and-from-20",
          programmeSlug: "maths-primary-ks1",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 6,
        },
        {
          title: "Ratio and proportion",
          lessonCount: 10,
          keyStageSlug: "ks2",
          yearTitle: "Year 6",
          keyStageTitle: "Key stage 2",
          subjectTitle: "Maths",
          subjectSlug: "maths",
          slug: "ratio-and-proportion",
          programmeSlug: "maths-primary-ks2",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 7,
        },
        {
          title: "Growing plants",
          lessonCount: 7,
          keyStageSlug: "ks1",
          yearTitle: "Year 1",
          keyStageTitle: "Key stage 1",
          subjectTitle: "Science",
          subjectSlug: "science",
          slug: "growing-plants",
          programmeSlug: "science-primary-ks1",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 8,
        },
        {
          title: "Earth, Sun and Moon",
          lessonCount: 6,
          keyStageSlug: "ks2",
          yearTitle: "Year 5",
          keyStageTitle: "Key stage 2",
          subjectTitle: "Science",
          subjectSlug: "science",
          slug: "earth-sun-and-moon",
          programmeSlug: "science-primary-ks2",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 9,
        },
      ],
    },
    secondary: {
      viewType: "teachers-2023",
      subjectIconBackground: "pink",
      heading: "Secondary units",
      subHeading: "View and download our early-release units.",
      color: "pink50",
      quote: {
        text: "A life saver… I didn’t think you could beat the previous Oak resources.",
        author: "— Alisha Kakar",
        occupation: "Secondary Science Teacher,",
        school: "Judgemeadow Community College",
      },
      units: [
        {
          title: "Victorian childhood",
          lessonCount: 7,
          subjectTitle: "English",
          keyStageSlug: "ks3",
          yearTitle: "Year 8",
          slug: "victorian-childhood",
          programmeSlug: "english-secondary-ks3",
          keyStageTitle: "Key stage 3",
          subjectSlug: "english",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 6,
        },
        {
          title: "Macbeth and masculinity: the struggle for power",
          lessonCount: 7,
          subjectTitle: "English",
          keyStageSlug: "ks4",
          yearTitle: "Year 11",
          slug: "",
          programmeSlug: "",
          keyStageTitle: "Key stage 4",
          subjectSlug: "english",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 5,
        },
        {
          title:
            "The Norman Conquest: How do we know about the impact of the Conquest on England?",
          lessonCount: 6,
          subjectTitle: "History",
          keyStageSlug: "ks3",
          yearTitle: "Year 7",
          slug: "the-norman-conquest-how-do-we-know-about-the-impact-of-the-conquest-on-england",
          programmeSlug: "history-secondary-ks3",
          keyStageTitle: "Key stage 3",
          subjectSlug: "history",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 2,
        },
        {
          title:
            "Migration: How far was England changed by early modern migration?",
          lessonCount: 7,
          subjectTitle: "History",
          keyStageSlug: "ks4",
          yearTitle: "Year 10",
          slug: "migration-how-far-was-england-changed-by-early-modern-migration",
          programmeSlug: "history-secondary-ks4-edexcel",
          keyStageTitle: "Key stage 4",
          subjectSlug: "history",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 1,
        },
        {
          title: "Perimeter and area",
          lessonCount: 12,
          subjectTitle: "Maths",
          keyStageSlug: "ks3",
          yearTitle: "Year 7",
          slug: "perimeter-and-area",
          programmeSlug: "maths-secondary-ks3",
          keyStageTitle: "Key stage 3",
          subjectSlug: "maths",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 9,
        },
        {
          title: "Surds",
          lessonCount: 12,
          subjectTitle: "Maths",
          keyStageSlug: "ks4",
          yearTitle: "Year 10",
          slug: "surds",
          programmeSlug: "maths-secondary-ks4-higher",
          keyStageTitle: "Key stage 4",
          subjectSlug: "maths",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 0,
        },
        {
          title: "Free Composition Exemplars",
          lessonCount: 0,
          subjectTitle: "Music",
          keyStageSlug: "ks4",
          yearTitle: "Year 11",
          slug: "",
          programmeSlug: "",
          keyStageTitle: "Key stage 4",
          subjectSlug: "music",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 8,
        },
        {
          title: "Instrumental fluency: Introduction to keyboard playing",
          subjectTitle: "Music",
          keyStageSlug: "ks3",
          yearTitle: "Year 7",
          slug: "instrumental-fluency-introduction-to-keyboard-playing",
          programmeSlug: "music-secondary-ks3",
          keyStageTitle: "Key stage 3",
          subjectSlug: "music",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 7,
          lessonCount: 0,
        },
        {
          title: "Plant nutrition and photosynthesis",
          lessonCount: 4,
          subjectTitle: "Science",
          keyStageSlug: "ks3",
          yearTitle: "Year 9",
          slug: "plant-nutrition-and-photosynthesis",
          programmeSlug: "science-secondary-ks3",
          keyStageTitle: "Key stage 3",
          subjectSlug: "science",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 3,
        },
        {
          title: "Measuring waves",
          subjectTitle: "Physics",
          keyStageSlug: "ks4",
          yearTitle: "Year 10",
          slug: "measuring-waves",
          programmeSlug: "",
          keyStageTitle: "Key stage 4",
          subjectSlug: "physics",
          nullTitle: "",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          learningThemes: [],
          expired: false,
          expiredLessonCount: 0,
          index: 4,
          lessonCount: 4,
        },
      ],
    },
    ...partial,
  };
};

export default earlyReleaseExemplarUnitsFixture;
