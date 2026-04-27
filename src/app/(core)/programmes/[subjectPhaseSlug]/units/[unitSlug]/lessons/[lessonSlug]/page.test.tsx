/**
 * @jest-environment node
 */
import LessonPage, { generateMetadata } from "./page";

import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";

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

const mockLessonOverview = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    teachersLessonOverview: (...args: unknown[]) => mockLessonOverview(...args),
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

const lessonOverviewFixture: Partial<TeachersLessonOverviewPageData> = {
  programmeSlug: "maths-primary-ks2",
  unitSlug: "geometry-abc123",
  unitTitle: "Geometry",
  lessonSlug: "intro-to-geometry-abc123",
  lessonTitle: "Introduction to Geometry",
  subjectSlug: "maths",
  subjectTitle: "Maths",
  subjectParent: null,
  yearTitle: "Year 4",
  year: "4",
  keyStageSlug: "ks2",
  keyStageTitle: "Key Stage 2",
  tierSlug: null,
  tierTitle: null,
  examBoardSlug: null,
  examBoardTitle: null,
  pupilLessonOutcome: "I can identify basic shapes",
  keyLearningPoints: [
    { keyLearningPoint: "Identify 2D shapes" },
    { keyLearningPoint: "Name properties of shapes" },
  ],
  lessonKeywords: [
    { keyword: "Polygon", description: "A 2D shape with straight sides" },
  ],
  downloads: [],
  updatedAt: "2024-01-01",
  additionalFiles: null,
  lessonMediaClips: null,
  lessonReleaseDate: null,
  loginRequired: false,
  geoRestricted: false,
  excludedFromTeachingMaterials: false,
  subjectCategories: null,
};

const defaultParams = {
  subjectPhaseSlug: "maths-primary-ks2",
  unitSlug: "geometry-abc123",
  lessonSlug: "intro-to-geometry-abc123",
};

describe("LessonPage", () => {
  beforeEach(() => {
    mockLessonOverview.mockResolvedValue(lessonOverviewFixture);
  });

  it("renders 404 if feature flag is disabled", async () => {
    featureFlagMock.mockResolvedValue(false);

    await expect(
      LessonPage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });

  it("renders when the feature flag is enabled", async () => {
    featureFlagMock.mockResolvedValue(true);

    const result = await LessonPage({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(mockLessonOverview).toHaveBeenCalledWith({
      programmeSlug: defaultParams.subjectPhaseSlug,
      unitSlug: defaultParams.unitSlug,
      lessonSlug: defaultParams.lessonSlug,
    });
  });

  it("renders 404 when data is not found", async () => {
    featureFlagMock.mockResolvedValue(true);
    mockLessonOverview.mockRejectedValue(
      new Error("NEXT_HTTP_ERROR_FALLBACK;404"),
    );

    await expect(
      LessonPage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});

describe("generateMetadata", () => {
  it("returns empty object when fetch fails", async () => {
    mockLessonOverview.mockRejectedValue(new Error("Not found"));

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toEqual({});
  });

  it("generates metadata with correct title and description", async () => {
    mockLessonOverview.mockResolvedValue(lessonOverviewFixture);

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result.title).toBe(
      "Introduction to Geometry KS2 | Y4 Maths | Lesson Resources | Oak National Academy",
    );
    expect(result.description).toBe(
      "View lesson content and choose resources to download or share",
    );
    expect(result.openGraph?.title).toBe(
      "Introduction to Geometry KS2 | Y4 Maths | Lesson Resources | Oak National Academy",
    );
    expect(result.twitter?.title).toBe(
      "Introduction to Geometry KS2 | Y4 Maths | Lesson Resources | Oak National Academy",
    );
  });

  it("includes tier and exam board correctly in title when present", async () => {
    const fixtureWithTierAndExamBoard = {
      ...lessonOverviewFixture,
      tierTitle: "Higher",
      examBoardTitle: "Edexcel",
    };
    mockLessonOverview.mockResolvedValue(fixtureWithTierAndExamBoard);

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result.title).toBe(
      "Introduction to Geometry KS2 | Y4 Maths Higher Edexcel | Lesson Resources | Oak National Academy",
    );
    expect(result.openGraph?.title).toBe(
      "Introduction to Geometry KS2 | Y4 Maths Higher Edexcel | Lesson Resources | Oak National Academy",
    );
    expect(result.twitter?.title).toBe(
      "Introduction to Geometry KS2 | Y4 Maths Higher Edexcel | Lesson Resources | Oak National Academy",
    );
    expect(result.description).toBe(
      "View lesson content and choose resources to download or share",
    );
  });
});
