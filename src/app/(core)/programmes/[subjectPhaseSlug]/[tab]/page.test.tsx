/**
 * @jest-environment node
 */
import { getProgrammeData } from "./getProgrammeData";
import ProgrammePageTabs, { generateMetadata } from "./page";

import { createUnit } from "@/fixtures/curriculum/unit";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import curriculumPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPhaseOptions.fixture";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";

const defaultParams = new URLSearchParams("");
const mockUseSearchParams = jest.fn(() => defaultParams);
jest.mock("next/navigation", () => {
  return {
    __esModule: true,
    usePathname: () => "/timetabling/maths-primary/units",
    useSearchParams: () => mockUseSearchParams(),
    useRouter: () => ({
      replace: jest.fn(),
      push: jest.fn(),
    }),
    notFound: () => {
      throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
    },
  };
});

const featureFlagMock = jest.fn().mockResolvedValue(false);
jest.mock("@/utils/featureFlags", () => ({
  useFeatureFlag: () => featureFlagMock(),
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

jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    curriculumOverviewPage: jest.fn().mockResolvedValue({
      id: "curriculum.overview",
      curriculumExplainer: {
        explainerRaw: [],
      },
      subjectPrinciples: [],
      partnerBio: "",
      curriculumPartner: null,
      curriculumPartnerOverviews: [],
      curriculumSeoTextRaw: null,
    }),
    programmePageBySlug: jest.fn(),
  },
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  curriculumPhaseOptions: jest.fn().mockResolvedValue([
    {
      tab: "units",
      slug: "maths",
      title: "Maths",
      phases: [
        {
          slug: "primary",
          title: "Primary",
        },
      ],
      ks4_options: [],
    },
  ]),
}));

jest.mock("@/browser-lib/getBrowserConfig", () => ({
  __esModule: true,
  default: jest.fn((key: string) => {
    if (key === "seoAppUrl") {
      return "https://www.thenational.academy";
    }
    // Return empty string for other keys (matches global mock behavior)
    return "";
  }),
}));

jest.mock("./getProgrammeData", () => ({
  getProgrammeData: jest.fn(),
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

describe("Programme page tabs", () => {
  it("renders 404 page if feature flag is disabled", async () => {
    await expect(
      ProgrammePageTabs({
        params: Promise.resolve({
          subjectPhaseSlug: "maths-primary",
          tab: "units",
          searchParams: Promise.resolve({}),
        }),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });

  it("renders when the feature flag is enabled", async () => {
    featureFlagMock.mockResolvedValue(true);

    // Mock getProgrammeData to return valid data
    jest.mocked(getProgrammeData).mockResolvedValue({
      programmeUnitsData: curriculumOverviewMVFixture({
        subjectTitle: "Maths",
      }),
      curriculumUnitsData: {
        units: [
          createUnit({
            slug: "test",
            year: "5",
            subject_slug: "maths",
            phase_slug: "primary",
          }),
        ],
      },
      curriculumPhaseOptions: {
        subjects: filterValidCurriculumPhaseOptions(
          curriculumPhaseOptionsFixture().filter((s) => s.slug === "maths"),
        ),
        tab: "units" as const,
      },
      subjectPhaseKeystageSlugs: {
        subjectSlug: "maths",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      },
    });

    const result = await ProgrammePageTabs({
      params: Promise.resolve({
        subjectPhaseSlug: "maths-primary",
        tab: "units",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
  });

  it("returns 404 page if params are invalid", async () => {
    featureFlagMock.mockResolvedValue(true);
    jest.mocked(getProgrammeData).mockResolvedValue(null);

    await expect(
      ProgrammePageTabs({
        params: Promise.resolve({
          subjectPhaseSlug: "fake-slug",
          tab: "units",
        }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});

describe("generateMetadata", () => {
  it("returns empty object when no programme data is found", async () => {
    jest.mocked(getProgrammeData).mockResolvedValueOnce(null);

    const result = await generateMetadata({
      params: Promise.resolve({
        subjectPhaseSlug: "maths-primary",
        tab: "units",
      }),
    });

    expect(result).toEqual({});
  });

  it("generates metadata with title, description, and canonical URL", async () => {
    const mockProgrammeData = {
      programmeUnitsData: curriculumOverviewMVFixture({
        subjectTitle: "Maths",
      }),
      curriculumUnitsData: {
        units: [
          createUnit({
            slug: "unit-1",
            year: "5",
            keystage_slug: "ks2",
            subject_slug: "maths",
            phase_slug: "primary",
          }),
        ],
      },
      curriculumPhaseOptions: {
        subjects: filterValidCurriculumPhaseOptions(
          curriculumPhaseOptionsFixture(),
        ),
        tab: "units" as const,
      },
      subjectPhaseKeystageSlugs: {
        subjectSlug: "maths",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      },
    };

    jest.mocked(getProgrammeData).mockResolvedValue(mockProgrammeData);

    const result = await generateMetadata({
      params: Promise.resolve({
        subjectPhaseSlug: "maths-primary",
        tab: "units",
      }),
    });

    expect(result.title).toBe("KS2 maths curriculum unit sequence");
    expect(result.description).toContain("Explore our free KS2 maths");
    expect(result.description).toContain("curriculum unit sequences");
    expect(result.alternates?.canonical).toBe(
      "https://www.thenational.academy/programmes/maths-primary",
    );
    expect(result.openGraph?.title).toBe("KS2 maths curriculum unit sequence");
    expect(result.openGraph?.description).toContain(
      "Explore our free KS2 maths",
    );
    expect(result.twitter?.title).toBe("KS2 maths curriculum unit sequence");
    expect(result.twitter?.description).toContain("Explore our free KS2 maths");
  });

  it("handles errors gracefully and returns empty object", async () => {
    jest.mocked(getProgrammeData).mockRejectedValue(new Error("Test error"));

    const result = await generateMetadata({
      params: Promise.resolve({
        subjectPhaseSlug: "maths-primary",
        tab: "units",
      }),
    });

    expect(result).toEqual({});
  });
});
