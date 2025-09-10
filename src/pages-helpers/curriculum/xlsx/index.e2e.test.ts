import JSZip from "jszip";

import { zipToSimpleObject } from "../docx/zip";

import xlsxNationalCurriculum from ".";

import { createUnit } from "@/fixtures/curriculum/unit";
import { ENABLE_NC_XLSX_DOCUMENT } from "@/utils/curriculum/constants";

describe("xlsxNationalCurriculum e2e", () => {
  async function getWorksheetXml(
    units: ReturnType<typeof createUnit>[],
    slugs: Parameters<typeof xlsxNationalCurriculum>[1],
  ) {
    const data = {
      units,
    } as unknown as Parameters<typeof xlsxNationalCurriculum>[0];

    const buffer = await xlsxNationalCurriculum(data, slugs);
    const zip = await JSZip.loadAsync(Buffer.from(buffer));
    const simple = (await zipToSimpleObject(zip)) as Record<string, string>;

    const worksheets: Record<string, string> = {};
    Object.keys(simple).forEach((key) => {
      if (key.startsWith("xl/worksheets/sheet") && key.endsWith(".xml")) {
        const content = simple[key];
        if (content) {
          worksheets[key] = content;
        }
      }
    });
    return worksheets;
  }
  if (ENABLE_NC_XLSX_DOCUMENT) {
    test("ungrouped (non-pathways) - KS3 English", async () => {
      const units = [
        createUnit({ year: "9", subject_slug: "english", slug: "unit-a" }),
      ];
      const slugs = {
        subjectSlug: "english",
        phaseSlug: "secondary",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Year 9 English");
    });

    test("grouped (pathways) with exam board variance - KS4 Computing (GCSE, AQA)", async () => {
      const units = [
        createUnit({
          year: "9",
          subject_slug: "computing",
          slug: "cs-unit-ks3",
        }),
        createUnit({
          year: "10",
          subject_slug: "computing",
          slug: "cs-unit-a",
          examboard: "AQA",
        }),
      ];
      const slugs = {
        subjectSlug: "computing",
        phaseSlug: "secondary",
        ks4OptionSlug: "aqa",
      } as const;

      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      // KS3 (Y9) no override/no suffix
      expect(allXml).toContain("Year 9 Computing");
      expect(allXml).not.toContain("Year 9 Computer Science");
      expect(allXml).not.toContain("Year 9 Computing, GCSE");
      // KS4 (Y10) subject override + pathway suffix
      expect(allXml).toContain("Year 10 Computer Science, GCSE");
      expect(allXml).not.toContain("Year 10 Computing");
    });

    test("grouped (pathways) with exam board variance - KS4 PE (GCSE, Edexcel)", async () => {
      const units = [
        createUnit({
          year: "11",
          subject_slug: "physical-education",
          subject: "Physical education",
          examboard: "edexcel",
        }),
      ];
      const slugs = {
        subjectSlug: "physical-education",
        phaseSlug: "secondary",
        ks4OptionSlug: "edexcel",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Year 11 Physical education, GCSE");
    });

    test("pathways without exam board variance - KS4 Citizenship (GCSE)", async () => {
      const units = [
        createUnit({
          year: "10",
          subject_slug: "citizenship",
          slug: "cit-unit-a",
        }),
      ];
      const slugs = {
        subjectSlug: "citizenship",
        phaseSlug: "secondary",
        ks4OptionSlug: "gcse",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Year 10 Citizenship, GCSE");
    });

    test("KS4 Citizenship (Core)", async () => {
      const units = [
        createUnit({
          year: "10",
          subject_slug: "citizenship",
          slug: "cit-unit-a",
        }),
      ];
      const slugs = {
        subjectSlug: "citizenship",
        phaseSlug: "secondary",
        ks4OptionSlug: "core",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Year 10 Citizenship, Core");
    });

    test("year programmes split by exam board - KS4 History", async () => {
      const units = [
        createUnit({ year: "9", subject_slug: "history", slug: "hist-a" }),
        createUnit({ year: "10", subject_slug: "history", slug: "hist-b" }),
      ];
      const slugs = {
        subjectSlug: "history",
        phaseSlug: "secondary",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Year 9 History");
      expect(allXml).toContain("Year 10 History");
      expect(allXml).not.toContain("Year 9 History, GCSE");
      expect(allXml).not.toContain("Year 10 History, GCSE");
    });

    test("year programmes split by exam board - KS4 Geography", async () => {
      const units = [
        createUnit({
          year: "9",
          subject_slug: "geography",
          slug: "geog-a",
        }),
        createUnit({
          year: "10",
          subject_slug: "geography",
          slug: "geog-b",
        }),
      ];
      const slugs = {
        subjectSlug: "geography",
        phaseSlug: "secondary",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Year 9 Geography");
      expect(allXml).toContain("Year 10 Geography");
      expect(allXml).not.toContain("Year 9 Geography, GCSE");
      expect(allXml).not.toContain("Year 10 Geography, GCSE");
    });

    test("year programmes split by exam board - KS4 RE", async () => {
      const units = [
        createUnit({
          year: "9",
          subject_slug: "religious-studies",
          slug: "re-a",
        }),
        createUnit({
          year: "10",
          subject_slug: "religious-studies",
          slug: "re-b",
        }),
      ];
      const slugs = {
        subjectSlug: "religious-studies",
        phaseSlug: "secondary",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Year 9 Religious studies");
      expect(allXml).toContain("Year 10 Religious studies");
      expect(allXml).not.toContain("Year 9 Religious studies, GCSE");
      expect(allXml).not.toContain("Year 10 Religious studies, GCSE");
    });

    test("year programmes split by tier - KS4 Maths (GCSE, Higher)", async () => {
      const units = [
        createUnit({
          year: "9",
          subject_slug: "maths",
          slug: "maths-ks3",
          // No tier for KS3
        }),
        createUnit({
          year: "10",
          subject_slug: "maths",
          slug: "maths-a",
          tier: "Higher",
          tier_slug: "higher",
        }),
        createUnit({
          year: "11",
          subject_slug: "maths",
          slug: "maths-b",
          tier: "Higher",
          tier_slug: "higher",
        }),
      ];
      const slugs = {
        subjectSlug: "maths",
        phaseSlug: "secondary",
        ks4OptionSlug: "gcse",
        tierSlug: "higher",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Year 9 Maths");
      expect(allXml).toContain("Year 10 Maths, Higher");
      expect(allXml).toContain("Year 11 Maths, Higher");
      expect(allXml).not.toContain("Year 9 Maths, Higher");
    });

    test("year programmes split by tier and child subject - KS4 Science Chemistry (GCSE, Foundation)", async () => {
      const units = [
        createUnit({
          year: "9",
          subject_slug: "chemistry",
          slug: "chem-ks3",
          // No tier for KS3
        }),
        createUnit({
          year: "10",
          subject_slug: "chemistry",
          slug: "chem-a",
          tier: "Foundation",
          tier_slug: "foundation",
        }),
        createUnit({
          year: "11",
          subject_slug: "chemistry",
          slug: "chem-b",
          tier: "Foundation",
          tier_slug: "foundation",
        }),
      ];
      const slugs = {
        subjectSlug: "science",
        phaseSlug: "secondary",
        ks4OptionSlug: "aqa",
        tierSlug: "foundation",
        childSubjectSlug: "chemistry",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Year 9 Chemistry");
      expect(allXml).toContain("Year 10 Chemistry, Foundation");
      expect(allXml).toContain("Year 11 Chemistry, Foundation");
      expect(allXml).not.toContain("Year 9 Chemistry, Foundation");
    });

    test("Swimming (all-years) - Primary PE grouped as all-years", async () => {
      const units = [
        createUnit({
          year: "3",
          subject_slug: "physical-education",
          subject: "Physical education",
          slug: "swim-a",
          actions: {
            programme_field_overrides: { year_slug: "all-years" },
            group_units_as: "Swimming and water safety",
          },
        }),
      ];
      const slugs = {
        subjectSlug: "physical-education",
        phaseSlug: "primary",
      } as const;
      const worksheets = await getWorksheetXml(units, slugs);
      const allXml = Object.values(worksheets).join("");
      expect(allXml).toContain("Swimming and water safety (all years)");
    });
  } else {
    test.todo("Test disabled");
  }
});
