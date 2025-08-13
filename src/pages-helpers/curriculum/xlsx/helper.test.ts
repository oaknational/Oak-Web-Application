import diff from "microdiff";

import { generateEmptyXlsx } from "../docx/docx";
import { zipToSimpleObject } from "../docx/zip";

import {
  addOrUpdateSheet,
  createXmlIndexMap,
  generateSheetTitle,
  generateYearTitle,
  getFlatUnits,
  getSubjectOveride,
  ks4OptionSlugToPathway,
} from "./helper";

import { createUnit } from "@/fixtures/curriculum/unit";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createYearData } from "@/fixtures/curriculum/yearData";
import { isExamboardSlug } from "@/pages-helpers/pupil/options-pages/options-pages-helpers";

describe("createXmlIndexMap", () => {
  it("should return XML and mapped keys/indexes", () => {
    const { xml, indexMap } = createXmlIndexMap({
      foo: "test1",
      bar: "test2",
    });
    expect(xml).toEqual("test1\ntest2");
    expect(indexMap).toEqual({ foo: "0", bar: "1" });
  });
});

describe("getFlatUnits", () => {
  test("with subject-category grouping", () => {
    const actions = {
      subject_category_actions: {
        group_by_subjectcategory: true,
      },
    };
    const subcat1 = createSubjectCategory({ id: 1, slug: "subcat1" });
    const subcat2 = createSubjectCategory({ id: 2, slug: "subcat1" });
    const units = [
      createUnit({
        slug: "one",
        order: 1,
        subjectcategories: [subcat1],
        actions,
      }),
      createUnit({
        slug: "two",
        order: 5,
        subjectcategories: [subcat2],
        actions,
      }),
      createUnit({
        slug: "three",
        order: 7,
        subjectcategories: [subcat1],
        actions,
      }),
      createUnit({
        slug: "four",
        order: 9,
        subjectcategories: [subcat2],
        actions,
      }),
    ];
    const flatUnits = getFlatUnits(units);
    expect(flatUnits).toEqual([
      { ...units[0], subjectCategory: subcat1, order: 1 },
      { ...units[2], subjectCategory: subcat1, order: 2 },
      { ...units[1], subjectCategory: subcat2, order: 1 },
      { ...units[3], subjectCategory: subcat2, order: 2 },
    ]);
  });

  test("without subject-category grouping", () => {
    const actions = {};
    const subcat1 = createSubjectCategory({ slug: "subcat1" });
    const subcat2 = createSubjectCategory({ slug: "subcat1" });
    const units = [
      createUnit({
        slug: "one",
        order: 1,
        subjectcategories: [subcat1],
        actions,
      }),
      createUnit({
        slug: "two",
        order: 5,
        subjectcategories: [subcat2],
        actions,
      }),
      createUnit({
        slug: "three",
        order: 7,
        subjectcategories: [subcat1],
        actions,
      }),
      createUnit({
        slug: "four",
        order: 9,
        subjectcategories: [subcat2],
        actions,
      }),
    ];
    const flatUnits = getFlatUnits(units);
    expect(flatUnits).toEqual([
      { ...units[0], order: 1 },
      { ...units[1], order: 2 },
      { ...units[2], order: 3 },
      { ...units[3], order: 4 },
    ]);
  });
});

describe("addOrUpdateSheet", () => {
  test("add new", async () => {
    const zip = await generateEmptyXlsx();

    const initialState = await zipToSimpleObject(zip.getJsZip(), {
      convertXmlToJson: true,
      hashBuffers: true,
    });

    addOrUpdateSheet(zip, 2, "<worksheet></worksheet>");

    const newState = await zipToSimpleObject(zip.getJsZip(), {
      convertXmlToJson: true,
      hashBuffers: true,
    });

    const diffResults = diff(initialState, newState, {});
    expect(diffResults).toEqual([
      {
        path: ["xl/worksheets/sheet2.xml"],
        type: "CREATE",
        value: {
          declaration: {
            attributes: {
              encoding: "UTF-8",
              standalone: "yes",
              version: "1.0",
            },
          },
          elements: [
            {
              name: "worksheet",
              type: "element",
            },
          ],
        },
      },
    ]);
  });

  test("update existing", async () => {
    const zip = await generateEmptyXlsx();
    addOrUpdateSheet(zip, 1, `<worksheet></worksheet>`);

    const initialState = await zipToSimpleObject(zip.getJsZip(), {
      convertXmlToJson: true,
      hashBuffers: true,
    });

    addOrUpdateSheet(zip, 2, `<worksheet><dimension ref="A1" /></worksheet>`);

    const newState = await zipToSimpleObject(zip.getJsZip(), {
      convertXmlToJson: true,
      hashBuffers: true,
    });

    const diffResults = diff(initialState, newState, {});
    expect(diffResults).toEqual([
      {
        path: ["xl/worksheets/sheet2.xml"],
        type: "CREATE",
        value: {
          declaration: {
            attributes: {
              encoding: "UTF-8",
              standalone: "yes",
              version: "1.0",
            },
          },
          elements: [
            {
              elements: [
                {
                  attributes: {
                    ref: "A1",
                  },
                  name: "dimension",
                  type: "element",
                },
              ],
              name: "worksheet",
              type: "element",
            },
          ],
        },
      },
    ]);
  });
});

describe("generateYearTitle", () => {
  // For relevant KS4 worksheets, include pathway or tier in the sheet title in the NC document
  test("Year 10 Physical education, Core", () => {
    const formattedData = {
      yearData: {
        "10": createYearData({
          units: [
            createUnit({
              year: "10",
              subject: "Physical education",
              examboard: "Core",
            }),
          ],
        }),
      },
      threadOptions: [],
      yearOptions: ["10"],
    };
    const year = "10";
    const slugs = {
      subjectSlug: "physical-education",
      phaseSlug: "secondary",
      ks4OptionSlug: "core",
      keyStageSlug: undefined,
      tierSlug: undefined,
      childSubjectSlug: undefined,
    };
    const output = generateYearTitle(formattedData, year, slugs);
    expect(output).toEqual("Year 10 Physical education, Core");
  });

  test("Year 11 Physical education, GCSE", () => {
    const formattedData = {
      yearData: {
        "11": createYearData({
          units: [
            createUnit({
              year: "11",
              subject: "Physical education",
              examboard: "AQA",
            }),
          ],
        }),
      },
      threadOptions: [],
      yearOptions: ["11"],
    };
    const year = "11";
    const slugs = {
      subjectSlug: "physical-education",
      phaseSlug: "secondary",
      ks4OptionSlug: "gcse",
      keyStageSlug: undefined,
      tierSlug: undefined,
      childSubjectSlug: undefined,
    };
    const output = generateYearTitle(formattedData, year, slugs);
    expect(output).toEqual("Year 11 Physical education, GCSE");
  });

  test("Year 11 Chemistry, Foundation", () => {
    const formattedData = {
      yearData: {
        "11": createYearData({
          units: [
            createUnit({
              year: "11",
              subject_slug: "chemistry",
              examboard: "AQA",
              tier: "Foundation",
            }),
          ],
        }),
      },
      threadOptions: [],
      tiers: ["foundation"],
      yearOptions: ["11"],
    };
    const year = "11";
    const slugs = {
      subjectSlug: "science",
      phaseSlug: "secondary",
      ks4OptionSlug: "gcse",
      keyStageSlug: undefined,
      tierSlug: "foundation",
      childSubjectSlug: "chemistry",
    };
    const output = generateYearTitle(formattedData, year, slugs);
    expect(output).toEqual("Year 11 Chemistry, Foundation");
  });

  test("Year 10 Combined science, Higher", () => {
    const formattedData = {
      yearData: {
        "11": createYearData({
          units: [
            createUnit({
              year: "11",
              subject_slug: "chemistry",
              examboard: "AQA",
              tier: "Foundation",
            }),
          ],
        }),
      },
      threadOptions: [],
      tiers: ["foundation"],
      yearOptions: ["11"],
    };
    const year = "11";
    const slugs = {
      subjectSlug: "science",
      phaseSlug: "secondary",
      ks4OptionSlug: "gcse",
      keyStageSlug: undefined,
      tierSlug: "higher",
      childSubjectSlug: "chemistry",
    };
    const output = generateYearTitle(formattedData, year, slugs);
    expect(output).toEqual("Year 11 Chemistry, Higher");
  });

  // When a year has a subject title override (i.e. KS4 GCSE Computing = Computer science), update the subject name accordingly in the sheet title.
  test("Year 10 Computer science, GCSE", () => {
    const formattedData = {
      yearData: {
        "10": createYearData({
          units: [
            createUnit({
              year: "10",
              subject_slug: "computing",
              examboard: "AQA",
            }),
          ],
        }),
      },
      threadOptions: [],
      tiers: ["foundation"],
      yearOptions: ["10"],
    };
    const year = "10";
    const slugs = {
      subjectSlug: "computing",
      phaseSlug: "secondary",
      ks4OptionSlug: "aqa",
    };
    const output = generateYearTitle(formattedData, year, slugs);
    expect(output).toEqual("Year 10 Computer Science, GCSE");
  });

  // Year groups that do not have these modifiers (i.e. Years 1-9) should have default titles
  test("Year 9 Physical education", () => {
    const formattedData = {
      yearData: {
        "9": createYearData({
          units: [
            createUnit({
              year: "9",
              subject: "Physical education",
            }),
          ],
        }),
      },
      threadOptions: [],
      yearOptions: ["9"],
    };
    const year = "9";
    const slugs = {
      subjectSlug: "physical-education",
      phaseSlug: "secondary",
      ks4OptionSlug: undefined,
      keyStageSlug: undefined,
      tierSlug: undefined,
      childSubjectSlug: undefined,
    };
    const output = generateYearTitle(formattedData, year, slugs);
    expect(output).toEqual("Year 9 Physical education");
  });

  // When units are grouped as all-years, replace the sheet title with {groupAs} (all years) and the worksheet name with {groupAs}
  test("Swimming and water safety (all years)", () => {
    const formattedData = {
      yearData: {
        "all-years": createYearData({
          groupAs: "Swimming and water safety",
          units: [
            createUnit({
              year: "7",
            }),
          ],
        }),
      },
      threadOptions: [],
      yearOptions: ["all-years"],
    };
    const year = "all-years";
    const slugs = {
      subjectSlug: "physical-education",
      phaseSlug: "primary",
      ks4OptionSlug: undefined,
      keyStageSlug: undefined,
      tierSlug: undefined,
      childSubjectSlug: undefined,
    };
    const output = generateYearTitle(formattedData, year, slugs);
    expect(output).toEqual("Swimming and water safety (all years)");
  });
});

describe("ks4OptionSlugToPathway", () => {
  test("core", () => {
    expect(ks4OptionSlugToPathway("gcse")).toEqual("GCSE");
  });

  test("gcse", () => {
    expect(ks4OptionSlugToPathway("core")).toEqual("Core");
  });
});

describe("isExamboardSlug", () => {
  test("valid", () => {
    expect(isExamboardSlug("aqa")).toEqual(true);
  });

  test("invalid", () => {
    expect(isExamboardSlug("foo")).toEqual(false);
  });
});

describe("getSubjectOveride", () => {
  test("override", () => {
    expect(getSubjectOveride("english", "10", "aqa")).toEqual(undefined);
  });

  test("non-override", () => {
    expect(getSubjectOveride("computing", "10", "aqa")).toEqual(
      "Computer Science",
    );
  });
});

describe("generateSheetTitle", () => {
  test("non-grouping", () => {
    const formattedData = {
      yearData: {
        "10": createYearData({
          units: [
            createUnit({
              year: "10",
            }),
          ],
        }),
      },
      threadOptions: [],
      yearOptions: ["10"],
    };
    expect(generateSheetTitle(formattedData, "10")).toEqual("Year 10");
  });

  test("grouping", () => {
    const formattedData = {
      yearData: {
        "all-years": createYearData({
          groupAs: "Swimming and water safety",
          units: [
            createUnit({
              year: "3",
            }),
          ],
        }),
      },
      threadOptions: [],
      yearOptions: ["all-years"],
    };
    expect(generateSheetTitle(formattedData, "all-years")).toEqual(
      "Swimming and water safety",
    );
  });
});
