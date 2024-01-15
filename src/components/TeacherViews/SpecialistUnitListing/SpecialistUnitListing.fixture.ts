import { SpecialistUnitListingData } from "./SpecialistUnitListing.view";

const testDevelopmentalStages = [
  {
    slug: "building-understanding",
    title: "Building Understanding",
    unitCount: 10,
    lessonCount: 20,
  },
  {
    slug: "applying-learning",
    title: "Applying Learning",
    unitCount: 10,
    lessonCount: 20,
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
    themes: testThemes,
    developmentalStage: testDevelopmentalStages,
    developmentalStageSlug: "building-understanding",
    units: [
      [
        {
          slug: "changes-and-transitions-618b",
          title: "Changes and Transitions",
          nullTitle: "Changes and Transitions",
          programmeSlug: "changes-and-transtions-618b",
          subjectSlug: "communication-and-language",
          subjectTitle: "Communication and Language",
          themeSlug: "early-development",
          themeTitle: "Early Development",
          expired: false,
          expiredLessonCount: 0,
          lessonCount: 9,
          unitStudyOrder: 1,
          developmentalStageSlug: "building-understanding",
          developmentalStageTitle: "Building Understanding",
        },
      ],
    ],

    ...partial,
  };
};

export default specialistUnitListingFixture;
