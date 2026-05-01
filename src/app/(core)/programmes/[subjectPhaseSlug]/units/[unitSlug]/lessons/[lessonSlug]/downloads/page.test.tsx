/**
 * @jest-environment node
 */
import LessonDownloadsPage, { generateMetadata } from "./page";

import { LessonDownloadsPageData } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

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

const mockLessonDownloads = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonDownloads: (...args: unknown[]) => mockLessonDownloads(...args),
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

const lessonDownloadsFixture: Partial<LessonDownloadsPageData> = {
  programmeSlug: "maths-primary",
  unitSlug: "geometry-abc123",
  unitTitle: "Geometry",
  lessonSlug: "intro-to-geometry-abc123",
  lessonTitle: "Introduction to Geometry",
  subjectSlug: "maths",
  subjectTitle: "Maths",
  subjectParent: null,
  phaseSlug: "primary",
  phaseTitle: "Primary",
  pathwaySlug: null,
  keyStageSlug: "ks2",
  keyStageTitle: "Key Stage 2",
  examBoardSlug: null,
  examBoardTitle: null,
  tierSlug: null,
  tierTitle: null,
  yearGroupSlug: "year-4",
  yearGroupTitle: "Year 4",
  pathwayTitle: null,
  downloads: [],
  additionalFiles: [],
  expired: false,
  isSpecialist: false,
  isLegacy: false,
  legacyCopyrightContent: null,
  updatedAt: "2024-01-01",
  nextLessons: [],
  lessonReleaseDate: null,
  loginRequired: false,
  geoRestricted: false,
  actions: null,
};

const defaultParams = {
  subjectPhaseSlug: "maths-primary",
  unitSlug: "geometry-abc123",
  lessonSlug: "intro-to-geometry-abc123",
};

describe("LessonDownloadsPage", () => {
  beforeEach(() => {
    mockLessonDownloads.mockResolvedValue(lessonDownloadsFixture);
  });

  it("renders 404 if feature flag is disabled", async () => {
    featureFlagMock.mockResolvedValue(false);

    await expect(
      LessonDownloadsPage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });

  it("renders when the feature flag is enabled", async () => {
    featureFlagMock.mockResolvedValue(true);

    const result = await LessonDownloadsPage({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(mockLessonDownloads).toHaveBeenCalledWith({
      programmeSlug: defaultParams.subjectPhaseSlug,
      unitSlug: defaultParams.unitSlug,
      lessonSlug: defaultParams.lessonSlug,
    });
  });
});

describe("generateMetadata", () => {
  it("returns empty object when fetch fails", async () => {
    mockLessonDownloads.mockRejectedValue(new Error("Not found"));

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toEqual({});
  });

  it("returns metadata with noindex and nofollow when fetch succeeds", async () => {
    mockLessonDownloads.mockResolvedValue(lessonDownloadsFixture);

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toMatchObject({
      title: "Lesson Download: Introduction to Geometry | KS2 Maths",
      description:
        "Select and download free lesson resources, including slide decks, worksheets and quizzes",
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});
