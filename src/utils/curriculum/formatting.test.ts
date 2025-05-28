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
  const mockPortableTextBlocks = [
    {
      _key: "097a68d34883",
      markDefs: [],
      children: [
        {
          marks: [],
          text: "Use this KS3 and KS4 Eduqas English curriculum plan to support sequenced teaching in reading, writing and speaking. Aligned to the Eduqas GCSE specification, this curriculum helps pupils develop fluency in analysis and communication through a wide range of texts and topics.",
          _key: "4e7b5921e9960",
          _type: "span",
        },
      ],
      _type: "block",
      style: "normal",
    },
    {
      style: "normal",
      _key: "e068d634bd8e",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "Threads like 'non-fiction reading and writing', 'nineteenth century literature', and 'modern literature: identity and community' help track how core skills develop.",
          _key: "f6065a0d8cca0",
        },
      ],
      _type: "block",
    },
    {
      markDefs: [],
      children: [
        {
          _key: "0a798c4db6810",
          _type: "span",
          marks: [],
          text: "Year 7 English curriculum",
        },
      ],
      level: 1,
      _type: "block",
      style: "normal",
      _key: "8657dc8354f7",
      listItem: "bullet",
    },
    {
      style: "normal",
      _key: "57900e2ccbef",
      listItem: "bullet",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "Year 8 English curriculum",
          _key: "28dd9ebf1ff4",
        },
      ],
      level: 1,
      _type: "block",
    },
    {
      style: "normal",
      _key: "f1c99f0c129a",
      listItem: "bullet",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text: "Year 9 English curriculum",
          _key: "f32a71948df4",
        },
      ],
      level: 1,
      _type: "block",
    },
    {
      _key: "f54fec9824b3",
      listItem: "bullet",
      markDefs: [],
      children: [
        {
          text: "Year 10 English curriculum",
          _key: "293500634970",
          _type: "span",
          marks: [],
        },
      ],
      level: 1,
      _type: "block",
      style: "normal",
    },
    {
      style: "normal",
      _key: "c250609382a9",
      listItem: "bullet",
      markDefs: [],
      children: [
        {
          _key: "c3ead58b71c7",
          _type: "span",
          marks: [],
          text: "Year 11 English curriculum",
        },
      ],
      level: 1,
      _type: "block",
    },
    {
      _type: "block",
      style: "normal",
      _key: "128990f60e05",
      markDefs: [],
      children: [
        {
          text: "You can find the full lesson resources for KS3 and KS4 Eduqas English and download all the resources you need for free.",
          _key: "c23fc2e02d180",
          _type: "span",
          marks: [],
        },
      ],
    },
  ];

  it("should return empty string for empty or null input", () => {
    expect(truncatePortableTextBlock([])).toBe("");
    expect(
      truncatePortableTextBlock(null as unknown as PortableTextBlock[]),
    ).toBe("");
    expect(
      truncatePortableTextBlock(undefined as unknown as PortableTextBlock[]),
    ).toBe("");
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
    const shortBlocks = [
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
    const blocksWithoutChildren = [
      {
        _key: "no-children",
        markDefs: [],
        _type: "block",
        style: "normal",
      },
    ];

    const result = truncatePortableTextBlock(
      blocksWithoutChildren as unknown as PortableTextBlock[],
    );
    expect(result).toBe("");
  });

  it("should handle non-block types", () => {
    const nonBlockTypes = [
      {
        _key: "non-block",
        _type: "image",
        url: "example.jpg",
      },
    ];

    const result = truncatePortableTextBlock(
      nonBlockTypes as unknown as PortableTextBlock[],
    );
    expect(result).toBe("");
  });

  it("should handle children with non-span types", () => {
    const nonSpanChildren = [
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

    const result = truncatePortableTextBlock(
      nonSpanChildren as unknown as PortableTextBlock[],
    );
    expect(result).toBe("");
  });

  it("should trim whitespace properly", () => {
    const blocksWithWhitespace = [
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
    const mixedBlocks = [
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
        url: "example.jpg",
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

    const result = truncatePortableTextBlock(
      mixedBlocks as unknown as PortableTextBlock[],
      100,
    );
    expect(result).toBe("Valid text and more text");
  });
});
