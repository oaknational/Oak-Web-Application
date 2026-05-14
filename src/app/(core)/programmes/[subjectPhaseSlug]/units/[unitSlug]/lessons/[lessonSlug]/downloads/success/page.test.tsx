/**
 * @jest-environment node
 */
import LessonDownloadsSuccessPage, { generateMetadata } from "./page";

jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
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

const defaultParams = {
  subjectPhaseSlug: "science-secondary-ks3",
  unitSlug: "solid-liquid-gas-states-and-changes-of-state",
  lessonSlug: "solid-and-liquid-states",
};

const teachersUnitOverviewFixture = {
  programmeSlug: "science-secondary-ks3",
  unitSlug: "solid-liquid-gas-states-and-changes-of-state",
  unitvariantId: 123,
  unitTitle: "Solid, liquid and gas states and changes of state",
  unitDescription: "Unit description",
  keyStageSlug: "ks3",
  keyStageTitle: "Key Stage 3",
  subjectSlug: "science",
  subjectTitle: "Science",
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

describe("LessonDownloadsSuccessPage", () => {
  beforeEach(() => {
    mockTeachersUnitOverview.mockResolvedValue(teachersUnitOverviewFixture);
  });

  it("fetches unit data and renders success confirmation", async () => {
    const result = await LessonDownloadsSuccessPage({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(mockTeachersUnitOverview).toHaveBeenCalledWith({
      programmeSlug: defaultParams.subjectPhaseSlug,
      unitSlug: defaultParams.unitSlug,
    });
    expect(result).toMatchObject({
      props: {
        lesson: expect.objectContaining({
          lessonSlug: "solid-and-liquid-states",
          unitvariantId: 123,
        }),
      },
    });
  });

  it("renders 404 when lesson release date is missing", async () => {
    mockTeachersUnitOverview.mockResolvedValue({
      ...teachersUnitOverviewFixture,
      lessons: [
        {
          ...teachersUnitOverviewFixture.lessons[0],
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
    mockTeachersUnitOverview.mockResolvedValue(teachersUnitOverviewFixture);

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toMatchObject({
      title: "Thanks for downloading! Solid and liquid states | KS3 Science",
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});
