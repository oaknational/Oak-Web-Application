import { PortableTextBlock } from "@portabletext/types";

import {
  getYearGroupTitle,
  getPhaseText,
  getShortPhaseText,
  buildPageTitle,
  formatKeystagesShort,
  joinWords,
  pluralizeUnits,
  getYearSubheadingText,
  subjectTitleWithCase,
  getPhaseFromCategory,
  getPathwaySuffix,
  truncatePortableTextBlock,
  getFilename,
} from "./formatting";

import { createYearData } from "@/fixtures/curriculum/yearData";
import { createFilter } from "@/fixtures/curriculum/filters";
import { createSubjectCategory } from "@/fixtures/curriculum/subjectCategories";
import { createChildSubject } from "@/fixtures/curriculum/childSubject";
import { createTier } from "@/fixtures/curriculum/tier";
import { mockPortableTextBlocks } from "@/components/CurriculumComponents/CurricVisualiser/CurricVisualiser.fixtures";

describe("getYearGroupTitle", () => {
  describe("no suffix", () => {
    it("support all-years", () => {
      expect(
        getYearGroupTitle(
          {
            ["all-years"]: {
              pathways: [],
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: true,
              groupAs: "Swimming",
            },
          },
          "all-years",
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
            ["all-years"]: {
              pathways: [],
              units: [],
              childSubjects: [],
              tiers: [],
              subjectCategories: [],
              isSwimming: true,
              groupAs: "Swimming",
            },
          },
          "all-years",
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
    "10": createYearData({
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

  it("displays subject from programme_field_overrides when it exists", () => {
    const actions = {
      programme_field_overrides: {
        subject: "Overridden Subject",
      },
    };

    const result = getYearSubheadingText(
      data,
      "7",
      createFilter({
        years: ["7"],
      }),
      null,
      actions,
    );

    expect(result).toEqual("Overridden Subject");
  });

  it("combines programme_field_overrides subject with other filters", () => {
    const actions = {
      programme_field_overrides: {
        subject: "Overridden Subject",
      },
    };

    const result = getYearSubheadingText(
      data,
      "7",
      createFilter({
        years: ["7"],
        subjectCategories: [subCat1.slug],
        childSubjects: [childSubject1.subject_slug],
        tiers: [tier1.tier_slug],
      }),
      null,
      actions,
    );

    expect(result).toEqual(
      "Overridden Subject, SUB_CAT_1, CHILD_SUBJECT_1, TIER_1",
    );
  });

  it("subjectCategories", () => {
    const result = getYearSubheadingText(
      data,
      "7",
      createFilter({
        years: ["7"],
        subjectCategories: [subCat1.slug],
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
        subjectCategories: [subCat1.slug],
        childSubjects: [childSubject1.subject_slug],
        tiers: [tier1.tier_slug],
      }),
      null,
    );
    expect(result).toEqual("SUB_CAT_1, CHILD_SUBJECT_1, TIER_1");
  });

  it("all", () => {
    const result = getYearSubheadingText(
      data,
      "7",
      createFilter({
        years: ["7"],
        subjectCategories: [subCat1.slug],
        childSubjects: [childSubject1.subject_slug],
        tiers: [tier1.tier_slug],
      }),
      null,
    );
    expect(result).toEqual("SUB_CAT_1, CHILD_SUBJECT_1, TIER_1");
  });

  describe("core/non-core", () => {
    it("core", () => {
      const result = getYearSubheadingText(
        data,
        "10",
        createFilter({
          years: ["10"],
          subjectCategories: [String(subCat1.id)],
          childSubjects: [childSubject1.subject_slug],
          tiers: [tier1.tier_slug],
        }),
        "core",
      );
      expect(result).toEqual("Core, CHILD_SUBJECT_1, TIER_1");
    });

    it("non-core", () => {
      const result = getYearSubheadingText(
        data,
        "10",
        createFilter({
          years: ["10"],
          subjectCategories: [String(subCat1.id)],
          childSubjects: [childSubject1.subject_slug],
          tiers: [tier1.tier_slug],
        }),
        "non_core",
      );
      expect(result).toEqual("GCSE, CHILD_SUBJECT_1, TIER_1");
    });
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
      expect(getPathwaySuffix(`${year}`, "non_core")).toEqual(undefined);
    }
  });
  it("should display nothing for non-ks4 years", () => {
    for (const year of ["10", "11"]) {
      expect(getPathwaySuffix(`${year}`, "core")).toEqual("Core");
      expect(getPathwaySuffix(`${year}`, "non_core")).toEqual("GCSE");
    }
  });
});

describe("truncatePortableTextBlock", () => {
  it("should return empty string for empty or null input", () => {
    expect(truncatePortableTextBlock([])).toBe("");
    expect(truncatePortableTextBlock(null)).toBe("");
    expect(truncatePortableTextBlock(undefined)).toBe("");
  });

  it("should extract and concatenate text from multiple blocks", () => {
    const result = truncatePortableTextBlock(mockPortableTextBlocks, 500);
    expect(result).toContain(
      "Use this KS3 and KS4 Eduqas English curriculum plan",
    );
    expect(result).toContain("Threads like 'non-fiction reading and writing'");
    expect(result).toContain("Year 7 English curriculum");
    expect(result).toContain("Year 8 English curriculum");
  });

  it("should truncate text to default maxLength of 100 characters", () => {
    const result = truncatePortableTextBlock(mockPortableTextBlocks);
    expect(result.length).toBeLessThanOrEqual(103); // 100 + "..." = 103
    expect(result).toMatch(/\.\.\.$/);
    expect(result).toBe(
      "Use this KS3 and KS4 Eduqas English curriculum plan to support sequenced teaching in reading, writin...",
    );
  });

  it("should truncate text to custom maxLength", () => {
    const result = truncatePortableTextBlock(mockPortableTextBlocks, 50);
    expect(result.length).toBeLessThanOrEqual(53); // 50 + "..." = 53
    expect(result).toMatch(/\.\.\.$/);
    expect(result).toBe(
      "Use this KS3 and KS4 Eduqas English curriculum pla...",
    );
  });

  it("should not truncate if text is shorter than maxLength", () => {
    const shortBlocks: PortableTextBlock[] = [
      {
        _key: "short",
        markDefs: [],
        children: [
          {
            marks: [],
            text: "Short text",
            _key: "short-key",
            _type: "span",
          },
        ],
        _type: "block",
        style: "normal",
      },
    ];

    const result = truncatePortableTextBlock(shortBlocks, 100);
    expect(result).toBe("Short text");
    expect(result).not.toMatch(/\.\.\.$/);
  });

  it("should handle blocks without children", () => {
    const blocksWithoutChildren: PortableTextBlock[] = [
      {
        _key: "no-children",
        markDefs: [],
        _type: "block",
        style: "normal",
        children: [],
      },
    ];

    const result = truncatePortableTextBlock(blocksWithoutChildren);
    expect(result).toBe("");
  });

  it("should handle non-block types", () => {
    const nonBlockTypes: PortableTextBlock[] = [
      {
        _key: "non-block",
        _type: "image",
        // url: "example.jpg",
        children: [],
      },
    ];

    const result = truncatePortableTextBlock(nonBlockTypes);
    expect(result).toBe("");
  });

  it("should handle children with non-span types", () => {
    const nonSpanChildren: PortableTextBlock[] = [
      {
        _key: "non-span",
        markDefs: [],
        children: [
          {
            marks: [],
            _key: "non-span-key",
            _type: "link",
            href: "example.com",
          },
        ],
        _type: "block",
        style: "normal",
      },
    ];

    const result = truncatePortableTextBlock(nonSpanChildren);
    expect(result).toBe("");
  });

  it("should trim whitespace properly", () => {
    const blocksWithWhitespace: PortableTextBlock[] = [
      {
        _key: "whitespace",
        markDefs: [],
        children: [
          {
            marks: [],
            text: "  Text with spaces  ",
            _key: "whitespace-key",
            _type: "span",
          },
        ],
        _type: "block",
        style: "normal",
      },
    ];

    const result = truncatePortableTextBlock(blocksWithWhitespace, 100);
    expect(result).toBe("Text with spaces");
    expect(result).not.toMatch(/^\s|\s$/);
  });

  it("should handle mixed content types correctly", () => {
    const mixedBlocks: PortableTextBlock[] = [
      {
        _key: "text-block",
        markDefs: [],
        children: [
          {
            marks: [],
            text: "Valid text",
            _key: "text-key",
            _type: "span",
          },
        ],
        _type: "block",
        style: "normal",
      },
      {
        _key: "image-block",
        _type: "image",
        // url: "example.jpg",
        children: [],
      },
      {
        _key: "another-text-block",
        markDefs: [],
        children: [
          {
            marks: [],
            text: "and more text",
            _key: "more-text-key",
            _type: "span",
          },
        ],
        _type: "block",
        style: "normal",
      },
    ];

    const result = truncatePortableTextBlock(mixedBlocks, 100);
    expect(result).toBe("Valid text and more text");
  });
});

describe("getFilename", () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(new Date("2025-06-10").getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("NC alignment xlsx files", () => {
    describe("Individual filename parameters and edge cases", () => {
      it("should generate filename with only phase", () => {
        const result = getFilename("xlsx", {
          subjectTitle: "Mathematics",
          phaseTitle: "Secondary",
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - Mathematics - Secondary - 10-06-2025.xlsx",
        );
      });

      it("should generate filename with phase and examboard", () => {
        const result = getFilename("xlsx", {
          subjectTitle: "English",
          phaseTitle: "Secondary",
          examboardTitle: "AQA",
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - English - Secondary - AQA - 10-06-2025.xlsx",
        );
      });

      it("should generate filename with phase and tier", () => {
        const result = getFilename("xlsx", {
          subjectTitle: "Mathematics",
          phaseTitle: "Secondary",
          tierSlug: "higher",
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - Mathematics - Secondary - Higher - 10-06-2025.xlsx",
        );
      });

      it("should generate filename with phase, examboard and tier", () => {
        const result = getFilename("xlsx", {
          subjectTitle: "Computing",
          phaseTitle: "Secondary",
          examboardTitle: "Edexcel",
          tierSlug: "foundation",
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - Computing - Secondary - Edexcel - Foundation - 10-06-2025.xlsx",
        );
      });

      it("should handle undefined tier slug", () => {
        const result = getFilename("xlsx", {
          subjectTitle: "History",
          phaseTitle: "Secondary",
          examboardTitle: "AQA",
          tierSlug: undefined,
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - History - Secondary - AQA - 10-06-2025.xlsx",
        );
      });

      it("should capitalise tier slug correctly", () => {
        const result = getFilename("xlsx", {
          subjectTitle: "Design and Technology",
          phaseTitle: "Secondary",
          tierSlug: "higher",
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - Design and Technology - Secondary - Higher - 10-06-2025.xlsx",
        );
      });

      it("should use child subject instead of main subject when available for NC alignment", () => {
        const result = getFilename("xlsx", {
          subjectTitle: "Science",
          phaseTitle: "Secondary",
          childSubjectSlug: "physics",
          examboardTitle: "Edexcel",
          tierSlug: "foundation",
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - Physics - Secondary - Edexcel - Foundation - 10-06-2025.xlsx",
        );
      });

      it("should use child subject with examboard and tier", () => {
        const result = getFilename("xlsx", {
          subjectTitle: "Science",
          phaseTitle: "Secondary",
          childSubjectSlug: "biology",
          examboardTitle: "AQA",
          tierSlug: "higher",
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - Biology - Secondary - AQA - Higher - 10-06-2025.xlsx",
        );
      });

      it("should handle empty strings by filtering them out", () => {
        const result = getFilename("docx", {
          subjectTitle: "Art",
          phaseTitle: "Primary",
          examboardTitle: "",
          tierSlug: "",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - Art - Primary - 10-06-2025.docx",
        );
      });

      it("should handle undefined child subject slug", () => {
        const result = getFilename("xlsx", {
          subjectTitle: "Mathematics",
          phaseTitle: "Secondary",
          childSubjectSlug: undefined,
          examboardTitle: "AQA",
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - Mathematics - Secondary - AQA - 10-06-2025.xlsx",
        );
      });

      it("should format date consistently", () => {
        // Test with a different date to ensure formatting is correct
        jest
          .spyOn(Date, "now")
          .mockReturnValue(new Date("2025-12-25").getTime());

        const result = getFilename("xlsx", {
          subjectTitle: "Computing",
          phaseTitle: "Secondary",
          prefix: "NC alignment",
        });
        expect(result).toBe(
          "NC alignment - Computing - Secondary - 25-12-2025.xlsx",
        );
      });
    });

    it("should generate NC alignment filename for Primary English", () => {
      const result = getFilename("xlsx", {
        subjectTitle: "English",
        phaseTitle: "Primary",
        prefix: "NC alignment",
      });
      expect(result).toBe("NC alignment - English - Primary - 10-06-2025.xlsx");
    });

    it("should generate NC alignment filename for Primary Science", () => {
      const result = getFilename("xlsx", {
        subjectTitle: "Science",
        phaseTitle: "Primary",
        prefix: "NC alignment",
      });
      expect(result).toBe("NC alignment - Science - Primary - 10-06-2025.xlsx");
    });

    it("should generate NC alignment filename for Secondary Science - Biology", () => {
      const result = getFilename("xlsx", {
        subjectTitle: "Science",
        phaseTitle: "Secondary",
        childSubjectSlug: "biology",
        examboardTitle: "AQA",
        tierSlug: "higher",
        prefix: "NC alignment",
      });
      expect(result).toBe(
        "NC alignment - Biology - Secondary - AQA - Higher - 10-06-2025.xlsx",
      );
    });

    it("should generate NC alignment filename for Secondary Science - Chemistry", () => {
      const result = getFilename("xlsx", {
        subjectTitle: "Science",
        phaseTitle: "Secondary",
        childSubjectSlug: "chemistry",
        examboardTitle: "Edexcel",
        tierSlug: "foundation",
        prefix: "NC alignment",
      });
      expect(result).toBe(
        "NC alignment - Chemistry - Secondary - Edexcel - Foundation - 10-06-2025.xlsx",
      );
    });

    it("should generate NC alignment filename for Secondary Science - Physics", () => {
      const result = getFilename("xlsx", {
        subjectTitle: "Science",
        phaseTitle: "Secondary",
        childSubjectSlug: "physics",
        examboardTitle: "Edexcel",
        tierSlug: "foundation",
        prefix: "NC alignment",
      });
      expect(result).toBe(
        "NC alignment - Physics - Secondary - Edexcel - Foundation - 10-06-2025.xlsx",
      );
    });

    it("should generate NC alignment filename for Secondary Science - Combined Science", () => {
      const result = getFilename("xlsx", {
        subjectTitle: "Science",
        phaseTitle: "Secondary",
        childSubjectSlug: "combined-science",
        examboardTitle: "OCR",
        tierSlug: "foundation",
        prefix: "NC alignment",
      });
      expect(result).toBe(
        "NC alignment - Combined Science - Secondary - OCR - Foundation - 10-06-2025.xlsx",
      );
    });

    it("should generate correct filename for Secondary Maths (no exam board)", () => {
      const result = getFilename("xlsx", {
        subjectTitle: "Mathematics",
        phaseTitle: "Secondary",
        tierSlug: "higher",
        prefix: "NC alignment",
      });
      expect(result).toBe(
        "NC alignment - Mathematics - Secondary - Higher - 10-06-2025.xlsx",
      );
    });
  });

  describe("Curriculum plan docx files", () => {
    describe("Individual filename parameters and edge cases", () => {
      it("should generate filename with only phase", () => {
        const result = getFilename("docx", {
          subjectTitle: "Mathematics",
          phaseTitle: "Secondary",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - Mathematics - Secondary - 10-06-2025.docx",
        );
      });

      it("should generate filename with phase and examboard", () => {
        const result = getFilename("docx", {
          subjectTitle: "English",
          phaseTitle: "Secondary",
          examboardTitle: "AQA",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - English - Secondary - AQA - 10-06-2025.docx",
        );
      });

      it("should generate filename with phase and tier", () => {
        const result = getFilename("docx", {
          subjectTitle: "Mathematics",
          phaseTitle: "Secondary",
          tierSlug: "higher",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - Mathematics - Secondary - Higher - 10-06-2025.docx",
        );
      });

      it("should generate filename with phase, examboard and tier", () => {
        const result = getFilename("docx", {
          subjectTitle: "Computing",
          phaseTitle: "Secondary",
          examboardTitle: "Edexcel",
          tierSlug: "foundation",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - Computing - Secondary - Edexcel - Foundation - 10-06-2025.docx",
        );
      });

      it("should handle undefined tier slug", () => {
        const result = getFilename("docx", {
          subjectTitle: "History",
          phaseTitle: "Secondary",
          examboardTitle: "AQA",
          tierSlug: undefined,
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - History - Secondary - AQA - 10-06-2025.docx",
        );
      });

      it("should capitalise tier slug correctly", () => {
        const result = getFilename("docx", {
          subjectTitle: "Design and Technology",
          phaseTitle: "Secondary",
          tierSlug: "higher",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - Design and Technology - Secondary - Higher - 10-06-2025.docx",
        );
      });

      it("should use main subject and child subject when available for Curriculum plan", () => {
        const result = getFilename("docx", {
          subjectTitle: "Science",
          phaseTitle: "Secondary",
          childSubjectSlug: "physics",
          examboardTitle: "Edexcel",
          tierSlug: "foundation",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - Science - Physics - Secondary - Edexcel - Foundation - 10-06-2025.docx",
        );
      });

      it("should handle empty strings by filtering them out", () => {
        const result = getFilename("docx", {
          subjectTitle: "Art",
          phaseTitle: "Primary",
          examboardTitle: "",
          tierSlug: "",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - Art - Primary - 10-06-2025.docx",
        );
      });

      it("should handle undefined child subject slug", () => {
        const result = getFilename("docx", {
          subjectTitle: "Mathematics",
          phaseTitle: "Secondary",
          childSubjectSlug: undefined,
          examboardTitle: "AQA",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - Mathematics - Secondary - AQA - 10-06-2025.docx",
        );
      });

      it("should format date consistently", () => {
        // Test with a different date to ensure formatting is correct
        jest
          .spyOn(Date, "now")
          .mockReturnValue(new Date("2025-12-25").getTime());

        const result = getFilename("docx", {
          subjectTitle: "English",
          phaseTitle: "Secondary",
          prefix: "Curriculum plan",
        });
        expect(result).toBe(
          "Curriculum plan - English - Secondary - 25-12-2025.docx",
        );
      });
    });

    it("should generate Curriculum plan filename for Primary English", () => {
      const result = getFilename("docx", {
        subjectTitle: "English",
        phaseTitle: "Primary",
        prefix: "Curriculum plan",
      });
      expect(result).toBe(
        "Curriculum plan - English - Primary - 10-06-2025.docx",
      );
    });

    it("should generate Curriculum plan filename for Primary Science", () => {
      const result = getFilename("docx", {
        subjectTitle: "Science",
        phaseTitle: "Primary",
        prefix: "Curriculum plan",
      });
      expect(result).toBe(
        "Curriculum plan - Science - Primary - 10-06-2025.docx",
      );
    });

    it("should generate Curriculum plan filename for Secondary Science – Biology", () => {
      const result = getFilename("docx", {
        subjectTitle: "Science",
        phaseTitle: "Secondary",
        childSubjectSlug: "biology",
        examboardTitle: "AQA",
        tierSlug: "higher",
        prefix: "Curriculum plan",
      });
      expect(result).toBe(
        "Curriculum plan - Science - Biology - Secondary - AQA - Higher - 10-06-2025.docx",
      );
    });

    it("should generate Curriculum plan filename for Secondary Science – Chemistry", () => {
      const result = getFilename("docx", {
        subjectTitle: "Science",
        phaseTitle: "Secondary",
        childSubjectSlug: "chemistry",
        examboardTitle: "Edexcel",
        tierSlug: "foundation",
        prefix: "Curriculum plan",
      });
      expect(result).toBe(
        "Curriculum plan - Science - Chemistry - Secondary - Edexcel - Foundation - 10-06-2025.docx",
      );
    });

    it("should generate Curriculum plan filename for Secondary Science – Physics", () => {
      const result = getFilename("docx", {
        subjectTitle: "Science",
        phaseTitle: "Secondary",
        childSubjectSlug: "physics",
        examboardTitle: "Edexcel",
        tierSlug: "foundation",
        prefix: "Curriculum plan",
      });
      expect(result).toBe(
        "Curriculum plan - Science - Physics - Secondary - Edexcel - Foundation - 10-06-2025.docx",
      );
    });

    it("should generate Curriculum plan filename for Secondary Science – Combined Science", () => {
      const result = getFilename("docx", {
        subjectTitle: "Science",
        phaseTitle: "Secondary",
        childSubjectSlug: "combined-science",
        examboardTitle: "OCR",
        tierSlug: "foundation",
        prefix: "Curriculum plan",
      });
      expect(result).toBe(
        "Curriculum plan - Science - Combined Science - Secondary - OCR - Foundation - 10-06-2025.docx",
      );
    });

    it("should generate correct filename for Secondary Maths (no exam board)", () => {
      const result = getFilename("docx", {
        subjectTitle: "Mathematics",
        phaseTitle: "Secondary",
        tierSlug: "higher",
        prefix: "Curriculum plan",
      });
      expect(result).toBe(
        "Curriculum plan - Mathematics - Secondary - Higher - 10-06-2025.docx",
      );
    });
  });
});
