/**
 * @jest-environment node
 */
import { getProgrammeData, getSubjectPhaseOptions } from "./getProgrammeData";
import ProgrammePageTabs, { generateMetadata } from "./page";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { resolveOakHref } from "@/common-lib/urls";
import CMSClient from "@/node-lib/cms";
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
    redirect: (url: string) => {
      throw new Error(`NEXT_REDIRECT;${url}`);
    },
    permanentRedirect: (url: string) => {
      throw new Error(`NEXT_PERMANENT_REDIRECT;${url}`);
    },
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
  refreshedMVTime: jest.fn().mockResolvedValue(0),
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
  getSubjectPhaseOptions: jest.fn(),
  getSubjectOverride: jest.fn(),
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
  beforeEach(() => {
    jest.mocked(CMSClient.curriculumOverviewPage).mockClear();
    jest.mocked(getProgrammeData).mockClear();
  });

  it("permanentRedirects legacy programme slug on units tab", async () => {
    await expect(
      ProgrammePageTabs({
        params: Promise.resolve({
          slug: "citizenship-secondary-ks3",
          tab: "units",
        }),
        searchParams: Promise.resolve({
          year: "year-7",
          "learning-theme": "all",
        }),
      }),
    ).rejects.toThrow(/^NEXT_PERMANENT_REDIRECT;/);
    expect(getProgrammeData).not.toHaveBeenCalled();
  });

  it("does not redirect subject phase slug on units tab", async () => {
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
      examboardFilterDimensions: {},
    });

    jest.mocked(getSubjectPhaseOptions).mockResolvedValue({
      subjects: filterValidCurriculumPhaseOptions(
        curriculumPhaseOptionsFixture().filter((s) => s.slug === "maths"),
      ),
      subjectPhaseKeystageSlugs: {
        subjectSlug: "maths",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      },
    });

    const result = await ProgrammePageTabs({
      params: Promise.resolve({
        slug: "maths-primary",
        tab: "units",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
  });

  it("skips CMSClient.curriculumOverviewPage and renders when nonCurriculum is true", async () => {
    jest.mocked(getProgrammeData).mockResolvedValue({
      programmeUnitsData: curriculumOverviewMVFixture({
        subjectTitle: "Financial education",
        nonCurriculum: true,
      }),
      curriculumUnitsData: {
        units: [
          createUnit({
            slug: "test",
            year: "5",
            subject_slug: "financial-education",
            phase_slug: "primary",
          }),
        ],
      },
      examboardFilterDimensions: {},
    });

    jest.mocked(getSubjectPhaseOptions).mockResolvedValue({
      subjects: filterValidCurriculumPhaseOptions([
        {
          slug: "financial-education",
          title: "Financial education",
          phases: [{ slug: "primary", title: "Primary" }],
          ks4_options: [],
        },
      ]),
      subjectPhaseKeystageSlugs: {
        subjectSlug: "financial-education",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      },
    });

    const result = await ProgrammePageTabs({
      params: Promise.resolve({
        slug: "financial-education-primary",
        tab: "units",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(CMSClient.curriculumOverviewPage).not.toHaveBeenCalled();
  });

  it("returns 404 when nonCurriculum is false and CMSClient.curriculumOverviewPage returns null", async () => {
    jest
      .mocked(CMSClient.curriculumOverviewPage)
      .mockResolvedValueOnce(null as never);

    jest.mocked(getProgrammeData).mockResolvedValue({
      programmeUnitsData: curriculumOverviewMVFixture({
        subjectTitle: "Maths",
        nonCurriculum: false,
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
      examboardFilterDimensions: {},
    });

    jest.mocked(getSubjectPhaseOptions).mockResolvedValue({
      subjects: filterValidCurriculumPhaseOptions(
        curriculumPhaseOptionsFixture().filter((s) => s.slug === "maths"),
      ),
      subjectPhaseKeystageSlugs: {
        subjectSlug: "maths",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      },
    });

    await expect(
      ProgrammePageTabs({
        params: Promise.resolve({
          slug: "maths-primary",
          tab: "units",
        }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));

    expect(CMSClient.curriculumOverviewPage).toHaveBeenCalled();
  });

  it("returns 404 page if params are invalid", async () => {
    jest.mocked(getProgrammeData).mockResolvedValue(null);

    await expect(
      ProgrammePageTabs({
        params: Promise.resolve({
          slug: "fake-slug",
          tab: "units",
        }),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});

describe("generateMetadata", () => {
  beforeEach(() => {
    jest.mocked(getProgrammeData).mockClear();
  });

  it("permanentRedirects legacy programme slug on units tab", async () => {
    await expect(
      generateMetadata({
        params: Promise.resolve({
          slug: "citizenship-secondary-ks3",
          tab: "units",
        }),
        searchParams: Promise.resolve({ year: "year-7" }),
      }),
    ).rejects.toThrow(/^NEXT_PERMANENT_REDIRECT;/);
    expect(getProgrammeData).not.toHaveBeenCalled();
  });

  it("returns empty object when no subject data is found", async () => {
    jest.mocked(getSubjectPhaseOptions).mockResolvedValueOnce(null);

    const result = await generateMetadata({
      params: Promise.resolve({
        slug: "maths-primary",
        tab: "units",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result).toEqual({});
  });

  it("generates metadata with title, description, and canonical URL", async () => {
    const mockSubjectData = {
      subjects: filterValidCurriculumPhaseOptions(
        curriculumPhaseOptionsFixture(),
      ),
      subjectPhaseKeystageSlugs: {
        subjectSlug: "maths",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      },
    };

    jest.mocked(getSubjectPhaseOptions).mockResolvedValue(mockSubjectData);

    const result = await generateMetadata({
      params: Promise.resolve({
        slug: "maths-primary",
        tab: "units",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result.title).toBe(
      "Free Primary Maths Lesson & Curriculum Resources",
    );
    expect(result.description).toContain(
      "Get fully sequenced teaching resources and lesson plans for Primary Maths",
    );

    expect(result.alternates?.canonical).toBe(
      new URL(
        resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug: "maths-primary",
          tab: "units",
          query: undefined,
        }),
        getBrowserConfig("seoAppUrl"),
      ).toString(),
    );
    expect(result.openGraph?.title).toBe(
      "Free Primary Maths Lesson & Curriculum Resources",
    );
    expect(result.openGraph?.description).toContain(
      "Get fully sequenced teaching resources and lesson plans for Primary Maths",
    );
    expect(result.twitter?.title).toBe(
      "Free Primary Maths Lesson & Curriculum Resources",
    );
    expect(result.twitter?.description).toContain(
      "Get fully sequenced teaching resources and lesson plans for Primary Maths",
    );
  });

  it("includes query parameters in canonical url", async () => {
    const mockSubjectData = {
      subjects: filterValidCurriculumPhaseOptions(
        curriculumPhaseOptionsFixture(),
      ),
      subjectPhaseKeystageSlugs: {
        subjectSlug: "maths",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      },
    };

    jest.mocked(getSubjectPhaseOptions).mockResolvedValue(mockSubjectData);

    const queryParams = {
      years: "4",
      keystages: "ks2",
    };

    const result = await generateMetadata({
      params: Promise.resolve({
        slug: "maths-primary",
        tab: "units",
      }),
      searchParams: Promise.resolve(queryParams),
    });

    expect(result.alternates?.canonical).toBe(
      new URL(
        resolveOakHref({
          page: "teacher-programme",
          subjectPhaseSlug: "maths-primary",
          tab: "units",
          query: queryParams,
        }),
        getBrowserConfig("seoAppUrl"),
      ).toString(),
    );
  });

  it("handles errors gracefully and returns empty object", async () => {
    jest
      .mocked(getSubjectPhaseOptions)
      .mockRejectedValue(new Error("Test error"));

    const result = await generateMetadata({
      params: Promise.resolve({
        slug: "maths-primary",
        tab: "units",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result).toEqual({});
  });

  it("includes noindex robots metadata for the download tab", async () => {
    const mockSubjectData = {
      subjects: filterValidCurriculumPhaseOptions(
        curriculumPhaseOptionsFixture(),
      ),
      subjectPhaseKeystageSlugs: {
        subjectSlug: "computing",
        phaseSlug: "secondary",
        examboardSlug: "aqa",
        ks4OptionSlug: null,
      },
    };
    jest.mocked(getSubjectPhaseOptions).mockResolvedValue(mockSubjectData);

    const result = await generateMetadata({
      params: Promise.resolve({
        slug: "computing-secondary-ocr",
        tab: "download",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result.robots).toEqual({
      index: false,
      follow: true,
    });
  });

  it("does not include noindex robots metadata for non-download tabs", async () => {
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
      examboardFilterDimensions: {},
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
        slug: "maths-primary",
        tab: "units",
      }),
      searchParams: Promise.resolve({}),
    });

    expect(result.robots).toBeUndefined();
  });

  describe("search param validation", () => {
    const mockSubjectData = {
      subjects: filterValidCurriculumPhaseOptions(
        curriculumPhaseOptionsFixture(),
      ),
      subjectPhaseKeystageSlugs: {
        subjectSlug: "maths",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      },
    };

    beforeEach(() => {
      jest.mocked(getSubjectPhaseOptions).mockResolvedValue(mockSubjectData);
    });

    it("sanitizes invalid years param in meta title", async () => {
      const result = await generateMetadata({
        params: Promise.resolve({ slug: "maths-primary", tab: "units" }),
        searchParams: Promise.resolve({ years: "invalid" }),
      });

      expect(result.title).toBe(
        "Free Secondary Maths Lesson & Curriculum Resources",
      );
    });

    it("sanitizes invalid keystages param in meta title", async () => {
      const result = await generateMetadata({
        params: Promise.resolve({ slug: "maths-primary", tab: "units" }),
        searchParams: Promise.resolve({ keystages: "bad-value" }),
      });

      expect(result.title).toBe(
        "Free Secondary Maths Lesson & Curriculum Resources",
      );
    });

    it("preserves other search params while validating years and keystages", async () => {
      const result = await generateMetadata({
        params: Promise.resolve({ slug: "maths-primary", tab: "units" }),
        searchParams: Promise.resolve({
          years: "7",
          tiers: "foundation",
        }),
      });

      expect(result.title).toBe(
        "Free Y7 Maths Foundation Lesson & Curriculum Resources",
      );
    });
  });
});
