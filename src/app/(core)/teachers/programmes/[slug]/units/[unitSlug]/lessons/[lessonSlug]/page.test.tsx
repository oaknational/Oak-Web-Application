/**
 * @jest-environment node
 */
import LessonPage, { generateMetadata } from "./page";

import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";

jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

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

const defaultParams = {
  slug: "maths-primary-ks2",
  unitSlug: "geometry-abc123",
  lessonSlug: "intro-to-geometry-abc123",
};

describe("LessonPage", () => {
  beforeEach(() => {
    mockLessonOverview.mockResolvedValue(teachersLessonOverviewFixture());
  });

  it("renders 404 when data is not found", async () => {
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
    mockLessonOverview.mockResolvedValue(teachersLessonOverviewFixture());

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result.title).toBe(
      "Structure of cells KS3 | Y7 Biology | Lesson Resources",
    );
    expect(result.description).toBe(
      "View lesson content and choose resources to download or share",
    );
    expect(result.openGraph?.title).toBe(
      "Structure of cells KS3 | Y7 Biology | Lesson Resources",
    );
    expect(result.twitter?.title).toBe(
      "Structure of cells KS3 | Y7 Biology | Lesson Resources",
    );
  });

  it("includes tier and exam board correctly in title when present", async () => {
    mockLessonOverview.mockResolvedValue(
      teachersLessonOverviewFixture({
        tierTitle: "Higher",
        examBoardTitle: "Edexcel",
        pathwayTitle: "GCSE",
        keyStageTitle: "Key Stage 4",
        yearGroupTitle: "Year 11",
        year: "11",
        keyStageSlug: "ks4",
      }),
    );

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result.title).toBe(
      "Structure of cells GCSE | KS4 | Y11 Biology Higher Edexcel | Lesson Resources",
    );
    expect(result.openGraph?.title).toBe(
      "Structure of cells GCSE | KS4 | Y11 Biology Higher Edexcel | Lesson Resources",
    );
    expect(result.twitter?.title).toBe(
      "Structure of cells GCSE | KS4 | Y11 Biology Higher Edexcel | Lesson Resources",
    );
    expect(result.description).toBe(
      "View lesson content and choose resources to download or share",
    );
  });
});
