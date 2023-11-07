import teachersHomePageFixture from "./fixtures/teachersHomePage.fixture";
import lessonDownloadsFixtures from "./fixtures/lessonDownloads.fixture";
import unitListingFixture from "./fixtures/unitListing.fixture";
import tierListingFixture from "./fixtures/tierListing.fixture";
import lessonOverviewFixture from "./fixtures/lessonOverview.fixture";
import lessonListingFixture from "./fixtures/lessonListing.fixture";
import subjectListingFixture from "./fixtures/subjectListing.fixture";
import unitsFixture from "./fixtures/units.fixture";
import lessonShareFixtures from "./fixtures/lessonShare.fixture";

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
const lessonShares = jest.fn(() => ({
  mv_share: [lessonShareFixtures()],
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
      examBoardSlug: unitListingFixture().examBoardSlug,
      examBoardTitle: unitListingFixture().examBoardTitle,
      totalUnitCount: unitListingFixture().totalUnitCount,
    },
  ],
  mv_tiers: unitListingFixture().tiers,
  mv_units: unitsFixture(),
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
      keyLearningPoints: lessonOverviewFixture().keyLearningPoints,
      additionalMaterialUrl: lessonOverviewFixture().additionalMaterialUrl,
      lessonEquipmentAndResources:
        lessonOverviewFixture().lessonEquipmentAndResources,
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
  starterQuiz: lessonOverviewFixture().starterQuiz,
  exitQuiz: lessonOverviewFixture().exitQuiz,
}));
const tierListing = jest.fn(() => ({
  mv_programmes: tierListingFixture().programmes,
}));
const subjectListing = jest.fn(() => ({
  mv_programmes_available: subjectListingFixture().subjects,
  mv_programmes_unavailable: subjectListingFixture().subjectsUnavailable,
  mv_key_stages: teachersHomePageFixture().keyStages,
  keyStageList: [{ slug: "ks4", title: "Key stage 4", shortCode: "KS4" }],
}));

jest.mock("");

jest.mock("./generated/sdk", () => ({
  __esModule: true,
  getSdk: () => ({
    teachersHomePage: (...args: []) => teachersHomePage(...args),
    lessonDownloads: (...args: []) => lessonDownloads(...args),
    unitListing: (...args: []) => unitListing(...args),
    lessonOverview: (...args: []) => lessonOverview(...args),
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
      unitSlug: "islamic-geometry-maths-unit-76",
    });
    expect(lessonDownloads).toHaveBeenCalledWith(
      {
        programmeSlug: "math-higher-ks4",
        lessonSlug: "islamic-geometry",
        unitSlug: "islamic-geometry-maths-unit-76",
      },
      undefined,
    );
  });
  test("lessonShare", async () => {
    await curriculumApi.lessonShare({
      programmeSlug: "math-higher-ks4",
      lessonSlug: "islamic-geometry",
      unitSlug: "islamic-geometry-maths-unit-76",
    });
    expect(lessonShares).toHaveBeenCalledWith(
      {
        programmeSlug: "math-higher-ks4",
        lessonSlug: "islamic-geometry",
        unitSlug: "islamic-geometry-maths-unit-76",
      },
      undefined,
    );
  });
  test("unitListing", async () => {
    await curriculumApi.unitListing({
      programmeSlug: "maths-secondary-ks4-l",
    });
    expect(unitListing).toHaveBeenCalledWith(
      {
        programmeSlug: "maths-secondary-ks4",
        subjectSlug: undefined,
      },
      undefined,
    );
  });
  test("unitListing learningThemes contains 'no themes'", async () => {
    const units = await curriculumApi.unitListing({
      programmeSlug: "maths-secondary-ks4",
    });
    const hasThemes = units.learningThemes
      ? units.learningThemes?.filter((theme) => theme.themeSlug === "no-theme")
          .length > 0
      : false;

    expect(hasThemes).toBe(true);
  });
  test("lessonListing", async () => {
    await curriculumApi.lessonListing({
      unitSlug: "geometry",
      programmeSlug: "maths-secondary-ks4",
    });
    expect(lessonListing).toHaveBeenCalledWith(
      {
        unitSlug: "geometry",
        programmeSlug: "maths-secondary-ks4",
        subjectSlug: undefined,
      },
      undefined,
    );
  });
  test("lessonOverview", async () => {
    await curriculumApi.lessonOverview({
      lessonSlug: "Geometry fundamentals",
      unitSlug: "geometry",
      programmeSlug: "maths-secondary-ks4",
    });
    expect(lessonOverview).toHaveBeenCalledWith(
      {
        lessonSlug: "Geometry fundamentals",
        unitSlug: "geometry",
        programmeSlug: "maths-secondary-ks4",
      },
      undefined,
    );
  });
  test("tierListing", async () => {
    await curriculumApi.tierListing({
      keyStageSlug: "ks4",
      subjectSlug: "higher-l",
    });
    expect(tierListing).toHaveBeenCalledWith(
      {
        keyStageSlug: "ks4",
        subjectSlug: "higher",
      },
      undefined,
    );
  });
  test("tierListing: not found", async () => {
    tierListing.mockImplementationOnce(() => {
      return {
        mv_programmes: [],
      };
    });
    await expect(
      curriculumApi.tierListing({
        keyStageSlug: "ks4",
        subjectSlug: "not-found",
      }),
    ).rejects.toThrow("Resource not found");
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
    const availableProgrammes = subjectListingFixture().subjects;
    const unavailableProgrammes = subjectListingFixture().subjectsUnavailable;
    const filteredUnavailableProgrammes = filterOutDuplicateProgrammesOrNull(
      availableProgrammes,
      unavailableProgrammes,
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
