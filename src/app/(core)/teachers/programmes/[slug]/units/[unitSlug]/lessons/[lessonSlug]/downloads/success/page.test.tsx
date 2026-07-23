/**
 * @jest-environment node
 */
import LessonDownloadsSuccessPage, { generateMetadata } from "./page";

import teachersUnitOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersUnitOverview.fixture";

jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

const featureFlagMock = jest.fn().mockResolvedValue(undefined);
jest.mock("@/utils/featureFlags", () => ({
  getFeatureFlagValue: () => featureFlagMock(),
}));

const mockTeachersUnitOverview = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    teachersUnitOverview: (...args: unknown[]) =>
      mockTeachersUnitOverview(...args),
  },
}));

const unitFixture = {
  ...teachersUnitOverviewFixture(),
  lessons: [
    {
      lessonSlug: "solid-and-liquid-states",
      lessonTitle: "Solid and liquid states",
      isUnpublished: false,
      geoRestricted: false,
      loginRequired: false,
      lessonReleaseDate: "2026-01-01",
    },
  ],
};
const defaultParams = {
  slug: unitFixture.programmeSlug,
  unitSlug: unitFixture.unitSlug,
  lessonSlug: "solid-and-liquid-states",
};

describe("LessonDownloadsSuccessPage", () => {
  beforeEach(() => {
    mockTeachersUnitOverview.mockResolvedValue(unitFixture);
    featureFlagMock.mockResolvedValue(undefined);
  });

  it("fetches unit data and renders success confirmation", async () => {
    const result = await LessonDownloadsSuccessPage({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(mockTeachersUnitOverview).toHaveBeenCalledWith({
      programmeSlug: defaultParams.slug,
      unitSlug: defaultParams.unitSlug,
    });
    expect(result).toMatchSnapshot();
  });

  it.each([
    { flagValue: undefined, expectedVariant: "control" },
    { flagValue: "control", expectedVariant: "control" },
    { flagValue: "test", expectedVariant: "test" },
  ])(
    "renders $expectedVariant variant when feature flag is $flagValue",
    async ({ flagValue }) => {
      featureFlagMock.mockResolvedValue(flagValue);

      const result = await LessonDownloadsSuccessPage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      });

      expect(result).toMatchSnapshot();
    },
  );

  it("renders 404 when lesson release date is missing", async () => {
    mockTeachersUnitOverview.mockResolvedValue({
      ...unitFixture,
      lessons: [
        {
          ...unitFixture.lessons[0],
          lessonReleaseDate: null,
        },
      ],
    });

    await expect(
      LessonDownloadsSuccessPage({
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

  it("returns metadata with noindex and nofollow when fetch succeeds", async () => {
    mockTeachersUnitOverview.mockResolvedValue(unitFixture);

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toMatchObject({
      title: "Thanks for downloading! Solid and liquid states | KS3 Biology",
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});
