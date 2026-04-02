/**
 * @jest-environment node
 */
import UnitPage, { generateMetadata } from "./page";

import { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

const featureFlagMock = jest.fn().mockResolvedValue(false);
jest.mock("@/utils/featureFlags", () => ({
  getFeatureFlagValue: () => featureFlagMock(),
}));

// Jest is not setup to test RSCs, so it does not load the server build
// so we mock the cache function.
jest.mock("react", () => {
  const actualReact = jest.requireActual("react");

  return {
    ...actualReact,
    cache: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
  };
});

const mockTeachersUnitOverview = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    teachersUnitOverview: (...args: unknown[]) =>
      mockTeachersUnitOverview(...args),
  },
}));

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  initialiseBugsnag: jest.fn(),
  initialiseSentry: jest.fn(),
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

const unitOverviewFixture: TeachersUnitOverviewData = {
  programmeSlug: "maths-primary-ks2",
  unitSlug: "geometry-abc123",
  unitvariantId: 1,
  unitTitle: "Geometry",
  unitDescription: null,
  unitIndex: 1,
  unitCount: 1,
  subjectSlug: "maths",
  subjectTitle: "Maths",
  parentSubject: null,
  yearTitle: "Year 4",
  yearSlug: "year-4",
  year: "4",
  keyStageSlug: "ks2",
  keyStageTitle: "Key Stage 2",
  tierSlug: null,
  tierTitle: null,
  examBoardSlug: null,
  examBoardTitle: null,
  pathwaySlug: null,
  pathwayTitle: null,
  pathwayDisplayOrder: null,
  lessons: [],
  actions: null,
  containsGeorestrictedLessons: false,
  containsLoginRequiredLessons: false,
  nextUnit: null,
  prevUnit: null,
  subjectOptionToggles: [],
  tierOptionToggles: [],
};

const defaultParams = {
  subjectPhaseSlug: "maths-primary-ks2",
  unitSlug: "geometry-abc123",
};

describe("UnitPage", () => {
  beforeEach(() => {
    mockTeachersUnitOverview.mockResolvedValue(unitOverviewFixture);
  });

  it("renders 404 if feature flag is disabled", async () => {
    featureFlagMock.mockResolvedValue(false);

    await expect(
      UnitPage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });

  it("renders when the feature flag is enabled", async () => {
    featureFlagMock.mockResolvedValue(true);

    const result = await UnitPage({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(mockTeachersUnitOverview).toHaveBeenCalledWith({
      programmeSlug: defaultParams.subjectPhaseSlug,
      unitSlug: defaultParams.unitSlug,
      subjectCategorySlug: undefined,
    });
  });

  it("passes subject category from query params to data fetch", async () => {
    featureFlagMock.mockResolvedValue(true);

    await UnitPage({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({
        subject_category: "number-and-place-value",
      }),
    });

    expect(mockTeachersUnitOverview).toHaveBeenCalledWith({
      programmeSlug: defaultParams.subjectPhaseSlug,
      unitSlug: defaultParams.unitSlug,
      subjectCategorySlug: "number-and-place-value",
    });
  });

  it("renders 404 when data is not found", async () => {
    featureFlagMock.mockResolvedValue(true);
    mockTeachersUnitOverview.mockRejectedValue(
      new Error("NEXT_HTTP_ERROR_FALLBACK;404"),
    );

    await expect(
      UnitPage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});

describe("generateMetadata", () => {
  it("returns empty object when fetch fails", async () => {
    mockTeachersUnitOverview.mockRejectedValue(new Error("Not found"));

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toEqual({});
  });

  it("generates metadata with correct title and description", async () => {
    mockTeachersUnitOverview.mockResolvedValue(unitOverviewFixture);

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result.title).toBe("Geometry KS2 | Y4 Maths Lesson Resources");
    expect(result.description).toBe(
      "Free lessons and teaching resources about geometry",
    );
    expect(result.openGraph?.title).toBe(
      "Geometry KS2 | Y4 Maths Lesson Resources",
    );
    expect(result.twitter?.title).toBe(
      "Geometry KS2 | Y4 Maths Lesson Resources",
    );
  });

  it("passes subject category query param to metadata data fetch", async () => {
    mockTeachersUnitOverview.mockResolvedValue(unitOverviewFixture);

    await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({ subject_category: "statistics" }),
    });

    expect(mockTeachersUnitOverview).toHaveBeenCalledWith({
      programmeSlug: defaultParams.subjectPhaseSlug,
      unitSlug: defaultParams.unitSlug,
      subjectCategorySlug: "statistics",
    });
  });
});
