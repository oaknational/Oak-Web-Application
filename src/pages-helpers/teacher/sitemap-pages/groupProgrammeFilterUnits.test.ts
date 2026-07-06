import {
  createKeystageOptionsFromUnits,
  createYearOptionsFromUnits,
  filterUnitsForProgrammePage,
  getProgrammeFilterVariants,
  getSitemapKeystageVariants,
  getSitemapYearVariants,
  mapKs4OptionSlugs,
  resolveUnitYear,
} from "./groupProgrammeFilterUnits";

import curriculumPhaseOptionsFixture from "@/node-lib/curriculum-api-2023/fixtures/curriculumPhaseOptions.fixture";
import { teachersSitemapDataFixtureCamelCase } from "@/node-lib/curriculum-api-2023/fixtures/teachersSiteMap.fixture";
import type { TeachersSitemapProgrammeFilterUnit } from "@/node-lib/curriculum-api-2023/queries/teachersSitemap/teacherSitemap.schema";

describe("groupProgrammeFilterUnits", () => {
  describe("mapKs4OptionSlugs", () => {
    it("includes pathway slugs for secondary subjects", () => {
      const subjects = curriculumPhaseOptionsFixture();
      const citizenship = subjects.find((s) => s.slug === "citizenship")!;

      expect(mapKs4OptionSlugs(citizenship, citizenship.phases[0]!)).toEqual([
        {
          subjectPhaseSlug: "citizenship-secondary-gcse",
          ks4OptionSlug: "gcse",
        },
      ]);
    });

    it("includes exam board slugs for secondary subjects", () => {
      const subjects = curriculumPhaseOptionsFixture();
      const english = subjects.find((s) => s.slug === "english")!;

      expect(mapKs4OptionSlugs(english, english.phases[1]!)).toEqual([
        {
          subjectPhaseSlug: "english-secondary-aqa",
          ks4OptionSlug: "aqa",
        },
        {
          subjectPhaseSlug: "english-secondary-edexcel",
          ks4OptionSlug: "edexcel",
        },
      ]);
    });
  });

  describe("filterUnitsForProgrammePage", () => {
    it("filters units by subject, phase, and exam board", () => {
      const units = filterUnitsForProgrammePage(
        teachersSitemapDataFixtureCamelCase.programmeFilterUnits,
        "english",
        "secondary",
        "aqa",
      );

      expect(units).toHaveLength(2);
      expect(units.every((unit) => unit.examboardSlug === "aqa")).toBe(true);
    });

    it("filters units by pathway slug", () => {
      const units = filterUnitsForProgrammePage(
        teachersSitemapDataFixtureCamelCase.programmeFilterUnits,
        "citizenship",
        "secondary",
        "gcse",
      );

      expect(units).toHaveLength(1);
      expect(units[0]?.pathwaySlug).toBe("gcse");
    });
  });

  describe("resolveUnitYear", () => {
    it("uses programme_field_overrides.year_slug when present", () => {
      const unit: TeachersSitemapProgrammeFilterUnit = {
        subjectSlug: "rule-of-law",
        phaseSlug: "primary",
        examboardSlug: null,
        pathwaySlug: null,
        year: "3",
        keystageSlug: "ks2",
        subjectParentSlug: null,
        nonCurriculum: true,
        actions: {
          programme_field_overrides: { year_slug: "all-years" },
        },
        state: "published",
      };

      expect(resolveUnitYear(unit)).toBe("all-years");
    });
  });

  describe("getSitemapYearVariants", () => {
    it("returns no variants for a single year bucket", () => {
      expect(getSitemapYearVariants(["all-years"])).toEqual([]);
      expect(getSitemapYearVariants(["7"])).toEqual([]);
    });

    it("returns numeric years and all-years for mixed buckets", () => {
      expect(getSitemapYearVariants(["3", "all-years"])).toEqual([
        "3",
        "all-years",
      ]);
      expect(getSitemapYearVariants(["3", "4", "all-years"])).toEqual([
        "3",
        "4",
        "all-years",
      ]);
    });

    it("returns numeric years only when all-years is absent", () => {
      expect(getSitemapYearVariants(["7", "8", "9"])).toEqual(["7", "8", "9"]);
    });
  });

  describe("getSitemapKeystageVariants", () => {
    it("returns no variants for a single keystage bucket", () => {
      expect(getSitemapKeystageVariants(["ks2"], ["7", "8"])).toEqual([]);
    });

    it("returns no variants when only one year bucket exists", () => {
      expect(getSitemapKeystageVariants(["ks1", "ks2"], ["all-years"])).toEqual(
        [],
      );
      expect(getSitemapKeystageVariants(["ks3", "ks4"], ["7"])).toEqual([]);
    });

    it("returns keystage variants when multiple keystages and year buckets exist", () => {
      expect(getSitemapKeystageVariants(["ks3", "ks4"], ["7", "10"])).toEqual([
        "ks3",
        "ks4",
      ]);
    });
  });

  describe("getProgrammeFilterVariants", () => {
    it("derives keystage and year variants from bulk units", () => {
      const variants = getProgrammeFilterVariants(
        curriculumPhaseOptionsFixture(),
        teachersSitemapDataFixtureCamelCase.programmeFilterUnits,
      );

      const englishAqa = variants.find(
        (variant) => variant.subjectPhaseSlug === "english-secondary-aqa",
      );

      expect(englishAqa?.keystages).toEqual(
        expect.arrayContaining(["ks3", "ks4"]),
      );
      expect(englishAqa?.years).toEqual(expect.arrayContaining(["7", "10"]));
    });

    it("omits variants when all units collapse to a single year bucket (cross-keystage)", () => {
      const subjects = [
        {
          title: "Rule of law",
          slug: "rule-of-law",
          phases: [{ title: "Primary", slug: "primary" }],
          ks4_options: [],
          keystages: [{ title: "KS2", slug: "ks2" }],
          non_curriculum: true,
        },
      ];
      const units =
        teachersSitemapDataFixtureCamelCase.programmeFilterUnits.filter(
          (unit) => unit.subjectSlug === "rule-of-law",
        );

      const variants = getProgrammeFilterVariants(subjects, units);
      const ruleOfLaw = variants.find(
        (variant) => variant.subjectPhaseSlug === "rule-of-law-primary",
      );

      expect(ruleOfLaw?.years).toEqual([]);
      expect(ruleOfLaw?.keystages).toEqual([]);
    });

    it("includes all-years variant when mixed with numeric years", () => {
      const subjects = [
        {
          title: "Physical education",
          slug: "physical-education",
          phases: [{ title: "Primary", slug: "primary" }],
          ks4_options: [],
          keystages: [{ title: "KS2", slug: "ks2" }],
        },
      ];
      const units =
        teachersSitemapDataFixtureCamelCase.programmeFilterUnits.filter(
          (unit) => unit.subjectSlug === "physical-education",
        );

      const variants = getProgrammeFilterVariants(subjects, units);
      const pe = variants.find(
        (variant) => variant.subjectPhaseSlug === "physical-education-primary",
      );

      expect(pe?.years).toEqual(expect.arrayContaining(["3", "all-years"]));
    });

    it("excludes EYFS keystage variants", () => {
      const units: TeachersSitemapProgrammeFilterUnit[] = [
        {
          subjectSlug: "maths",
          phaseSlug: "foundation",
          examboardSlug: null,
          pathwaySlug: null,
          year: "r",
          keystageSlug: "early-years-foundation-stage",
          subjectParentSlug: null,
          nonCurriculum: false,
          state: "published",
        },
      ];
      const subjects = [
        {
          title: "Maths",
          slug: "maths",
          phases: [{ title: "Foundation", slug: "foundation" }],
          ks4_options: [],
          keystages: [{ title: "EYFS", slug: "early-years-foundation-stage" }],
        },
      ];

      const variants = getProgrammeFilterVariants(subjects, units);

      expect(variants[0]?.keystages).toEqual([]);
    });

    it("returns no variants when no units match a programme page", () => {
      const variants = getProgrammeFilterVariants(
        curriculumPhaseOptionsFixture(),
        [],
      );

      expect(variants).toEqual([]);
    });
  });

  describe("createYearOptionsFromUnits and createKeystageOptionsFromUnits", () => {
    it("deduplicates and sorts year buckets", () => {
      const units =
        teachersSitemapDataFixtureCamelCase.programmeFilterUnits.filter(
          (unit) =>
            unit.subjectSlug === "english" &&
            unit.phaseSlug === "secondary" &&
            unit.examboardSlug === "aqa",
        );

      expect(createYearOptionsFromUnits(units)).toEqual(["7", "10"]);
      expect(createKeystageOptionsFromUnits(units)).toEqual(["ks3", "ks4"]);
    });
  });
});
