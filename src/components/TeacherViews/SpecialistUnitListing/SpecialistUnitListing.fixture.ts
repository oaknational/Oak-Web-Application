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
          themeSlug: "primary",
          themeTitle: "Primary",
          expired: false,
          expiredLessonCount: 0,
          lessonCount: 9,
          unitStudyOrder: 1,
          developmentalStageSlug: "building-understanding",
          developmentalStageTitle: "Building Understanding",
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
          themeSlug: "primary",
          themeTitle: "Primary",
          expired: false,
          expiredLessonCount: 0,
          lessonCount: 4,
          unitStudyOrder: 1,
          developmentalStageSlug: "building-understanding",
          developmentalStageTitle: "Building Understanding",
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
