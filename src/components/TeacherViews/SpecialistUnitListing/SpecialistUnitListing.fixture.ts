import { SpecialistUnitListingData } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";

const testDevelopmentalStages = [
  {
    slug: "building-understanding",
    title: "Building Understanding",
    unitCount: 10,
    lessonCount: 20,
    programmeSlug: "building-understanding",
  },
  {
    slug: "applying-learning",
    title: "Applying Learning",
    unitCount: 10,
    lessonCount: 20,
    programmeSlug: "applying-learning",
  },
];

const testThemes = [
  { themeSlug: "test-theme-primary", themeTitle: "Test Theme Primary" },
  { themeSlug: "test-theme-secondary", themeTitle: "Test Theme Secondary" },
];

const specialistUnitListingFixture = (
  partial?: Partial<SpecialistUnitListingData>,
): SpecialistUnitListingData => {
  return {
    programmeSlug: "test-specialist-unit",
    subjectSlug: "commuinication-and-language",
    subjectTitle: "Communication and Language",
    learningThemes: testThemes,
    developmentStage: testDevelopmentalStages,
    developmentStageSlug: "building-understanding",
    units: [
      [
        {
          slug: "habitats-546p",
          title: "Habitats",
          nullTitle: "Habitats",
          programmeSlug: "habitats-546p",
          subjectSlug: "communication-and-language",
          subjectTitle: "Communication and Language",
          themeSlug: "primary",
          themeTitle: "Primary",
          expired: false,
          expiredLessonCount: 0,
          lessonCount: 4,
          unitStudyOrder: 3,
          developmentStageSlug: "applying-learning",
          developmentStageTitle: "Applying Learning",
          learningThemes: [
            {
              themeSlug: "test-theme-primary",
              themeTitle: "Test Theme Primary",
            },
          ],
        },
      ],
      [
        {
          slug: "out-and-about-623s",
          title: "Out and about",
          nullTitle: "Out and about",
          programmeSlug: "out-and-about-623s",
          subjectSlug: "communication-and-language",
          subjectTitle: "Communication and Language",
          themeSlug: "a",
          themeTitle: "b",
          expired: false,
          expiredLessonCount: 0,
          lessonCount: 4,
          unitStudyOrder: 1,
          developmentStageSlug: "building-understanding",
          developmentStageTitle: "Building Understanding",
          learningThemes: [],
        },
      ],
      [
        {
          slug: "growth-618b",
          title: "Growth",
          nullTitle: "Growth",
          programmeSlug: "growth-618b",
          subjectSlug: "communication-and-language",
          subjectTitle: "Communication and Language",
          themeSlug: "secondary",
          themeTitle: "Secondary",
          expired: false,
          expiredLessonCount: 0,
          lessonCount: 7,
          unitStudyOrder: 4,
          developmentStageSlug: "applying-learning",
          developmentStageTitle: "Applying learning",
          learningThemes: [],
        },
      ],
    ],

    ...partial,
  };
};

export default specialistUnitListingFixture;
