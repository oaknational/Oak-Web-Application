import teachersHomePageFixture from "./fixtures/teachersHomePage.fixture";
import lessonDownloadsFixtures from "./fixtures/lessonDownloads.fixture";
import unitListingFixture from "./fixtures/unitListing.fixture";
import tierListingFixture from "./fixtures/tierListing.fixture";
import unitListingPathsFixture from "./fixtures/unitListingPaths.fixture";
import lessonOverviewFixture from "./fixtures/lessonOverview.fixture";
import lessonOverviewPathsFixture from "./fixtures/lessonOverviewPaths.fixture";
import lessonListingFixture from "./fixtures/lessonListing.fixture";
import lessonListingPathsFixture from "./fixtures/lessonListingPaths.fixture";
import subjectListingFixture from "./fixtures/subjectListing.fixture";

import curriculumApi, { filterOutDuplicateProgrammesOrNull } from ".";

/**
 * This module is mocked in jest.setup.js, so need to unmock it here in order to test it
 */
jest.unmock(".");

const teachersHomePage = jest.fn(() => ({
  mv_key_stages: teachersHomePageFixture().keyStages,
}));
const lessonDownloads = jest.fn(() => ({
  mv_downloads: [lessonDownloadsFixtures()],
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
      totalUnitCount: unitListingFixture().totalUnitCount,
    },
  ],
  mv_tiers: unitListingFixture().tiers,
  mv_units: unitListingFixture().units,
}));
const lessonListingPaths = jest.fn(() => ({
  mv_lessons: lessonListingPathsFixture().units,
}));
const lessonListing = jest.fn(() => ({
  mv_units: [
    {
      programmeSlug: lessonListingFixture().programmeSlug,
      keyStageSlug: lessonListingFixture().keyStageSlug,
      keyStageTitle: lessonListingFixture().keyStageTitle,
      subjectSlug: lessonListingFixture().subjectSlug,
      subjectTitle: lessonListingFixture().subjectTitle,
      tierSlug: lessonListingFixture().tierSlug,
      unitSlug: lessonListingFixture().unitSlug,
      unitTitle: lessonListingFixture().unitTitle,
    },
  ],
  mv_lessons: lessonListingFixture().lessons,
}));
const lessonOverview = jest.fn(() => ({
  mv_lessons: [
    {
      lessonSlug: lessonOverviewFixture().lessonSlug,
      lessonTitle: lessonOverviewFixture().lessonTitle,
      programmeSlug: lessonOverviewFixture().programmeSlug,
      keyStageSlug: lessonOverviewFixture().keyStageSlug,
      keyStageTitle: lessonOverviewFixture().keyStageTitle,
      unitSlug: lessonOverviewFixture().unitSlug,
      unitTitle: lessonOverviewFixture().unitTitle,
      subjectSlug: lessonOverviewFixture().subjectSlug,
      subjectTitle: lessonOverviewFixture().subjectTitle,
      coreContent: lessonOverviewFixture().coreContent,
      equipmentRequired: lessonOverviewFixture().equipmentRequired,
      supervisionLevel: lessonOverviewFixture().supervisionLevel,
      contentGuidance: lessonOverviewFixture().contentGuidance,
      presentationUrl: lessonOverviewFixture().presentationUrl,
      worksheetUrl: lessonOverviewFixture().worksheetUrl,
      isWorksheetLandscape: lessonOverviewFixture().isWorksheetLandscape,
      hasCopyrightMaterial: lessonOverviewFixture().hasCopyrightMaterial,
      videoMuxPlaybackId: lessonOverviewFixture().videoMuxPlaybackId,
      videoWithSignLanguageMuxPlaybackId:
        lessonOverviewFixture().videoWithSignLanguageMuxPlaybackId,
      transcriptSentences: lessonOverviewFixture().transcriptSentences,
      expired: lessonOverviewFixture().expired,
      hasDownloadableResources:
        lessonOverviewFixture().hasDownloadableResources,
    },
  ],
  introQuiz: lessonOverviewFixture().introQuiz,
  exitQuiz: lessonOverviewFixture().exitQuiz,
}));
const lessonOverviewPaths = jest.fn(() => ({
  mv_lessons: lessonOverviewPathsFixture().lessons,
}));

const tierListing = jest.fn(() => ({
  mv_programmes: tierListingFixture().programmes,
}));

const subjectListing = jest.fn(() => ({
  mv_programmes_available: subjectListingFixture().programmesAvailable,
  mv_programmes_unavailable: subjectListingFixture().programmesUnavailable,
  mv_key_stages: teachersHomePageFixture().keyStages,
}));

jest.mock("");

jest.mock("./generated/sdk", () => ({
  __esModule: true,
  getSdk: () => ({
    teachersHomePage: (...args: []) => teachersHomePage(...args),
    lessonDownloads: (...args: []) => lessonDownloads(...args),
    unitListingPaths: (...args: []) => unitListingPaths(...args),
    unitListing: (...args: []) => unitListing(...args),
    lessonOverviewPaths: (...args: []) => lessonOverviewPaths(...args),
    lessonOverview: (...args: []) => lessonOverview(...args),
    lessonListingPaths: (...args: []) => lessonListingPaths(...args),
    lessonListing: (...args: []) => lessonListing(...args),
    tierListing: (...args: []) => tierListing(...args),
    subjectListing: (...args: []) => subjectListing(...args),
  }),
}));
describe("curriculum-api", () => {
  test("teachersHomePage", async () => {
    await curriculumApi.teachersHomePage();
    expect(teachersHomePage).toHaveBeenCalled();
  });
  test("lessonDownloads", async () => {
    await curriculumApi.lessonDownloads({
      programmeSlug: "math-higher-ks4",
      lessonSlug: "islamic-geometry",
      unitSlug: "islamic-geometry",
    });
    expect(lessonDownloads).toHaveBeenCalledWith({
      programmeSlug: "math-higher-ks4",
      lessonSlug: "islamic-geometry",
      unitSlug: "islamic-geometry",
    });
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
  test("unitListing learningThemes contains 'no themes'", async () => {
    const units = await curriculumApi.unitListing({
      programmeSlug: "maths-secondary-ks4",
    });
    const hasThemes =
      units.learningThemes?.filter(
        (theme) => theme.learningThemeSlug === "no-theme"
      ).length > 0;

    expect(hasThemes).toBe(true);
  });
  test("lessonListingPaths", async () => {
    await curriculumApi.lessonListingPaths();
    expect(lessonListingPaths).toHaveBeenCalled();
  });
  test("lessonListing", async () => {
    await curriculumApi.lessonListing({
      unitSlug: "geometry",
      programmeSlug: "maths-secondary-ks4",
    });
    expect(lessonListing).toHaveBeenCalledWith({
      unitSlug: "geometry",
      programmeSlug: "maths-secondary-ks4",
    });
  });
  test("lessonOverviewPaths", async () => {
    await curriculumApi.lessonOverviewPaths();
    expect(lessonOverviewPaths).toHaveBeenCalled();
  });
  test("lessonOverview", async () => {
    await curriculumApi.lessonOverview({
      lessonSlug: "Geometry fundamentals",
      unitSlug: "geometry",
      programmeSlug: "maths-secondary-ks4",
    });
    expect(lessonOverview).toHaveBeenCalledWith({
      lessonSlug: "Geometry fundamentals",
      unitSlug: "geometry",
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
  test("subjectListing", async () => {
    await curriculumApi.subjectListing({
      keyStageSlug: "ks4",
    });
    expect(subjectListing).toHaveBeenCalledWith({
      keyStageSlug: "ks4",
    });
  });
  test("filterOutDuplicateProgrammesOrNull - there are no available programmes in unavailable programmes  ", async () => {
    const availableProgrammes = subjectListingFixture().programmesAvailable;
    const unavailableProgrammes = subjectListingFixture().programmesUnavailable;
    const filteredUnavailableProgrammes = filterOutDuplicateProgrammesOrNull(
      availableProgrammes,
      unavailableProgrammes
    );

    let unavailableDuplicates = false;
    let filteredUnavailableDuplicates = false;

    unavailableProgrammes.forEach((unavailable) => {
      availableProgrammes.forEach((available) => {
        if (unavailable.subjectSlug === available.subjectSlug) {
          unavailableDuplicates = true;
        }
      });
    });
    filteredUnavailableProgrammes.forEach((unavailable) => {
      availableProgrammes.forEach((available) => {
        if (unavailable.subjectSlug === available.subjectSlug) {
          filteredUnavailableDuplicates = true;
        }
      });
    });

    expect(unavailableDuplicates).toBe(true);
    expect(filteredUnavailableDuplicates).toBe(false);
  });
});
