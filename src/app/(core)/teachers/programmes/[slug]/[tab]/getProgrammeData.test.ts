/**
 * @jest-environment node
 */

import {
  getProgrammeData,
  getSubjectOverride,
  getSubjectPhaseOptions,
} from "./getProgrammeData";

import { createUnit } from "@/fixtures/curriculum/unit";
import curriculumPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPhaseOptions.fixture";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumPhaseOptions: jest.fn(),
    curriculumOverview: jest.fn(),
    curriculumSequence: jest.fn(),
    curriculumSequenceSlugs: jest.fn(),
  },
}));

jest.mock("@/node-lib/cache", () => ({
  cacheData: <Args extends unknown[], Result>(
    fn: (...args: Args) => Promise<Result>,
  ) => fn,
  cacheCurriculumApiData: <Args extends unknown[], Result>(
    fn: (...args: Args) => Promise<Result>,
  ) => fn,
}));

const mockCurriculumApi = jest.mocked(curriculumApi2023);

const defaultSubjects = () =>
  filterValidCurriculumPhaseOptions(curriculumPhaseOptionsFixture());

describe("getProgrammeData", () => {
  const setupDefaultMocks = () => {
    mockCurriculumApi.curriculumOverview.mockResolvedValue(
      curriculumOverviewMVFixture({
        subjectTitle: "Maths",
        phaseTitle: "Primary",
      }),
    );
    mockCurriculumApi.curriculumSequence.mockResolvedValue({
      units: [
        createUnit({
          slug: "unit-1",
          title: "Unit 1",
          order: 1,
          examboard: null,
          examboard_slug: null,
          year: "5",
          subject_slug: "maths",
          phase_slug: "primary",
        }),
        createUnit({
          slug: "unit-2",
          title: "Unit 2",
          order: 2,
          examboard: null,
          examboard_slug: null,
          year: "5",
          subject_slug: "maths",
          phase_slug: "primary",
        }),
      ],
    });
    mockCurriculumApi.curriculumPhaseOptions.mockResolvedValue(
      curriculumPhaseOptionsFixture(),
    );
    mockCurriculumApi.curriculumSequenceSlugs.mockResolvedValue([]);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  describe("with valid subject phase slug", () => {
    it("should return programme data with sorted units", async () => {
      const programmeResults = await getProgrammeData(
        "maths-primary",
        defaultSubjects(),
      );
      const subjectResults = await getSubjectPhaseOptions("maths-primary");

      expect(programmeResults).not.toBeNull();
      expect(programmeResults?.programmeUnitsData.subjectTitle).toBe("Maths");
      expect(programmeResults?.curriculumUnitsData.units).toHaveLength(2);
      expect(subjectResults?.subjectPhaseKeystageSlugs.subjectSlug).toBe(
        "maths",
      );
      expect(subjectResults?.subjectPhaseKeystageSlugs.phaseSlug).toBe(
        "primary",
      );
    });

    it("should call curriculumApi methods with correct parameters", async () => {
      await getProgrammeData("maths-primary", defaultSubjects());

      expect(mockCurriculumApi.curriculumOverview).toHaveBeenCalledWith({
        subjectSlug: "maths",
        phaseSlug: "primary",
        includeNonCurriculum: true,
      });
      expect(mockCurriculumApi.curriculumSequence).toHaveBeenCalledWith({
        subjectSlug: "maths",
        phaseSlug: "primary",
        ks4OptionSlug: null,
        includeNonCurriculum: true,
        excludeUnitsWithNoPublishedLessons: true,
        excludeCoreUnits: true,
      });
    });

    it("should sort units with examboard versions first, then by order", async () => {
      mockCurriculumApi.curriculumSequence.mockResolvedValue({
        units: [
          createUnit({
            slug: "unit-regular-2",
            title: "Regular Unit 2",
            order: 2,
            examboard: null,
            examboard_slug: null,
            year: "5",
            subject_slug: "maths",
            phase_slug: "primary",
          }),
          createUnit({
            slug: "unit-examboard-1",
            title: "Examboard Unit 1",
            order: 1,
            examboard: "AQA",
            examboard_slug: "aqa",
            year: "5",
            subject_slug: "maths",
            phase_slug: "primary",
          }),
          createUnit({
            slug: "unit-regular-1",
            title: "Regular Unit 1",
            order: 1,
            examboard: null,
            examboard_slug: null,
            year: "5",
            subject_slug: "maths",
            phase_slug: "primary",
          }),
          createUnit({
            slug: "unit-examboard-2",
            title: "Examboard Unit 2",
            order: 2,
            examboard: "Edexcel",
            examboard_slug: "edexcel",
            year: "5",
            subject_slug: "maths",
            phase_slug: "primary",
          }),
        ],
      });

      const result = await getProgrammeData("maths-primary", defaultSubjects());

      expect(result?.curriculumUnitsData.units).toHaveLength(4);
      // Note: The sorting logic sorts by examboard first, then by order globally
      // So units are sorted: examboard-1 (order 1), regular-1 (order 1), examboard-2 (order 2), regular-2 (order 2)
      expect(result?.curriculumUnitsData.units[0]!.slug).toBe(
        "unit-examboard-1",
      );
      expect(result?.curriculumUnitsData.units[0]!.examboard).toBeTruthy();
      expect(result?.curriculumUnitsData.units[1]!.slug).toBe("unit-regular-1");
      expect(result?.curriculumUnitsData.units[1]!.examboard).toBeFalsy();
      expect(result?.curriculumUnitsData.units[2]!.slug).toBe(
        "unit-examboard-2",
      );
      expect(result?.curriculumUnitsData.units[2]!.examboard).toBeTruthy();
      expect(result?.curriculumUnitsData.units[3]!.slug).toBe("unit-regular-2");
      expect(result?.curriculumUnitsData.units[3]!.examboard).toBeFalsy();
    });

    it("should filter curriculum phase options", async () => {
      mockCurriculumApi.curriculumPhaseOptions.mockResolvedValue([
        {
          title: "English",
          slug: "english",
          phases: [{ title: "Primary", slug: "primary" }],
          ks4_options: [
            { title: "AQA", slug: "aqa" },
            { title: "GCSE", slug: "gcse" },
            { title: "Edexcel", slug: "edexcel" },
          ],
          keystages: [],
        },
      ]);

      const subjectResults = await getSubjectPhaseOptions("maths-primary");

      expect(subjectResults?.subjects).toHaveLength(1);
      const englishSubject = subjectResults?.subjects[0];
      expect(englishSubject?.ks4_options).toHaveLength(2);
      // GCSE should be removed if it's not first and there are examboard options
      const gcseOption = englishSubject?.ks4_options?.find(
        (opt) => opt.slug === "gcse",
      );
      expect(gcseOption).toBeUndefined();
    });

    it("should handle secondary phase slug", async () => {
      mockCurriculumApi.curriculumOverview.mockResolvedValue(
        curriculumOverviewMVFixture({
          subjectTitle: "Science",
          phaseTitle: "Secondary",
        }),
      );
      mockCurriculumApi.curriculumSequence.mockResolvedValue({
        units: [
          createUnit({
            slug: "science-unit-1",
            title: "Science Unit 1",
            order: 1,
            year: "7",
            subject_slug: "science",
            phase_slug: "secondary",
          }),
        ],
      });

      const result = await getProgrammeData(
        "science-secondary",
        defaultSubjects(),
      );
      const subjectResults = await getSubjectPhaseOptions("science-secondary");

      expect(result).not.toBeNull();
      expect(result?.programmeUnitsData.subjectTitle).toBe("Science");
      expect(result?.programmeUnitsData.phaseTitle).toBe("Secondary");
      expect(subjectResults?.subjectPhaseKeystageSlugs.subjectSlug).toBe(
        "science",
      );
      expect(subjectResults?.subjectPhaseKeystageSlugs.phaseSlug).toBe(
        "secondary",
      );
    });

    it("should not fetch examboard filter dimensions for primary phase", async () => {
      const result = await getProgrammeData("maths-primary", defaultSubjects());

      expect(result?.examboardFilterDimensions).toEqual({});
      expect(mockCurriculumApi.curriculumSequenceSlugs).not.toHaveBeenCalled();
      expect(mockCurriculumApi.curriculumPhaseOptions).not.toHaveBeenCalled();
    });

    it("should fetch examboard filter dimensions in parallel for secondary phase", async () => {
      const slugUnits = [
        {
          examboard_slug: "aqa",
          tier_slug: "foundation",
          pathway_slug: null,
          subject_slug: "english",
          subject_parent_slug: null,
        },
      ];
      const subjects = [
        {
          title: "English",
          slug: "english",
          phases: [{ title: "Secondary", slug: "secondary" }],
          ks4_options: [
            { title: "AQA", slug: "aqa" },
            { title: "Edexcel", slug: "edexcel" },
          ],
          keystages: [],
        },
      ];
      mockCurriculumApi.curriculumSequenceSlugs.mockResolvedValue(slugUnits);

      const result = await getProgrammeData("english-secondary-aqa", subjects);

      expect(result?.examboardFilterDimensions).toEqual({
        aqa: {
          tierSlugs: ["foundation"],
          pathwaySlugs: [],
          childSubjectSlugs: [],
        },
        edexcel: {
          tierSlugs: [],
          pathwaySlugs: [],
          childSubjectSlugs: [],
        },
      });
      expect(mockCurriculumApi.curriculumSequenceSlugs).toHaveBeenCalledWith({
        subjectSlug: "english",
        phaseSlug: "secondary",
        includeNonCurriculum: true,
      });
    });

    it("should handle ks4 option slug", async () => {
      const result = await getProgrammeData(
        "maths-secondary-aqa",
        defaultSubjects(),
      );
      const subjectResults = await getSubjectPhaseOptions(
        "maths-secondary-aqa",
      );

      expect(result).not.toBeNull();
      expect(subjectResults?.subjectPhaseKeystageSlugs.ks4OptionSlug).toBe(
        "aqa",
      );
      expect(mockCurriculumApi.curriculumSequence).toHaveBeenCalledWith({
        subjectSlug: "maths",
        phaseSlug: "secondary",
        ks4OptionSlug: "aqa",
        includeNonCurriculum: true,
        excludeUnitsWithNoPublishedLessons: true,
        excludeCoreUnits: true,
      });
    });

    it("should remove core ks4 option when excludeCoreUnits is true", async () => {
      mockCurriculumApi.curriculumPhaseOptions.mockResolvedValue([
        {
          title: "Maths",
          slug: "maths",
          phases: [{ title: "Secondary", slug: "secondary" }],
          ks4_options: [
            { title: "AQA", slug: "aqa" },
            { title: "Core", slug: "core" },
          ],
          keystages: [],
        },
      ]);

      const subjectResults = await getSubjectPhaseOptions(
        "maths-secondary-aqa",
      );
      expect(subjectResults?.subjects[0]?.ks4_options).toEqual([
        { title: "AQA", slug: "aqa" },
      ]);
    });

    it("should not exclude core units when ks4 option slug is core", async () => {
      mockCurriculumApi.curriculumPhaseOptions.mockResolvedValue([
        {
          title: "Maths",
          slug: "maths",
          phases: [{ title: "Secondary", slug: "secondary" }],
          ks4_options: [
            { title: "GCSE", slug: "gcse" },
            { title: "Core", slug: "core" },
          ],
          keystages: [],
        },
      ]);

      const subjectResults = await getSubjectPhaseOptions(
        "maths-secondary-core",
      );
      await getProgrammeData("maths-secondary-core", subjectResults!.subjects);
      expect(mockCurriculumApi.curriculumSequence).toHaveBeenCalledWith({
        subjectSlug: "maths",
        phaseSlug: "secondary",
        ks4OptionSlug: "core",
        includeNonCurriculum: true,
        excludeUnitsWithNoPublishedLessons: true,
        excludeCoreUnits: false,
      });
      expect(subjectResults?.subjects[0]?.ks4_options).toEqual([
        { title: "GCSE", slug: "gcse" },
        { title: "Core", slug: "core" },
      ]);
    });
  });

  describe("with invalid subject phase slug", () => {
    it("should return null for invalid slug", async () => {
      const result = await getProgrammeData("invalid-slug", []);

      expect(result).toBeNull();
      expect(mockCurriculumApi.curriculumOverview).not.toHaveBeenCalled();
      expect(mockCurriculumApi.curriculumSequence).not.toHaveBeenCalled();
    });

    it("should return null for empty slug", async () => {
      const result = await getProgrammeData("", []);

      expect(result).toBeNull();
    });

    it("should return null for malformed slug", async () => {
      // Use a slug that doesn't have enough parts to parse (needs at least subject-phase)
      const result = await getProgrammeData("maths", []);

      expect(result).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should propagate errors from curriculumOverview", async () => {
      mockCurriculumApi.curriculumOverview.mockRejectedValue(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      await expect(
        getProgrammeData("maths-primary", defaultSubjects()),
      ).rejects.toThrow("Resource not found");
    });

    it("should propagate errors from curriculumSequence", async () => {
      mockCurriculumApi.curriculumSequence.mockRejectedValue(
        new OakError({ code: "curriculum-api/not-found" }),
      );

      await expect(
        getProgrammeData("maths-primary", defaultSubjects()),
      ).rejects.toThrow("Resource not found");
    });
  });
});

describe("getSubjectOverride", () => {
  const subjectOverrideAction = {
    programme_field_overrides: {
      subject: "Mathematics",
    },
  };
  const units = [
    createUnit({
      slug: "unit-1",
      title: "Unit 1",
      order: 1,
      examboard: null,
      examboard_slug: null,
      year: "10",
      subject_slug: "maths",
      phase_slug: "secondary",
    }),
  ];
  const unitsWithOverride = units.map((u) => ({
    ...u,
    actions: subjectOverrideAction,
  }));
  const mockFilters = {
    years: ["7", "8", "9", "10", "11"],
    tiers: [],
    childSubjects: [],
    pathways: [],
    subjectCategories: [],
    threads: [],
    keystages: [],
  };
  it("returns no override", () => {
    const res = getSubjectOverride(units, mockFilters);
    expect(res).toBeUndefined();
  });
  it("returns an override for a valid year", () => {
    const res = getSubjectOverride(unitsWithOverride, mockFilters);
    expect(res).toEqual("Mathematics");
  });
  it("returns an override scoped to the keystage", () => {
    const res = getSubjectOverride(
      [
        ...unitsWithOverride,
        createUnit({
          slug: "unit-1",
          title: "Unit 1",
          order: 1,
          examboard: null,
          examboard_slug: null,
          year: "7",
          subject_slug: "maths",
          phase_slug: "secondary",
          actions: {
            programme_field_overrides: {
              subject: "KS3 override",
            },
          },
        }),
      ],
      {
        ...mockFilters,
        keystages: ["ks4"],
      },
    );
    expect(res).toEqual("Mathematics");
  });
  it("does not return an override when not valid for the keystage year", () => {
    const res = getSubjectOverride(unitsWithOverride, {
      ...mockFilters,
      keystages: ["ks3"],
    });
    expect(res).toBeUndefined();
  });
  it("does not return an override when there are multiple overrides in the data", () => {
    const res = getSubjectOverride(
      [
        ...unitsWithOverride,
        createUnit({
          slug: "unit-1",
          title: "Unit 1",
          order: 1,
          examboard: null,
          examboard_slug: null,
          year: "10",
          subject_slug: "maths",
          phase_slug: "secondary",
          actions: {
            programme_field_overrides: {
              subject: "Duplicate Override",
            },
          },
        }),
      ],
      mockFilters,
    );
    expect(res).toBeUndefined();
  });
});
