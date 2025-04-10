import {
  getYearGroupTitle,
  getPhaseText,
  getShortPhaseText,
  getSuffixFromFeatures,
  buildPageTitle,
  formatKeystagesShort,
  joinWords,
  pluralizeUnits,
  getYearSubheadingText,
  subjectTitleWithCase,
  getPhaseFromCategory,
  getPathwaySuffix,
} from "./formatting";

import { createYearData } from "@/fixtures/curriculum/yearData";
import { createFilter } from "@/fixtures/curriculum/filters";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createTier } from "@/fixtures/curriculum/tier";

describe("getYearGroupTitle", () => {
  describe("no suffix", () => {
    it("support all-years", () => {
      expect(
        getYearGroupTitle(
          {
            ["All years"]: {
              pathways: [],
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: true,
              groupAs: "Swimming",
            },
          },
          "All years",
        ),
      ).toEqual("Swimming (all years)");
    });

    it("support years", () => {
      expect(
        getYearGroupTitle(
          {
            ["7"]: {
              pathways: [],
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: false,
              groupAs: null,
            },
          },
          "7",
        ),
      ).toEqual("Year 7");
    });
  });

  describe("with suffix", () => {
    it("support all years", () => {
      expect(
        getYearGroupTitle(
          {
            ["All years"]: {
              pathways: [],
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: true,
              groupAs: "Swimming",
            },
          },
          "All years",
          "units",
        ),
      ).toEqual("Swimming units (all years)");
    });

    it("support years", () => {
      expect(
        getYearGroupTitle(
          {
            ["7"]: {
              pathways: [],
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: false,
              groupAs: null,
            },
          },
          "7",
          "units",
        ),
      ).toEqual("Year 7 units");
    });
  });
});

describe("getPhaseText", () => {
  it("ks1", () => {
    expect(getPhaseText({ slug: "primary" }, [{ slug: "ks1" }])).toEqual(
      "Key stage 1",
    );
    expect(getPhaseText({ slug: "secondary" }, [{ slug: "ks1" }])).toEqual("");
  });

  it("ks2", () => {
    expect(getPhaseText({ slug: "primary" }, [{ slug: "ks2" }])).toEqual(
      "Key stage 2",
    );
    expect(getPhaseText({ slug: "secondary" }, [{ slug: "ks2" }])).toEqual("");
  });

  it("ks1 & ks2", () => {
    expect(
      getPhaseText({ slug: "primary" }, [{ slug: "ks1" }, { slug: "ks2" }]),
    ).toEqual("Key stage 1 and 2");
    expect(
      getPhaseText({ slug: "secondary" }, [{ slug: "ks1" }, { slug: "ks2" }]),
    ).toEqual("");
  });

  it("ks3", () => {
    expect(getPhaseText({ slug: "primary" }, [{ slug: "ks3" }])).toEqual("");
    expect(getPhaseText({ slug: "secondary" }, [{ slug: "ks3" }])).toEqual(
      "Key stage 3",
    );
  });

  it("ks4", () => {
    expect(getPhaseText({ slug: "primary" }, [{ slug: "ks4" }])).toEqual("");
    expect(getPhaseText({ slug: "secondary" }, [{ slug: "ks4" }])).toEqual(
      "Key stage 4",
    );
  });

  it("ks3 & ks4", () => {
    expect(
      getPhaseText({ slug: "primary" }, [{ slug: "ks3" }, { slug: "ks4" }]),
    ).toEqual("");
    expect(
      getPhaseText({ slug: "secondary" }, [{ slug: "ks3" }, { slug: "ks4" }]),
    ).toEqual("Key stage 3 and 4");
  });

  it("missing", () => {
    expect(getPhaseText({ slug: "secondary" }, [])).toEqual("");
    expect(getPhaseText({ slug: "primary" }, [])).toEqual("");
  });
});

describe("getShortPhaseText", () => {
  it("ks1", () => {
    expect(getShortPhaseText({ slug: "primary" }, [{ slug: "ks1" }])).toEqual(
      "KS1",
    );
    expect(getShortPhaseText({ slug: "secondary" }, [{ slug: "ks1" }])).toEqual(
      "",
    );
  });

  it("ks2", () => {
    expect(getShortPhaseText({ slug: "primary" }, [{ slug: "ks2" }])).toEqual(
      "KS2",
    );
    expect(getShortPhaseText({ slug: "secondary" }, [{ slug: "ks2" }])).toEqual(
      "",
    );
  });

  it("ks1 & ks2", () => {
    expect(
      getShortPhaseText({ slug: "primary" }, [
        { slug: "ks1" },
        { slug: "ks2" },
      ]),
    ).toEqual("KS1 & KS2");
    expect(
      getShortPhaseText({ slug: "secondary" }, [
        { slug: "ks1" },
        { slug: "ks2" },
      ]),
    ).toEqual("");
  });

  it("ks3", () => {
    expect(getShortPhaseText({ slug: "primary" }, [{ slug: "ks3" }])).toEqual(
      "",
    );
    expect(getShortPhaseText({ slug: "secondary" }, [{ slug: "ks3" }])).toEqual(
      "KS3",
    );
  });

  it("ks4", () => {
    expect(getShortPhaseText({ slug: "primary" }, [{ slug: "ks4" }])).toEqual(
      "",
    );
    expect(getShortPhaseText({ slug: "secondary" }, [{ slug: "ks4" }])).toEqual(
      "KS4",
    );
  });

  it("ks3 & ks4", () => {
    expect(
      getShortPhaseText({ slug: "primary" }, [
        { slug: "ks3" },
        { slug: "ks4" },
      ]),
    ).toEqual("");
    expect(
      getShortPhaseText({ slug: "secondary" }, [
        { slug: "ks3" },
        { slug: "ks4" },
      ]),
    ).toEqual("KS3 & KS4");
  });

  it("missing", () => {
    expect(getShortPhaseText({ slug: "secondary" }, [])).toEqual("");
    expect(getShortPhaseText({ slug: "primary" }, [])).toEqual("");
  });
});

describe("getSuffixFromFeatures", () => {
  // TODO: Re-enable once data fixed in db-tools
  // it("value if override present", () => {
  //   expect(
  //     getSuffixFromFeatures({
  //       programme_field_overrides: {
  //         subject: "test",
  //       },
  //     }),
  //   ).toBe("(test)");
  // });

  it("undefined if override not present", () => {
    expect(getSuffixFromFeatures(undefined)).toBe(undefined);
  });
});

describe("buildPageTitle", () => {
  const testCases = [
    {
      input: {
        keyStages: ["ks1", "ks2"],
        subject: { title: "English", slug: "english" },
        phase: { title: "Primary", slug: "primary" },
      },
      expectedOutput: "KS1 & KS2 English curriculum",
    },
    {
      input: {
        keyStages: ["ks1", "ks2"],
        subject: { title: "French", slug: "french" },
        phase: { title: "Primary", slug: "primary" },
      },
      expectedOutput: "KS1 & KS2 French curriculum",
    },
    {
      input: {
        keyStages: ["ks1", "ks2"],
        subject: { title: "Spanish", slug: "spanish" },
        phase: { title: "Primary", slug: "primary" },
      },
      expectedOutput: "KS1 & KS2 Spanish curriculum",
    },
    {
      input: {
        keyStages: ["ks1", "ks2"],
        subject: { title: "German", slug: "german" },
        phase: { title: "Primary", slug: "primary" },
      },
      expectedOutput: "KS1 & KS2 German curriculum",
    },
    {
      input: {
        keyStages: ["ks1", "ks2"],
        subject: { title: "Art and design", slug: "art-and-design" },
        phase: { title: "Primary", slug: "primary" },
      },
      expectedOutput: "KS1 & KS2 art and design curriculum",
    },
    {
      input: {
        keyStages: ["ks3", "ks4"],
        subject: { title: "Maths", slug: "maths" },
        phase: { title: "Secondary", slug: "secondary" },
      },
      expectedOutput: "KS3 & KS4 maths curriculum",
    },
  ];

  for (const { input, expectedOutput } of testCases) {
    it(`output: ${expectedOutput}`, () => {
      const actualOutput = buildPageTitle(
        input.keyStages,
        input.subject,
        input.phase,
      );
      expect(expectedOutput).toEqual(actualOutput);
    });
  }
});

describe("formatKeystagesShort", () => {
  it("single", () => {
    expect(formatKeystagesShort(["ks1"])).toEqual("KS1");
    expect(formatKeystagesShort(["ks2"])).toEqual("KS2");
    expect(formatKeystagesShort(["ks3"])).toEqual("KS3");
    expect(formatKeystagesShort(["ks4"])).toEqual("KS4");
    expect(formatKeystagesShort([])).toEqual("");
  });

  it("multiple", () => {
    expect(formatKeystagesShort(["ks1", "ks2"])).toEqual("KS1-2");
    expect(formatKeystagesShort(["ks3", "ks4"])).toEqual("KS3-4");
    expect(formatKeystagesShort(["ks1", "ks3"])).toEqual("");
  });
});

describe("joinWords", () => {
  it("no empty words", () => {
    expect(joinWords(["one", "two", "three"])).toEqual("one two three");
  });

  it("with empty words", () => {
    expect(joinWords(["one", "", "two", "", "three"])).toEqual("one two three");
  });
});

describe("pluralizeUnits", () => {
  it("one", () => {
    expect(pluralizeUnits(1)).toEqual("unit");
  });
  it("many", () => {
    expect(pluralizeUnits(2)).toEqual("units");
  });
  it("none", () => {
    expect(pluralizeUnits(0)).toEqual("");
  });
});

describe("getYearSubheadingText", () => {
  const subCat1 = createSubjectCategory({ id: 1, title: "SUB_CAT_1" });
  const childSubject1 = createChildSubject({ subject_slug: "CHILD_SUBJECT_1" });
  const tier1 = createTier({ tier_slug: "TIER_1" });
  const data = {
    "7": createYearData({
      childSubjects: [childSubject1],
      subjectCategories: [subCat1],
      tiers: [tier1],
    }),
  };

  it("all year", () => {
    const result = getYearSubheadingText(
      data,
      "all",
      createFilter({
        years: ["7"],
        subjectCategories: [String(subCat1.id)],
        childSubjects: [childSubject1.subject_slug],
        tiers: [tier1.tier_slug],
      }),
      null,
    );
    expect(result).toEqual(null);
  });

  it("subjectCategories", () => {
    const result = getYearSubheadingText(
      data,
      "7",
      createFilter({
        years: ["7"],
        subjectCategories: [String(subCat1.id)],
      }),
      null,
    );
    expect(result).toEqual("SUB_CAT_1");
  });

  it("sortChildSubjects", () => {
    const result = getYearSubheadingText(
      data,
      "7",
      createFilter({
        years: ["7"],
        childSubjects: [childSubject1.subject_slug],
      }),
      null,
    );
    expect(result).toEqual("CHILD_SUBJECT_1");
  });

  it("tiers", () => {
    const result = getYearSubheadingText(
      data,
      "7",
      createFilter({
        years: ["7"],
        tiers: [tier1.tier_slug],
      }),
      null,
    );
    expect(result).toEqual("TIER_1");
  });

  it("all", () => {
    const result = getYearSubheadingText(
      data,
      "7",
      createFilter({
        years: ["7"],
        subjectCategories: [String(subCat1.id)],
        childSubjects: [childSubject1.subject_slug],
        tiers: [tier1.tier_slug],
      }),
      null,
    );
    expect(result).toEqual("SUB_CAT_1, CHILD_SUBJECT_1, TIER_1");
  });
});

describe("subjectTitleWithCase", () => {
  it("language", () => {
    expect(subjectTitleWithCase("english")).toEqual("English");
    expect(subjectTitleWithCase("french")).toEqual("French");
    expect(subjectTitleWithCase("spanish")).toEqual("Spanish");
    expect(subjectTitleWithCase("german")).toEqual("German");
  });

  it("non-language", () => {
    expect(subjectTitleWithCase("science")).toEqual("science");
    expect(subjectTitleWithCase("physical education")).toEqual(
      "physical education",
    );
  });
});

describe("getPhaseFromCategory", () => {
  it("handles secondary", () => {
    expect(getPhaseFromCategory("KS3")).toBe("secondary");
    expect(getPhaseFromCategory("KS4")).toBe("secondary");
  });

  it("handles primary", () => {
    expect(getPhaseFromCategory("KS1")).toBe("primary");
    expect(getPhaseFromCategory("KS2")).toBe("primary");
  });

  it("handles default as primary ", () => {
    expect(getPhaseFromCategory("EYFS")).toBe("primary");
    expect(getPhaseFromCategory("Therapies")).toBe("primary");
  });
});

describe("getPathwaySuffix", () => {
  it("should display nothing for non-ks4 years", () => {
    for (let year = 1; year < 10; year++) {
      expect(getPathwaySuffix(`${year}`, "core")).toEqual(undefined);
      expect(getPathwaySuffix(`${year}`, "gcse")).toEqual(undefined);
    }
  });
  it("should display nothing for non-ks4 years", () => {
    for (const year of ["10", "11"]) {
      expect(getPathwaySuffix(`${year}`, "core")).toEqual("Core");
      expect(getPathwaySuffix(`${year}`, "gcse")).toEqual("GCSE");
    }
  });
});
