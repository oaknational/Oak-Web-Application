/**
 * @jest-environment node
 */

import { getProgrammeData } from "./getProgrammeData";

import { CurriculumApi } from "@/node-lib/curriculum-api-2023";
import { createUnit } from "@/fixtures/curriculum/unit";
import curriculumPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPhaseOptions.fixture";
import { curriculumOverviewMVFixture } from "@/node-lib/curriculum-api-2023/fixtures/curriculumOverview.fixture";
import OakError from "@/errors/OakError";

describe("getProgrammeData", () => {
  const createMockCurriculumApi = (
    overrides?: Partial<CurriculumApi>,
  ): CurriculumApi => {
    return {
      curriculumOverview: jest.fn().mockResolvedValue(
        curriculumOverviewMVFixture({
          subjectTitle: "Maths",
          phaseTitle: "Primary",
        }),
      ),
      curriculumSequence: jest.fn().mockResolvedValue({
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
      }),
      curriculumPhaseOptions: jest
        .fn()
        .mockResolvedValue(curriculumPhaseOptionsFixture()),
      ...overrides,
    } as CurriculumApi;
  };

  describe("with valid subject phase slug", () => {
    it("should return programme data with sorted units", async () => {
      const mockApi = createMockCurriculumApi();
      const result = await getProgrammeData(mockApi, "maths-primary");

      expect(result).not.toBeNull();
      expect(result?.programmeUnitsData.subjectTitle).toBe("Maths");
      expect(result?.curriculumUnitsData.units).toHaveLength(2);
      expect(result?.curriculumPhaseOptions.tab).toBe("units");
      expect(result?.subjectPhaseKeystageSlugs.subjectSlug).toBe("maths");
      expect(result?.subjectPhaseKeystageSlugs.phaseSlug).toBe("primary");
    });

    it("should call curriculumApi methods with correct parameters", async () => {
      const mockApi = createMockCurriculumApi();
      await getProgrammeData(mockApi, "maths-primary");

      expect(mockApi.curriculumOverview).toHaveBeenCalledWith({
        subjectSlug: "maths",
        phaseSlug: "primary",
      });
      expect(mockApi.curriculumSequence).toHaveBeenCalledWith({
        subjectSlug: "maths",
        phaseSlug: "primary",
        ks4OptionSlug: null,
      });
      expect(mockApi.curriculumPhaseOptions).toHaveBeenCalled();
    });

    it("should sort units with examboard versions first, then by order", async () => {
      const mockApi = createMockCurriculumApi({
        curriculumSequence: jest.fn().mockResolvedValue({
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
        }),
      });

      const result = await getProgrammeData(mockApi, "maths-primary");

      expect(result!.curriculumUnitsData.units).toHaveLength(4);
      // Note: The sorting logic sorts by examboard first, then by order globally
      // So units are sorted: examboard-1 (order 1), regular-1 (order 1), examboard-2 (order 2), regular-2 (order 2)
      expect(result!.curriculumUnitsData.units[0]!.slug).toBe(
        "unit-examboard-1",
      );
      expect(result!.curriculumUnitsData.units[0]!.examboard).toBeTruthy();
      expect(result!.curriculumUnitsData.units[1]!.slug).toBe("unit-regular-1");
      expect(result!.curriculumUnitsData.units[1]!.examboard).toBeFalsy();
      expect(result!.curriculumUnitsData.units[2]!.slug).toBe(
        "unit-examboard-2",
      );
      expect(result!.curriculumUnitsData.units[2]!.examboard).toBeTruthy();
      expect(result!.curriculumUnitsData.units[3]!.slug).toBe("unit-regular-2");
      expect(result!.curriculumUnitsData.units[3]!.examboard).toBeFalsy();
    });

    it("should filter curriculum phase options", async () => {
      const mockApi = createMockCurriculumApi({
        curriculumPhaseOptions: jest.fn().mockResolvedValue([
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
        ]),
      });

      const result = await getProgrammeData(mockApi, "maths-primary");

      expect(result?.curriculumPhaseOptions.subjects).toHaveLength(1);
      const englishSubject = result?.curriculumPhaseOptions.subjects[0];
      expect(englishSubject?.ks4_options).toHaveLength(2);
      // GCSE should be removed if it's not first and there are examboard options
      const gcseOption = englishSubject?.ks4_options?.find(
        (opt) => opt.slug === "gcse",
      );
      expect(gcseOption).toBeUndefined();
    });

    it("should handle secondary phase slug", async () => {
      const mockApi = createMockCurriculumApi({
        curriculumOverview: jest.fn().mockResolvedValue(
          curriculumOverviewMVFixture({
            subjectTitle: "Science",
            phaseTitle: "Secondary",
          }),
        ),
        curriculumSequence: jest.fn().mockResolvedValue({
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
        }),
      });

      const result = await getProgrammeData(mockApi, "science-secondary");

      expect(result).not.toBeNull();
      expect(result!.programmeUnitsData.subjectTitle).toBe("Science");
      expect(result!.programmeUnitsData.phaseTitle).toBe("Secondary");
      expect(result!.subjectPhaseKeystageSlugs.subjectSlug).toBe("science");
      expect(result!.subjectPhaseKeystageSlugs.phaseSlug).toBe("secondary");
    });

    it("should handle ks4 option slug", async () => {
      const mockApi = createMockCurriculumApi();
      const result = await getProgrammeData(mockApi, "maths-secondary-aqa");

      expect(result).not.toBeNull();
      expect(result!.subjectPhaseKeystageSlugs.ks4OptionSlug).toBe("aqa");
      expect(mockApi.curriculumSequence).toHaveBeenCalledWith({
        subjectSlug: "maths",
        phaseSlug: "secondary",
        ks4OptionSlug: "aqa",
      });
    });
  });

  describe("with invalid subject phase slug", () => {
    it("should return null for invalid slug", async () => {
      const mockApi = createMockCurriculumApi();
      const result = await getProgrammeData(mockApi, "invalid-slug");

      expect(result).toBeNull();
      expect(mockApi.curriculumOverview).not.toHaveBeenCalled();
      expect(mockApi.curriculumSequence).not.toHaveBeenCalled();
    });

    it("should return null for empty slug", async () => {
      const mockApi = createMockCurriculumApi();
      const result = await getProgrammeData(mockApi, "");

      expect(result).toBeNull();
    });

    it("should return null for malformed slug", async () => {
      const mockApi = createMockCurriculumApi();
      // Use a slug that doesn't have enough parts to parse (needs at least subject-phase)
      const result = await getProgrammeData(mockApi, "maths");

      expect(result).toBeNull();
    });
  });

  describe("error handling", () => {
    it("should propagate errors from curriculumApi", async () => {
      const mockApi = createMockCurriculumApi({
        curriculumOverview: jest
          .fn()
          .mockRejectedValue(
            new OakError({ code: "curriculum-api/not-found" }),
          ),
      });

      await expect(getProgrammeData(mockApi, "maths-primary")).rejects.toThrow(
        "Resource not found",
      );
    });

    it("should propagate errors from curriculumSequence", async () => {
      const mockApi = createMockCurriculumApi({
        curriculumSequence: jest
          .fn()
          .mockRejectedValue(
            new OakError({ code: "curriculum-api/not-found" }),
          ),
      });

      await expect(getProgrammeData(mockApi, "maths-primary")).rejects.toThrow(
        "Resource not found",
      );
    });

    it("should propagate errors from curriculumPhaseOptions", async () => {
      const mockApi = createMockCurriculumApi({
        curriculumPhaseOptions: jest
          .fn()
          .mockRejectedValue(
            new OakError({ code: "curriculum-api/not-found" }),
          ),
      });

      await expect(getProgrammeData(mockApi, "maths-primary")).rejects.toThrow(
        "Resource not found",
      );
    });
  });
});
