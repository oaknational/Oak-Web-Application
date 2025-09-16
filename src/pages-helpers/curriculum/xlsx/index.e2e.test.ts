import JSZip from "jszip";

import { zipToSimpleObject } from "../docx/zip";

import xlsxNationalCurriculum from ".";

import { createUnit } from "@/fixtures/curriculum/unit";
import { createUnitOption } from "@/fixtures/curriculum/unitOption";
import type { Unit } from "@/utils/curriculum/types";

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

  test("ungrouped (non-pathways) - KS3 English", async () => {
    const units = [
      createUnit({
        year: "9",
        subject_slug: "english",
        slug: "unit-a",
        features: { national_curriculum_content: true },
      }),
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
        features: { national_curriculum_content: true },
      }),
      createUnit({
        year: "10",
        subject_slug: "computing",
        slug: "cs-unit-a",
        examboard: "AQA",
        features: { national_curriculum_content: true },
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
        features: { national_curriculum_content: true },
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
        features: { national_curriculum_content: true },
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
        features: { national_curriculum_content: true },
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
      createUnit({
        year: "9",
        subject_slug: "history",
        slug: "hist-a",
        features: { national_curriculum_content: true },
      }),
      createUnit({
        year: "10",
        subject_slug: "history",
        slug: "hist-b",
        features: { national_curriculum_content: true },
      }),
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
        features: { national_curriculum_content: true },
      }),
      createUnit({
        year: "10",
        subject_slug: "geography",
        slug: "geog-b",
        features: { national_curriculum_content: true },
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
        features: { national_curriculum_content: true },
      }),
      createUnit({
        year: "10",
        subject_slug: "religious-studies",
        slug: "re-b",
        features: { national_curriculum_content: true },
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
        features: { national_curriculum_content: true },
      }),
      createUnit({
        year: "10",
        subject_slug: "maths",
        slug: "maths-a",
        tier: "Higher",
        tier_slug: "higher",
        features: { national_curriculum_content: true },
      }),
      createUnit({
        year: "11",
        subject_slug: "maths",
        slug: "maths-b",
        tier: "Higher",
        tier_slug: "higher",
        features: { national_curriculum_content: true },
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
        features: { national_curriculum_content: true },
      }),
      createUnit({
        year: "10",
        subject_slug: "chemistry",
        slug: "chem-a",
        tier: "Foundation",
        tier_slug: "foundation",
        features: { national_curriculum_content: true },
      }),
      createUnit({
        year: "11",
        subject_slug: "chemistry",
        slug: "chem-b",
        tier: "Foundation",
        tier_slug: "foundation",
        features: { national_curriculum_content: true },
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
        features: { national_curriculum_content: true },
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
});

describe("xlsxNationalCurriculum links and filtering e2e", () => {
  type XlsxInput = Parameters<typeof xlsxNationalCurriculum>[0];
  type XlsxSlugs = Parameters<typeof xlsxNationalCurriculum>[1];

  async function buildAndExtract(
    units: Unit[],
    slugs: XlsxSlugs = { subjectSlug: "maths", phaseSlug: "primary" } as const,
  ) {
    const data = { units } as XlsxInput;
    const buffer = await xlsxNationalCurriculum(data, slugs);
    const zip = await JSZip.loadAsync(Buffer.from(buffer));
    return (await zipToSimpleObject(zip)) as Record<string, string>;
  }

  test("filters years to only those where all units have NC content", async () => {
    const units = [
      createUnit({
        year: "1",
        subject_slug: "maths",
        slug: "m-1",
        features: { national_curriculum_content: true },
      }),
      createUnit({
        year: "2",
        subject_slug: "maths",
        slug: "m-2",
        features: { national_curriculum_content: false },
      }),
    ];
    const simple = await buildAndExtract(units, {
      subjectSlug: "maths",
      phaseSlug: "primary",
    } as const);

    const worksheetXmlKeys = Object.keys(simple).filter((k) => {
      if (!k.startsWith("xl/worksheets/sheet") || !k.endsWith(".xml"))
        return false;
      const m = k.match(/sheet(\d+)\.xml$/);
      const num = m && m[1] ? parseInt(m[1], 10) : 0;
      return num >= 10;
    });

    expect(worksheetXmlKeys.length).toBe(1);
    expect(worksheetXmlKeys[0]).toBe("xl/worksheets/sheet10.xml");

    const rels = simple["xl/worksheets/_rels/sheet10.xml.rels"];
    expect(rels).toBeTruthy();
    expect(rels).toContain("/units/m-1");
    expect(rels).not.toContain("/units/m-2");
  });

  test("generates hyperlink relationships for unit and each unit_option", async () => {
    const units = [
      createUnit({
        year: "1",
        subject_slug: "maths",
        slug: "m-1",
        features: { national_curriculum_content: true },
        unit_options: [
          createUnitOption({ slug: "m-1-alt-a" }),
          createUnitOption({ slug: "m-1-alt-b" }),
        ],
      }),
    ];
    const simple = await buildAndExtract(units, {
      subjectSlug: "maths",
      phaseSlug: "primary",
    } as const);

    const rels = simple["xl/worksheets/_rels/sheet10.xml.rels"];
    expect(rels).toBeTruthy();
    expect(rels).toContain("/units/m-1");
    expect(rels).toContain("/units/m-1-alt-a");
    expect(rels).toContain("/units/m-1-alt-b");
    expect(rels).toContain("/curriculum/maths-primary/units/m-1");
  });
});
