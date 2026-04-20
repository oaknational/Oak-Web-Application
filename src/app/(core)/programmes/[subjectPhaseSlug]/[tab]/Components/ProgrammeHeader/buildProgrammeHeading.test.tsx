import "@testing-library/jest-dom";

import { buildProgrammeHeading } from "./buildProgrammeHeading";

import { createFilter } from "@/fixtures/curriculum/filters";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createUnit } from "@/fixtures/curriculum/unit";
import { CurriculumUnitsFormattedData } from "@/pages-helpers/curriculum/docx/tab-helpers";

describe("buildProgrammeHeading", () => {
  const createDataWithChildSubjects = (): CurriculumUnitsFormattedData => ({
    yearData: {
      "7": createYearData({
        units: [createUnit({ slug: "test1", year: "7" })],
        childSubjects: [
          createChildSubject({ subject_slug: "physics" }),
          createChildSubject({ subject_slug: "biology" }),
        ],
      }),
    },
    threadOptions: [],
    yearOptions: ["7"],
    keystages: [],
  });

  const createDataWithSubjectCategories = (): CurriculumUnitsFormattedData => ({
    yearData: {
      "7": createYearData({
        units: [createUnit({ slug: "test1", year: "7" })],
        subjectCategories: [
          createSubjectCategory({ id: 1, slug: "biology", title: "Biology" }),
        ],
      }),
    },
    threadOptions: [],
    yearOptions: ["7"],
    keystages: [],
  });

  const createDataWithBothDisplayed = (): CurriculumUnitsFormattedData => ({
    yearData: {
      "3": createYearData({
        units: [createUnit({ slug: "test-ks2", year: "3" })],
        subjectCategories: [
          createSubjectCategory({
            id: 1,
            slug: "chemistry",
            title: "Chemistry",
          }),
        ],
      }),
      "7": createYearData({
        units: [createUnit({ slug: "test-ks3", year: "7" })],
        childSubjects: [
          createChildSubject({ subject_slug: "chemistry" }),
          createChildSubject({ subject_slug: "physics" }),
        ],
      }),
    },
    threadOptions: [],
    yearOptions: ["3", "7"],
    keystages: [],
  });

  const createGroupedData = (
    schoolYear: "10" | "11",
  ): CurriculumUnitsFormattedData => ({
    yearData: {
      [schoolYear]: createYearData({
        units: [
          createUnit({
            slug: `test-${schoolYear}`,
            year: schoolYear,
            actions: {
              subject_category_actions: {
                group_by_subjectcategory: true,
              },
            },
          }),
        ],
        childSubjects: [
          createChildSubject({ subject_slug: "english" }),
          createChildSubject({ subject_slug: "drama" }),
        ],
        subjectCategories: [
          createSubjectCategory({
            id: 1,
            slug: "language",
            title: "Language",
          }),
        ],
      }),
    },
    threadOptions: [],
    yearOptions: [schoolYear],
    keystages: [],
  });

  const buildHeading = ({
    subjectTitle,
    data,
    filters,
    schoolYear,
    keyStage,
    examboardTitle,
    phaseTitle = "Secondary",
  }: {
    subjectTitle: string;
    data: CurriculumUnitsFormattedData;
    filters: ReturnType<typeof createFilter>;
    schoolYear?: string;
    keyStage?: string;
    examboardTitle?: string;
    phaseTitle?: string;
  }) =>
    buildProgrammeHeading({
      subjectTitle,
      data,
      filters,
      phaseTitle,
      schoolYear,
      keyStage,
      examboardTitle,
    });

  it("uses phase title when school year and key stage are absent", () => {
    const data = createDataWithChildSubjects();
    const filters = createFilter({ years: ["7"] });

    const result = buildHeading({
      subjectTitle: "Science",
      data,
      filters,
      phaseTitle: "Secondary",
    });

    expect(result).toBe("Science secondary");
  });

  it("uses key stage and examboard when keyStage is ks4", () => {
    const data = createDataWithChildSubjects();
    const filters = createFilter({ years: ["7"] });

    const result = buildHeading({
      subjectTitle: "Science",
      data,
      filters,
      keyStage: "ks4",
      examboardTitle: "AQA",
    });

    expect(result).toBe("Science KS4 AQA");
  });

  it("keeps existing year formatting for non-grouped year 9", () => {
    const data: CurriculumUnitsFormattedData = {
      yearData: {
        "9": createYearData({
          units: [createUnit({ slug: "test-9", year: "9" })],
        }),
      },
      threadOptions: [],
      yearOptions: ["9"],
      keystages: [],
    };
    const filters = createFilter({ years: ["9"] });

    const result = buildProgrammeHeading({
      subjectTitle: "Science",
      data,
      filters,
      phaseTitle: "Secondary",
      schoolYear: "9",
    });

    expect(result).toBe("Science year 9");
  });

  it("returns default subject title for subject category all", () => {
    const data = createDataWithSubjectCategories();
    const filters = createFilter({
      subjectCategories: ["all"],
      years: ["7"],
    });

    const result = buildHeading({
      subjectTitle: "Science",
      data,
      filters,
      schoolYear: "7",
    });

    expect(result).toBe("Science year 7");
  });

  it("returns child subject title when both filters are shown and equal", () => {
    const data = createDataWithBothDisplayed();
    const filters = createFilter({
      childSubjects: ["chemistry"],
      subjectCategories: ["chemistry"],
      years: ["3", "7"],
    });

    const result = buildHeading({
      subjectTitle: "Science",
      data,
      filters,
      schoolYear: "7",
    });

    expect(result).toBe("Chemistry year 7");
  });

  it("returns subject category title when it is the only shown subject filter", () => {
    const data = createDataWithSubjectCategories();
    const filters = createFilter({
      subjectCategories: ["biology"],
      years: ["7"],
    });

    const result = buildHeading({
      subjectTitle: "Science",
      data,
      filters,
      schoolYear: "7",
    });

    expect(result).toBe("Biology year 7");
  });

  it("returns child subject title when it is the only shown subject filter", () => {
    const data = createDataWithChildSubjects();
    const filters = createFilter({
      childSubjects: ["physics"],
      years: ["7"],
    });

    const result = buildHeading({
      subjectTitle: "Science",
      data,
      filters,
      schoolYear: "7",
    });

    expect(result).toBe("Physics year 7");
  });

  it("uses grouped ks4 order for year 10", () => {
    const data = createGroupedData("10");
    const filters = createFilter({
      childSubjects: ["english"],
      subjectCategories: ["language"],
      years: ["10"],
    });

    const result = buildProgrammeHeading({
      subjectTitle: "English",
      data,
      filters,
      phaseTitle: "Secondary",
      schoolYear: "10",
      examboardTitle: "AQA",
    });

    expect(result).toBe("English Year 10 Language AQA");
  });

  it("returns prefixed category title for grouped non-ks4 headings", () => {
    const data: CurriculumUnitsFormattedData = {
      yearData: {
        "8": createYearData({
          units: [
            createUnit({
              slug: "test-8",
              year: "8",
              actions: {
                subject_category_actions: {
                  group_by_subjectcategory: true,
                },
              },
            }),
          ],
          subjectCategories: [
            createSubjectCategory({
              id: 1,
              slug: "language",
              title: "Language",
            }),
          ],
        }),
      },
      threadOptions: [],
      yearOptions: ["8"],
      keystages: [],
    };
    const filters = createFilter({
      subjectCategories: ["language"],
      years: ["8"],
    });

    const result = buildHeading({
      subjectTitle: "English",
      data,
      filters,
      schoolYear: "8",
    });

    expect(result).toBe("English: Language year 8");
  });

  it("uses grouped ks4 order for year 11", () => {
    const data = createGroupedData("11");
    const filters = createFilter({
      childSubjects: ["english"],
      subjectCategories: ["language"],
      years: ["11"],
    });

    const result = buildProgrammeHeading({
      subjectTitle: "English",
      data,
      filters,
      phaseTitle: "Secondary",
      schoolYear: "11",
      examboardTitle: "AQA",
    });

    expect(result).toBe("English Year 11 Language AQA");
  });
});
