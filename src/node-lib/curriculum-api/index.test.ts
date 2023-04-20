import teachersHomePageFixture from "./fixtures/teachersHomePage.fixture";
import teachersKeyStageSubjectsFixture from "./fixtures/teachersKeyStageSubjects.fixture";
import teachersKeyStageSubjectTiersFixture from "./fixtures/teachersKeyStageSubjectTiers.fixture";
import teachersKeyStageSubjectUnitsFixture from "./fixtures/teachersKeyStageSubjectUnits.fixture";
import teachersKeyStageSubjectUnitsLessonsFixture from "./fixtures/teachersKeyStageSubjectUnitLessons.fixture";
import teachersKeyStageSubjectTiersPathsFixture from "./fixtures/teachersKeyStageSubjectTiersPaths.fixture";
import teachersLessonOverviewFixture from "./fixtures/teachersLessonOverview.fixture";
import teachersLessonOverviewPathsFixture from "./fixtures/teachersLessonOverviewPaths.fixture";
import teachersKeyStageSubjectUnitsLessonsDownloadsFixtures from "./fixtures/teachersKeyStageSubjectUnitsLessonsDownloads.fixture";
import unitListingFixture from "./fixtures/unitListing.fixture";
import tierListingFixture from "./fixtures/tierListing.fixture";
import unitListingPathsFixture from "./fixtures/unitListingPaths.fixture";

import curriculumApi from ".";

/**
 * This module is mocked in jest.setup.js, so need to unmock it here in order to test it
 */
jest.unmock(".");

const teachersHomePage = jest.fn(() => ({
  mv_key_stages: teachersHomePageFixture().keyStages,
}));
const teachersKeyStageSubjects = jest.fn(() => ({
  mv_key_stages: teachersHomePageFixture().keyStages,
  mv_subjects: teachersKeyStageSubjectsFixture().subjects,
}));
const teachersKeyStageSubjectTiers = jest.fn(() => ({
  mv_key_stages: [
    {
      slug: teachersKeyStageSubjectTiersFixture().keyStageSlug,
      title: teachersKeyStageSubjectTiersFixture().keyStageTitle,
    },
  ],
  mv_subjects: [
    {
      slug: teachersKeyStageSubjectTiersFixture().subjectSlug,
      title: teachersKeyStageSubjectTiersFixture().subjectTitle,
    },
  ],
  mv_tiers: teachersKeyStageSubjectTiersFixture().tiers,
}));
const teachersKeyStageSubjectTiersPaths = jest.fn(() => ({
  mv_tiers: teachersKeyStageSubjectTiersPathsFixture().tiers,
}));
const teachersKeyStageSubjectUnitsPaths = jest.fn(() => ({
  mv_subjects: [],
}));
const teachersKeyStageSubjectUnits = jest.fn(() => ({
  mv_key_stages: [
    {
      slug: teachersKeyStageSubjectUnitsFixture().keyStageSlug,
      title: teachersKeyStageSubjectUnitsFixture().keyStageTitle,
    },
  ],
  mv_subjects: [
    {
      slug: teachersKeyStageSubjectUnitsFixture().subjectSlug,
      title: teachersKeyStageSubjectUnitsFixture().subjectTitle,
    },
  ],
  mv_tiers: teachersKeyStageSubjectUnitsFixture().tiers,
  mv_units: teachersKeyStageSubjectUnitsFixture().units,
  mv_learning_themes: teachersKeyStageSubjectUnitsFixture().learningThemes,
}));
const teachersKeyStageSubjectUnitLessonsDownloads = jest.fn(() => ({
  mv_downloads: [teachersKeyStageSubjectUnitsLessonsDownloadsFixtures()],
}));
const teachersKeyStageSubjectUnitLessons = jest.fn(() => ({
  mv_units: [
    {
      unitSlug: teachersKeyStageSubjectUnitsLessonsFixture().unitSlug,
      subjectSlug: teachersKeyStageSubjectUnitsLessonsFixture().subjectSlug,
      keyStageSlug: teachersKeyStageSubjectUnitsLessonsFixture().keyStageSlug,
      subjectTitle: teachersKeyStageSubjectUnitsLessonsFixture().subjectTitle,
      unitTitle: teachersKeyStageSubjectUnitsLessonsFixture().unitTitle,
      keyStageTitle: teachersKeyStageSubjectUnitsLessonsFixture().keyStageTitle,
    },
  ],
  mv_lessons: teachersKeyStageSubjectUnitsLessonsFixture().lessons,
}));
const teachersLessonOverview = jest.fn(() => ({
  mv_lessons: [
    {
      slug: teachersLessonOverviewFixture().slug,
      title: teachersLessonOverviewFixture().title,
      keyStageSlug: teachersLessonOverviewFixture().keyStageSlug,
      keyStageTitle: teachersLessonOverviewFixture().keyStageTitle,
      unitSlug: teachersLessonOverviewFixture().unitSlug,
      unitTitle: teachersLessonOverviewFixture().unitTitle,
      subjectSlug: teachersLessonOverviewFixture().subjectSlug,
      subjectTitle: teachersLessonOverviewFixture().subjectTitle,
      coreContent: teachersLessonOverviewFixture().coreContent,
      equipmentRequired: teachersLessonOverviewFixture().equipmentRequired,
      supervisionLevel: teachersLessonOverviewFixture().supervisionLevel,
      contentGuidance: teachersLessonOverviewFixture().contentGuidance,
      presentationUrl: teachersLessonOverviewFixture().presentationUrl,
      worksheetUrl: teachersLessonOverviewFixture().worksheetUrl,
      hasCopyrightMaterial:
        teachersLessonOverviewFixture().hasCopyrightMaterial,
      videoMuxPlaybackId: teachersLessonOverviewFixture().videoMuxPlaybackId,
      videoWithSignLanguageMuxPlaybackId:
        teachersLessonOverviewFixture().videoWithSignLanguageMuxPlaybackId,
      transcriptSentences: teachersLessonOverviewFixture().transcriptSentences,
      expired: teachersLessonOverviewFixture().expired,
      hasDownloadableResources:
        teachersLessonOverviewFixture().hasDownloadableResources,
    },
  ],
  introQuiz: teachersLessonOverviewFixture().introQuiz,
  exitQuiz: teachersLessonOverviewFixture().exitQuiz,
}));
const teachersLessonOverviewPaths = jest.fn(() => ({
  mv_lessons: teachersLessonOverviewPathsFixture().lessons,
}));
const unitListingPaths = jest.fn(() => ({
  mv_programmes: unitListingPathsFixture().programmes,
}));
const unitListing = jest.fn(() => ({
  mv_programmes: [
    {
      programmeSlug: unitListingFixture().programmeSlug,
      keyStageSlug: unitListingFixture().keyStageSlug,
      keyStageTitle: unitListingFixture().keyStageTitle,
      subjectSlug: unitListingFixture().subjectSlug,
      subjectTitle: unitListingFixture().subjectTitle,
      tierSlug: unitListingFixture().tierSlug,
    },
  ],
  mv_tiers: unitListingFixture().tiers,
  mv_units: unitListingFixture().units,
}));

const tierListing = jest.fn(() => ({
  mv_programmes: tierListingFixture().programmes,
}));

jest.mock("./generated/sdk", () => ({
  __esModule: true,
  getSdk: () => ({
    teachersHomePage: (...args: []) => teachersHomePage(...args),
    teachersKeyStageSubjects: (...args: []) =>
      teachersKeyStageSubjects(...args),
    teachersKeyStageSubjectTiers: (...args: []) =>
      teachersKeyStageSubjectTiers(...args),
    teachersKeyStageSubjectTiersPaths: (...args: []) =>
      teachersKeyStageSubjectTiersPaths(...args),
    teachersKeyStageSubjectUnits: (...args: []) =>
      teachersKeyStageSubjectUnits(...args),
    teachersKeyStageSubjectUnitsPaths: (...args: []) =>
      teachersKeyStageSubjectUnitsPaths(...args),
    teachersKeyStageSubjectUnitLessons: (...args: []) =>
      teachersKeyStageSubjectUnitLessons(...args),
    teachersKeyStageSubjectUnitLessonsDownloads: (...args: []) =>
      teachersKeyStageSubjectUnitLessonsDownloads(...args),
    teachersLessonOverview: (...args: []) => teachersLessonOverview(...args),
    teachersLessonOverviewPaths: (...args: []) =>
      teachersLessonOverviewPaths(...args),
    unitListingPaths: (...args: []) => unitListingPaths(...args),
    unitListing: (...args: []) => unitListing(...args),
    tierListing: (...args: []) => tierListing(...args),
  }),
}));
describe("curriculum-api", () => {
  test("teachersHomePage", async () => {
    await curriculumApi.teachersHomePage();
    expect(teachersHomePage).toHaveBeenCalled();
  });
  test("teachersKeyStageSubjects", async () => {
    await curriculumApi.teachersKeyStageSubjects({ keyStageSlug: "ks123" });
    expect(teachersKeyStageSubjects).toHaveBeenCalledWith({
      keyStageSlug: "ks123",
    });
  });
  test("teachersKeyStageSubjectUnits", async () => {
    await curriculumApi.teachersKeyStageSubjectUnits({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
      learningThemeSlug: null,
    });
    expect(teachersKeyStageSubjectUnits).toHaveBeenCalledWith({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
      learningThemeSlug: null,
    });
  });
  test("teachersKeyStageSubjectUnitsPaths", async () => {
    await curriculumApi.teachersKeyStageSubjectUnitsPaths();
    expect(teachersKeyStageSubjectUnitsPaths).toHaveBeenCalled();
  });
  test("teachersKeyStageSubjectTiers", async () => {
    await curriculumApi.teachersKeyStageSubjectTiers({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
    });
    expect(teachersKeyStageSubjectTiers).toHaveBeenCalledWith({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
    });
  });
  test("teachersKeyStageSubjectTiersPaths", async () => {
    await curriculumApi.teachersKeyStageSubjectTiersPaths();
    expect(teachersKeyStageSubjectTiersPaths).toHaveBeenCalled();
  });
  test("teachersKeyStageSubjectUnitLessons", async () => {
    await curriculumApi.teachersKeyStageSubjectUnitLessons({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
      unitSlug: "macbeth-1",
    });
    expect(teachersKeyStageSubjectUnitLessons).toHaveBeenCalledWith({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
      unitSlug: "macbeth-1",
    });
  });
  test("teachersKeyStageSubjectUnitLessonsDownloads", async () => {
    await curriculumApi.teachersKeyStageSubjectUnitLessonsDownloads({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
      unitSlug: "macbeth-1",
      lessonSlug: "islamic-geometry",
    });
    expect(teachersKeyStageSubjectUnitLessonsDownloads).toHaveBeenCalledWith({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
      unitSlug: "macbeth-1",
      lessonSlug: "islamic-geometry",
    });
  });
  test("teachersLessonOverview", async () => {
    await curriculumApi.teachersLessonOverview({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
      unitSlug: "macbeth-1",
      lessonSlug: "islamic-geometry",
    });
    expect(teachersLessonOverview).toHaveBeenCalledWith({
      keyStageSlug: "ks123",
      subjectSlug: "english-9",
      unitSlug: "macbeth-1",
      lessonSlug: "islamic-geometry",
    });
  });
  test("teachersLessonOverviewPaths", async () => {
    await curriculumApi.teachersLessonOverviewPaths();
    expect(teachersLessonOverviewPaths).toHaveBeenCalled();
  });
  test("unitListingPaths", async () => {
    await curriculumApi.unitListingPaths();
    expect(unitListingPaths).toHaveBeenCalled();
  });
  test("unitListing", async () => {
    await curriculumApi.unitListing({
      programmeSlug: "maths-secondary-ks4",
    });
    expect(unitListing).toHaveBeenCalledWith({
      programmeSlug: "maths-secondary-ks4",
    });
  });

  test("tierListing", async () => {
    await curriculumApi.tierListing({
      keyStageSlug: "ks4",
      subjectSlug: "higher",
    });
    expect(tierListing).toHaveBeenCalledWith({
      keyStageSlug: "ks4",
      subjectSlug: "higher",
    });
  });
});
