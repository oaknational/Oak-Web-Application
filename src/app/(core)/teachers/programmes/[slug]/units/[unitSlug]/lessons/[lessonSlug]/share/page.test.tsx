/**
 * @jest-environment node
 */
import LessonSharePage, { generateMetadata } from "./page";

import lessonShareFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonShare.fixture";

jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

const featureFlagMock = jest.fn().mockResolvedValue(true);
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

const mockLessonShare = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonShare: (...args: unknown[]) => mockLessonShare(...args),
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

const lessonShareFixture = lessonShareFixtures({
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
  tierTitle: null,
  yearGroupTitle: "Year 4",
  pathwayTitle: null,
  expired: false,
  isLegacy: false,
  lessonReleaseDate: null,
  loginRequired: false,
  georestricted: false,
});

const defaultParams = {
  slug: "maths-primary",
  unitSlug: "geometry-abc123",
  lessonSlug: "intro-to-geometry-abc123",
};

describe("LessonSharePage", () => {
  beforeEach(() => {
    featureFlagMock.mockResolvedValue(true);
    mockLessonShare.mockResolvedValue(lessonShareFixture);
  });

  it("renders 404 if feature flag is disabled", async () => {
    featureFlagMock.mockResolvedValue(false);

    await expect(
      LessonSharePage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });

  it("renders share view data", async () => {
    const result = await LessonSharePage({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(mockLessonShare).toHaveBeenCalledWith({
      programmeSlug: defaultParams.slug,
      unitSlug: defaultParams.unitSlug,
      lessonSlug: defaultParams.lessonSlug,
    });
    expect(result).toMatchObject({
      props: {
        lesson: lessonShareFixture,
        breadcrumbsSlot: expect.anything(),
      },
    });
  });

  it("returns 404 for restricted lessons", async () => {
    mockLessonShare.mockResolvedValue({
      ...lessonShareFixture,
      georestricted: true,
    });

    await expect(
      LessonSharePage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});

describe("generateMetadata", () => {
  it("returns empty object when fetch fails", async () => {
    mockLessonShare.mockRejectedValue(new Error("Not found"));

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toEqual({});
  });

  it("returns metadata with noindex and nofollow when fetch succeeds", async () => {
    mockLessonShare.mockResolvedValue(lessonShareFixture);

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toMatchObject({
      title: "Lesson Share: Introduction to Geometry | KS2 Maths",
      description:
        "Share online lesson activities with your students, such as videos, worksheets and quizzes.",
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});
